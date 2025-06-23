// Update seller.go

package main

import (
    "crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func initDB() {
	var err error
	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("✅ Connected to PostgreSQL")
}

func generateSecretKey() string {
	bytes := make([]byte, 64)
	_, err := rand.Read(bytes)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(bytes)
}

var jwtKey = []byte(generateSecretKey())

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

type ProfileResponse struct {
	Name         string `json:"name"`
	Username     string `json:"username"`
	Mobile       string `json:"mobile"`
	Email        string `json:"email"`
	Address      string `json:"address"`
	District     string `json:"district"`
	State        string `json:"state"`
	Country      string `json:"country"`
	Pincode      string `json:"pincode"`
	ProfileImage string `json:"profile_image,omitempty"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	_, err = db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
		req.Name, req.Username, string(hashedPassword))
	if err != nil {
		if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
			http.Error(w, "Username already exists", http.StatusConflict)
		} else {
			http.Error(w, "Registration failed", http.StatusInternalServerError)
		}
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Registered successfully"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	var hashed string
	var userID int
	err := db.QueryRow("SELECT id, password FROM users WHERE username=$1", creds.Username).Scan(&userID, &hashed)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashed), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	exp := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: creds.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tkn, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"token": tkn})
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing token", http.StatusUnauthorized)
			return
		}

		tkn := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tkn, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var user struct {
		Name, Username, Mobile, Email, Address, District, State, Country, Pincode string
		ProfileImage                                                              []byte
	}
	err = db.QueryRow(`
		SELECT name, username, mobile, email, address, district, state, 
			   country, pincode, profile_image
		FROM users WHERE username=$1`, claims.Username).
		Scan(&user.Name, &user.Username, &user.Mobile, &user.Email,
			&user.Address, &user.District, &user.State, &user.Country,
			&user.Pincode, &user.ProfileImage)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	response := ProfileResponse{
		Name:     user.Name,
		Username: user.Username,
		Mobile:   user.Mobile,
		Email:    user.Email,
		Address:  user.Address,
		District: user.District,
		State:    user.State,
		Country:  user.Country,
		Pincode:  user.Pincode,
	}

	if len(user.ProfileImage) > 0 {
		response.ProfileImage = base64.StdEncoding.EncodeToString(user.ProfileImage)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	err = r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		http.Error(w, "Form error: "+err.Error(), http.StatusBadRequest)
		return
	}

	name := r.FormValue("name")
	mobile := r.FormValue("mobile")
	email := r.FormValue("email")
	address := r.FormValue("address")
	district := r.FormValue("district")
	state := r.FormValue("state")
	country := r.FormValue("country")
	pincode := r.FormValue("pincode")

	var imageData []byte
	file, _, err := r.FormFile("image")
	if err == nil {
		defer file.Close()
		imageData, err = io.ReadAll(file)
		if err != nil {
			http.Error(w, "Error reading image: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}

	var result sql.Result
	if len(imageData) > 0 {
		result, err = db.Exec(`
			UPDATE users SET name=$1, mobile=$2, email=$3, address=$4, district=$5,
			state=$6, country=$7, pincode=$8, profile_image=$9
			WHERE username=$10`,
			name, mobile, email, address, district, state, country,
			pincode, imageData, claims.Username)
	} else {
		result, err = db.Exec(`
			UPDATE users SET name=$1, mobile=$2, email=$3, address=$4, district=$5,
			state=$6, country=$7, pincode=$8
			WHERE username=$9`,
			name, mobile, email, address, district, state, country,
			pincode, claims.Username)
	}

	if err != nil {
		http.Error(w, "Update failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Failed to check update status", http.StatusInternalServerError)
		return
	}
	if rowsAffected == 0 {
		http.Error(w, "No user found to update", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}


func getClaimsFromRequest(r *http.Request) (*Claims, error) {
	authHeader := r.Header.Get("Authorization")
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}

func UploadProductHandler(w http.ResponseWriter, r *http.Request) {
	err := r.ParseMultipartForm(20 << 20) // 20 MB
	if err != nil {
		http.Error(w, "Form error: "+err.Error(), http.StatusBadRequest)
		return
	}

	readImage := func(key string) []byte {
		file, _, err := r.FormFile(key)
		if err != nil {
			return nil
		}
		defer file.Close()
		data, _ := io.ReadAll(file)
		return data
	}

	name := r.FormValue("name")
	description := r.FormValue("description")
	category := r.FormValue("category")
	subcategory := r.FormValue("subcategory")
	innerSubcategory := r.FormValue("inner_subcategory")
	price, err := strconv.ParseFloat(r.FormValue("price"), 64)
	if err != nil {
		http.Error(w, "Invalid price", http.StatusBadRequest)
		return
	}
	quantity, err := strconv.Atoi(r.FormValue("quantity"))
	if err != nil {
		http.Error(w, "Invalid quantity", http.StatusBadRequest)
		return
	}

	img1 := readImage("image1")
	img2 := readImage("image2")
	img3 := readImage("image3")
	img4 := readImage("image4")

	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	_, err = db.Exec(`INSERT INTO products 
	(name, description, category, subcategory, inner_subcategory, quantity, price, image1, image2, image3, image4, in_stock, username)
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true, $12)`,
		name, description, category, subcategory, innerSubcategory, quantity, price, img1, img2, img3, img4, claims.Username)

	if err != nil {
		http.Error(w, "Upload error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Product uploaded successfully"})
}

func GetMyProductsHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := db.Query(`SELECT id, name, category, price, quantity, image1, in_stock 
		FROM products WHERE username=$1 ORDER BY id DESC`, claims.Username)
	if err != nil {
		http.Error(w, "Failed to retrieve products: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var id, quantity int
		var name, category string
		var price float64
		var image1 []byte
		var inStock bool

		if err := rows.Scan(&id, &name, &category, &price, &quantity, &image1, &inStock); err != nil {
			continue
		}

		product := map[string]interface{}{
			"id":       id,
			"name":     name,
			"category": category,
			"price":    price,
			"quantity": quantity,
			"in_stock": inStock,
		}

		if len(image1) > 0 {
			product["image1"] = base64.StdEncoding.EncodeToString(image1)
		}

		products = append(products, product)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func UpdateStockHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	id := strings.TrimPrefix(r.URL.Path, "/products/")
	id = strings.TrimSuffix(id, "/stock")

	var body struct {
		InStock bool `json:"in_stock"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("UPDATE products SET in_stock=$1 WHERE id=$2", body.InStock, id)
	if err != nil {
		http.Error(w, "Failed to update stock: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Stock updated successfully"})
}

func UpdatePriceHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	id := strings.TrimPrefix(r.URL.Path, "/products/")
	id = strings.TrimSuffix(id, "/price")

	var body struct {
		Price float64 `json:"price"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	_, err := db.Exec("UPDATE products SET price=$1 WHERE id=$2", body.Price, id)
	if err != nil {
		http.Error(w, "Failed to update price: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Price updated successfully"})
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	response := map[string]string{
		"message": fmt.Sprintf("✅ You are authenticated as %s", claims.Username),
	}
	json.NewEncoder(w).Encode(response)
}

func main() {
	initDB()
	defer db.Close()

	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		username TEXT UNIQUE NOT NULL,
		password TEXT NOT NULL,
		mobile TEXT,
		email TEXT,
		address TEXT,
		district TEXT,
		state TEXT,
		country TEXT,
		pincode TEXT,
		profile_image BYTEA,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		panic("Failed to create users table: " + err.Error())
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS products (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		description TEXT,
		category TEXT,
		subcategory TEXT,
		inner_subcategory TEXT,
		quantity INT DEFAULT 0,
		price NUMERIC(10,2) DEFAULT 0,
		image1 BYTEA,
		image2 BYTEA,
		image3 BYTEA,
		image4 BYTEA,
		in_stock BOOLEAN DEFAULT true,
		username TEXT,  -- ✅ Add this line to track which user uploaded the product
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	)`)

	if err != nil {
		panic("Failed to create products table: " + err.Error())
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))
	mux.Handle("/upload", AuthMiddleware(http.HandlerFunc(UploadProductHandler)))
	mux.Handle("/profile", AuthMiddleware(http.HandlerFunc(GetProfileHandler)))
	mux.Handle("/profile/update", AuthMiddleware(http.HandlerFunc(UpdateProfileHandler)))
	mux.Handle("/products", AuthMiddleware(http.HandlerFunc(GetMyProductsHandler)))
	mux.Handle("/products/", AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			if strings.HasSuffix(r.URL.Path, "/stock") {
				UpdateStockHandler(w, r)
			} else if strings.HasSuffix(r.URL.Path, "/price") {
				UpdatePriceHandler(w, r)
			} else {
				http.Error(w, "Not found", http.StatusNotFound)
			}
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler(mux)

	server := &http.Server{
		Addr:         ":8080",
		Handler:      corsHandler,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	fmt.Println("🚀 Server running on http://localhost:8080")
	if err := server.ListenAndServe(); err != nil {
		panic("Server failed: " + err.Error())
	}
}




