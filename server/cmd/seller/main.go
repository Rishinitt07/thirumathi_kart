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
	"math/big"
	"net/http"
	"net/smtp"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var buyerDB *sql.DB
var deliveryDB *sql.DB

func initDB() {
	var err error
	connStr := "user=postgres password=dharun123 dbname=mydb sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}

	buyerConnStr := "user=postgres password=dharun123 dbname=buyerdb sslmode=disable"
	buyerDB, err = sql.Open("postgres", buyerConnStr)
	if err != nil {
		panic(err)
	}
	if err = buyerDB.Ping(); err != nil {
		panic(err)
	}

	deliveryConnStr := "user=postgres password=dharun123 dbname=deliverydb sslmode=disable"
	deliveryDB, err = sql.Open("postgres", deliveryConnStr)
	if err != nil {
		panic(err)
	}
	if err = deliveryDB.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("✅ Connected to PostgreSQL (Seller, Buyer, Delivery)")
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
	Mobile   string `json:"mobile"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Mobile    string `json:"mobile"`
	Password  string `json:"password"`

	Email string `json:"email"`
}

type Claims struct {
	Mobile string `json:"mobile"`
	jwt.RegisteredClaims
}

type ProfileResponse struct {
	Name         string `json:"name"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Gender       string `json:"gender"`
	Mobile       string `json:"mobile"`
	Email        string `json:"email"`
	StoreName    string `json:"store_name"`
	AddressLine1 string `json:"address_line_1"`
	AddressLine2 string `json:"address_line_2"`
	Area         string `json:"area"`
	Landmark     string `json:"landmark"`
	City         string `json:"city"`
	State        string `json:"state"`
	Country      string `json:"country"`
	Pincode      string `json:"pincode"`
	ProfileImage string `json:"profile_image,omitempty"`
	AboutStore   string `json:"about_store"`
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		fmt.Println("Decode error:", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("Bcrypt error:", err)
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	name := strings.TrimSpace(req.FirstName + " " + req.LastName)
	_, err = db.Exec("INSERT INTO users (mobile, name, first_name, last_name, password, email) VALUES ($1, $2, $3, $4, $5, $6)",
		req.Mobile, name, req.FirstName, req.LastName, string(hashedPassword), req.Email)
	if err != nil {
		fmt.Println("DB Insert error:", err)
		if strings.Contains(err.Error(), "duplicate key value") {
			http.Error(w, "Account already registered", http.StatusConflict)
		} else {
			http.Error(w, "Registration failed", http.StatusInternalServerError)
		}
		return
	}

	fmt.Println("Registration successful for:", req.Mobile)
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

	var hashedPassword, mobile string
	err := db.QueryRow(`SELECT password, mobile FROM users WHERE mobile=$1 OR email=$1`, creds.Mobile).
		Scan(&hashedPassword, &mobile)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	exp := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Mobile: mobile,
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
		Name, FirstName, LastName, Gender, Mobile, Email, StoreName, AddressLine1, AddressLine2, Area, Landmark, City, State, Country, Pincode, AboutStore string
		ProfileImage                                                                                                                                       []byte
	}
	err = db.QueryRow(`
		SELECT name, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(gender, ''), mobile, 
		       COALESCE(email, ''), COALESCE(store_name, ''), COALESCE(address_line_1, ''), COALESCE(address_line_2, ''), COALESCE(area, ''), COALESCE(landmark, ''), COALESCE(city, ''), COALESCE(state, ''), 
		       COALESCE(country, ''), COALESCE(pincode, ''), COALESCE(about_store, ''), COALESCE(profile_image, '\x'::bytea)
		FROM users WHERE mobile=$1`, claims.Mobile).
		Scan(&user.Name, &user.FirstName, &user.LastName, &user.Gender, &user.Mobile, &user.Email,
			&user.StoreName, &user.AddressLine1, &user.AddressLine2, &user.Area, &user.Landmark, &user.City, &user.State, &user.Country,
			&user.Pincode, &user.AboutStore, &user.ProfileImage)

	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
		} else {
			http.Error(w, "Database error", http.StatusInternalServerError)
		}
		return
	}

	response := ProfileResponse{
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Name:         user.Name,
		Gender:       user.Gender,
		Mobile:       user.Mobile,
		Email:        user.Email,
		StoreName:    user.StoreName,
		AddressLine1: user.AddressLine1,
		AddressLine2: user.AddressLine2,
		Area:         user.Area,
		Landmark:     user.Landmark,
		City:         user.City,
		State:        user.State,
		Country:      user.Country,
		Pincode:      user.Pincode,
		AboutStore:   user.AboutStore,
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

	firstName := r.FormValue("first_name")
	lastName := r.FormValue("last_name")
	name := strings.TrimSpace(firstName + " " + lastName)
	gender := r.FormValue("gender")
	email := r.FormValue("email")
	storeName := r.FormValue("store_name")
	addressLine1 := r.FormValue("address_line_1")
	addressLine2 := r.FormValue("address_line_2")
	area := r.FormValue("area")
	landmark := r.FormValue("landmark")
	city := r.FormValue("city")
	state := r.FormValue("state")
	country := r.FormValue("country")
	pincode := r.FormValue("pincode")
	aboutStore := r.FormValue("about_store")

	var imageData []byte
	file, _, err := r.FormFile("image")
	if err == nil {
		defer file.Close()
		imageData, err = io.ReadAll(file)
		if err != nil {
			http.Error(w, "Error reading image: "+err.Error(), http.StatusInternalServerError)
			return
		}
	} else if err != http.ErrMissingFile {
		http.Error(w, "Error uploading image: "+err.Error(), http.StatusBadRequest)
		return
	}

	var result sql.Result
	if len(imageData) > 0 {
		result, err = db.Exec(`
			UPDATE users SET 
				first_name=$1, last_name=$2, name=$3, gender=$4, email=$5,
				store_name=$6, address_line_1=$7, address_line_2=$8, area=$9,
				landmark=$10, city=$11, state=$12, country=$13, pincode=$14,
				profile_image=$15, updated_at=CURRENT_TIMESTAMP, about_store=$16
			WHERE mobile=$17`,
			firstName, lastName, name, gender, email,
			storeName, addressLine1, addressLine2, area,
			landmark, city, state, country, pincode,
			imageData, aboutStore, claims.Mobile)
	} else {
		result, err = db.Exec(`
			UPDATE users SET 
				first_name=$1, last_name=$2, name=$3, gender=$4, email=$5,
				store_name=$6, address_line_1=$7, address_line_2=$8, area=$9,
				landmark=$10, city=$11, state=$12, country=$13, pincode=$14,
				updated_at=CURRENT_TIMESTAMP, about_store=$15
			WHERE mobile=$16`,
			firstName, lastName, name, gender, email,
			storeName, addressLine1, addressLine2, area,
			landmark, city, state, country, pincode, aboutStore, claims.Mobile)
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
	unit := r.FormValue("unit")
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
    (name, description, category, subcategory, unit, quantity, price, image1, image2, image3, image4, in_stock, mobile)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true, $12)`,
		name, description, category, subcategory, unit, quantity, price, img1, img2, img3, img4, claims.Mobile)

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

	rows, err := db.Query(`SELECT id, name, category, subcategory, unit, description, price, quantity, 
		image1, image2, image3, image4, in_stock 
		FROM products WHERE mobile=$1 ORDER BY id DESC`, claims.Mobile)
	if err != nil {
		http.Error(w, "Failed to retrieve products: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var (
			id, quantity                                   int
			name, category, subcategory, unit, description string
			price                                          float64
			image1, image2, image3, image4                 []byte
			inStock                                        bool
		)

		if err := rows.Scan(&id, &name, &category, &subcategory, &unit, &description, &price, &quantity,
			&image1, &image2, &image3, &image4, &inStock); err != nil {
			continue
		}

		product := map[string]interface{}{
			"id":          id,
			"name":        name,
			"category":    category,
			"subcategory": subcategory,
			"unit":        unit,
			"description": description,
			"price":       price,
			"quantity":    quantity,
			"in_stock":    inStock,
		}

		if len(image1) > 0 {
			product["image1"] = base64.StdEncoding.EncodeToString(image1)
		}
		if len(image2) > 0 {
			product["image2"] = base64.StdEncoding.EncodeToString(image2)
		}
		if len(image3) > 0 {
			product["image3"] = base64.StdEncoding.EncodeToString(image3)
		}
		if len(image4) > 0 {
			product["image4"] = base64.StdEncoding.EncodeToString(image4)
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

func GetAllProductsHandler(w http.ResponseWriter, r *http.Request) {
	category := r.URL.Query().Get("category")
	subcategory := r.URL.Query().Get("subcategory")
	sellerMobile := r.URL.Query().Get("seller_mobile")

	query := `SELECT p.id, p.name, COALESCE(p.category, ''), COALESCE(p.subcategory, ''), COALESCE(p.unit, ''), COALESCE(p.description, ''), p.price, p.quantity, 
		p.image1, p.image2, p.image3, p.image4, p.in_stock,
		u.mobile, u.name, COALESCE(u.city, ''), COALESCE(u.state, ''), u.created_at, u.latitude, u.longitude
		FROM products p
		JOIN users u ON p.mobile = u.mobile
		WHERE p.in_stock=true`
	var args []interface{}
	argId := 1

	if category != "" && category != "All" {
		query += fmt.Sprintf(" AND p.category=$%d", argId)
		args = append(args, category)
		argId++
		if subcategory != "" && subcategory != "All" {
			query += fmt.Sprintf(" AND p.subcategory=$%d", argId)
			args = append(args, subcategory)
			argId++
		}
	}

	if sellerMobile != "" {
		query += fmt.Sprintf(" AND p.mobile=$%d", argId)
		args = append(args, sellerMobile)
		argId++
	}

	query += " ORDER BY p.created_at DESC"

	rows, err := db.Query(query, args...)
	if err != nil {
		http.Error(w, "Failed to retrieve products: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []map[string]interface{}
	for rows.Next() {
		var (
			id, quantity                                       int
			name, category, subcategory, unit, description     string
			price                                              float64
			image1, image2, image3, image4                     []byte
			inStock                                            bool
			sellerMob, sellerName, sellerDistrict, sellerState string
			sellerCreatedAt                                    time.Time
			sellerLat, sellerLng                               float64
		)

		if err := rows.Scan(&id, &name, &category, &subcategory, &unit, &description, &price, &quantity,
			&image1, &image2, &image3, &image4, &inStock,
			&sellerMob, &sellerName, &sellerDistrict, &sellerState, &sellerCreatedAt, &sellerLat, &sellerLng); err != nil {
			continue
		}

		product := map[string]interface{}{
			"id":              id,
			"name":            name,
			"category":        category,
			"subcategory":     subcategory,
			"unit":            unit,
			"description":     description,
			"price":           price,
			"quantity":        quantity,
			"in_stock":        inStock,
			"seller_mobile":   sellerMob,
			"seller_name":     sellerName,
			"seller_district": sellerDistrict,
			"seller_state":    sellerState,
			"seller_joined":   sellerCreatedAt.Format("January 2006"),
			"seller_lat":      sellerLat,
			"seller_lng":      sellerLng,
		}

		if len(image1) > 0 {
			product["image1"] = base64.StdEncoding.EncodeToString(image1)
		}
		if len(image2) > 0 {
			product["image2"] = base64.StdEncoding.EncodeToString(image2)
		}
		if len(image3) > 0 {
			product["image3"] = base64.StdEncoding.EncodeToString(image3)
		}
		if len(image4) > 0 {
			product["image4"] = base64.StdEncoding.EncodeToString(image4)
		}

		products = append(products, product)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if products == nil {
		products = []map[string]interface{}{}
	}
	json.NewEncoder(w).Encode(products)
}

func UpdateProductHandler(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/products/")
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
	category := r.FormValue("category")
	subcategory := r.FormValue("subcategory")
	description := r.FormValue("description")
	unit := r.FormValue("unit")
	inStock := r.FormValue("in_stock") == "true"
	price, _ := strconv.ParseFloat(r.FormValue("price"), 64)
	quantity, _ := strconv.Atoi(r.FormValue("quantity"))

	// Build update query dynamically
	set := []string{
		"name=$1", "category=$2", "subcategory=$3", "description=$4", "unit=$5",
		"quantity=$6", "price=$7", "in_stock=$8",
	}
	values := []interface{}{name, category, subcategory, description, unit, quantity, price, inStock}
	imgIndex := 9

	// Conditionally add image updates
	for i := 1; i <= 4; i++ {
		img := readImage(fmt.Sprintf("image%d", i))
		if img != nil {
			set = append(set, fmt.Sprintf("image%d=$%d", i, imgIndex))
			values = append(values, img)
			imgIndex++
		}
	}

	values = append(values, id)
	query := fmt.Sprintf("UPDATE products SET %s WHERE id=$%d", strings.Join(set, ","), imgIndex)

	_, err = db.Exec(query, values...)
	if err != nil {
		http.Error(w, "Update failed: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Product updated successfully"})
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

func DeleteProductHandler(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/products/")

	// 🔐 Check product ownership
	claims, _ := getClaimsFromRequest(r)
	res := db.QueryRow("SELECT mobile FROM products WHERE id=$1", id)
	var owner string
	res.Scan(&owner)
	if owner != claims.Mobile {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	_, err := db.Exec("DELETE FROM products WHERE id=$1", id)
	if err != nil {
		http.Error(w, "Failed to delete: "+err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Deleted successfully"})
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	response := map[string]string{
		"message": fmt.Sprintf("✅ You are authenticated as %s", claims.Mobile),
	}
	json.NewEncoder(w).Encode(response)
}

func DeleteAccountHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// First delete all products associated with the seller
	_, err = db.Exec(`DELETE FROM products WHERE mobile=$1`, claims.Mobile)
	if err != nil {
		http.Error(w, "Failed to delete seller products", http.StatusInternalServerError)
		return
	}

	// Then delete the seller account
	_, err = db.Exec(`DELETE FROM users WHERE mobile=$1`, claims.Mobile)
	if err != nil {
		http.Error(w, "Failed to delete account", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Account deleted successfully"})
}

var otpStore = make(map[string]string)

type OTPRequest struct {
	Email  string `json:"email"`
	Mobile string `json:"mobile"`
	OTP    string `json:"otp,omitempty"`
}

func SendOTPHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req OTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// We expect req.Email to be provided
	identifier := req.Email
	if identifier == "" {
		identifier = req.Mobile
	}

	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	otpVal := "123456"
	if err == nil {
		otpVal = fmt.Sprintf("%06d", n.Int64())
	}
	otpStore[identifier] = otpVal

	fmt.Printf("\n--- OTP FOR %s IS: %s ---\n\n", identifier, otpVal)

	// SMTP Logic
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	smtpEmail := os.Getenv("SMTP_EMAIL")
	smtpPass := os.Getenv("SMTP_PASS")

	if smtpEmail != "" && smtpPass != "" {
		auth := smtp.PlainAuth("", smtpEmail, smtpPass, smtpHost)
		subject := "Subject: Verify Your Email - TKart\r\n"
		headers := "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n"

		body := "Hello,<br><br>" +
			"Welcome to TKart! 🌸<br><br>" +
			"Your verification code is:<br><br>" +
			"<strong>" + otpVal + "</strong><br><br>" +
			"This OTP is valid for 10 minutes.<br><br>" +
			"Please do not share this code with anyone.<br><br>" +
			"If you did not request this verification, you can safely ignore this email.<br><br>" +
			"Thank you,<br>" +
			"Team TKart<br>" +
			"Empowering Women Entrepreneurs<br>"

		msg := []byte("To: " + identifier + "\r\n" + subject + headers + "\r\n" + body)
		err = smtp.SendMail(smtpHost+":"+smtpPort, auth, smtpEmail, []string{identifier}, msg)
		if err != nil {
			fmt.Printf("SMTP Error: %v\n", err)
		} else {
			fmt.Printf("OTP sent to %s via email!\n", identifier)
		}
	} else {
		fmt.Printf("SMTP credentials not provided in .env! Printing OTP to console instead.\n")
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "OTP Sent", "otp": otpVal})
}

func VerifyOTPHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req OTPRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	identifier := req.Email
	if identifier == "" {
		identifier = req.Mobile
	}
	storedOTP, exists := otpStore[identifier]
	if !exists || storedOTP != req.OTP {
		http.Error(w, "Invalid OTP", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "OTP Verified"})
}

func GetSellerInfoHandler(w http.ResponseWriter, r *http.Request) {
	mobile := r.URL.Query().Get("mobile")
	if mobile == "" {
		http.Error(w, "mobile is required", http.StatusBadRequest)
		return
	}

	var name, district, state, aboutStore string
	var createdAt time.Time
	err := db.QueryRow("SELECT name, city, state, COALESCE(about_store, ''), created_at FROM users WHERE mobile=$1", mobile).Scan(&name, &district, &state, &aboutStore, &createdAt)
	if err != nil {
		http.Error(w, "Seller not found", http.StatusNotFound)
		return
	}

	var productCount int
	db.QueryRow("SELECT COUNT(*) FROM products WHERE mobile=$1 AND in_stock=true", mobile).Scan(&productCount)

	seller := map[string]interface{}{
		"mobile":        mobile,
		"name":          name,
		"district":      district,
		"state":         state,
		"description":   aboutStore,
		"joined":        createdAt.Format("January 2006"),
		"product_count": productCount,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(seller)
}

func GetDashboardStatsHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	sellerMobile := claims.Mobile

	// Fetch Orders & Revenue from buyerdb
	query := `
		SELECT o.id, o.date, o.status, o.items
		FROM orders o
		WHERE o.items @> $1
		ORDER BY o.date ASC
	`
	searchJSON := fmt.Sprintf(`[{"seller_mobile": "%s"}]`, sellerMobile)
	rows, err := buyerDB.Query(query, searchJSON)

	var totalRevenue float64 = 0
	var totalOrders int = 0
	var deliveredOrders int = 0
	var pendingOrders int = 0
	var cancelledOrders int = 0

	// Analytics Data map: "2026-08-01" -> {sales, orders}
	dailyStats := make(map[string]map[string]float64)
	monthlyStats := make(map[string]map[string]float64)
	yearlyStats := make(map[string]map[string]float64)

	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var id int
			var date time.Time
			var status, itemsJSON string

			if err := rows.Scan(&id, &date, &status, &itemsJSON); err != nil {
				continue
			}

			var items []map[string]interface{}
			if err := json.Unmarshal([]byte(itemsJSON), &items); err != nil {
				continue
			}

			var orderRevenue float64 = 0
			var hasSellerItems bool = false

			for _, item := range items {
				if sm, ok := item["seller_mobile"].(string); ok && sm == sellerMobile {
					hasSellerItems = true
					priceVal := 0.0
					if p, ok := item["price"].(float64); ok {
						priceVal = p
					}
					qtyVal := 1.0
					if q, ok := item["qty"].(float64); ok {
						qtyVal = q
					} else if q, ok := item["quantity"].(float64); ok {
						qtyVal = q
					}
					orderRevenue += (priceVal * qtyVal)
				}
			}

			if !hasSellerItems {
				continue
			}

			// Check delivery status
			var deliveryStatus string
			err = deliveryDB.QueryRow(`SELECT status FROM delivery_orders WHERE order_id = $1 ORDER BY updated_at DESC LIMIT 1`, id).Scan(&deliveryStatus)
			if err == nil && (deliveryStatus == "completed" || deliveryStatus == "Delivered") {
				status = "Delivered"
			}

			totalOrders++
			if status == "Delivered" {
				totalRevenue += orderRevenue
				deliveredOrders++
			} else if status == "Cancelled" || status == "Returned" {
				cancelledOrders++
			} else {
				pendingOrders++
			}

			// Grouping for charts
			dayStr := date.Format("2006-01-02")
			monthStr := date.Format("Jan 2006")
			yearStr := date.Format("2006")

			if _, exists := dailyStats[dayStr]; !exists {
				dailyStats[dayStr] = map[string]float64{"sales": 0, "orders": 0}
			}
			if _, exists := monthlyStats[monthStr]; !exists {
				monthlyStats[monthStr] = map[string]float64{"sales": 0, "orders": 0}
			}
			if _, exists := yearlyStats[yearStr]; !exists {
				yearlyStats[yearStr] = map[string]float64{"sales": 0, "orders": 0}
			}

			dailyStats[dayStr]["orders"] += 1
			monthlyStats[monthStr]["orders"] += 1
			yearlyStats[yearStr]["orders"] += 1

			if status == "Delivered" {
				dailyStats[dayStr]["sales"] += orderRevenue
				monthlyStats[monthStr]["sales"] += orderRevenue
				yearlyStats[yearStr]["sales"] += orderRevenue
			}
		}
		if err = rows.Err(); err != nil {
			fmt.Println("Rows error:", err)
		}
	}

	// Convert to arrays
	var weeklyData []map[string]interface{}
	for i := 6; i >= 0; i-- {
		d := time.Now().AddDate(0, 0, -i)
		dStr := d.Format("2006-01-02")
		sales := 0.0
		orders := 0.0
		if val, exists := dailyStats[dStr]; exists {
			sales = val["sales"]
			orders = val["orders"]
		}
		weeklyData = append(weeklyData, map[string]interface{}{
			"name": d.Format("Mon"), "sales": sales, "orders": orders,
		})
	}

	var monthlyData []map[string]interface{}
	for i := 5; i >= 0; i-- {
		d := time.Now().AddDate(0, -i, 0)
		mStr := d.Format("Jan 2006")
		sales := 0.0
		orders := 0.0
		if val, exists := monthlyStats[mStr]; exists {
			sales = val["sales"]
			orders = val["orders"]
		}
		monthlyData = append(monthlyData, map[string]interface{}{
			"name": d.Format("Jan"), "sales": sales, "orders": orders,
		})
	}

	var yearlyData []map[string]interface{}
	for i := 4; i >= 0; i-- {
		d := time.Now().AddDate(-i, 0, 0)
		yStr := d.Format("2006")
		sales := 0.0
		orders := 0.0
		if val, exists := yearlyStats[yStr]; exists {
			sales = val["sales"]
			orders = val["orders"]
		}
		yearlyData = append(yearlyData, map[string]interface{}{
			"name": yStr, "sales": sales, "orders": orders,
		})
	}

	ordersToday := 0.0
	if val, exists := dailyStats[time.Now().Format("2006-01-02")]; exists {
		ordersToday = val["orders"]
	}

	thisMonthRevenue := 0.0
	if val, exists := monthlyStats[time.Now().Format("Jan 2006")]; exists {
		thisMonthRevenue = val["sales"]
	}

	lastMonthRevenue := 0.0
	if val, exists := monthlyStats[time.Now().AddDate(0, -1, 0).Format("Jan 2006")]; exists {
		lastMonthRevenue = val["sales"]
	}

	var revenueGrowth float64 = 0
	if lastMonthRevenue > 0 {
		revenueGrowth = ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
	}

	response := map[string]interface{}{
		"totalRevenue":    totalRevenue,
		"totalOrders":     totalOrders,
		"deliveredOrders": deliveredOrders,
		"pendingOrders":   pendingOrders,
		"cancelledOrders": cancelledOrders,
		"ordersToday":     ordersToday,
		"revenueGrowth":   revenueGrowth,
		"analyticsData": map[string]interface{}{
			"weekly":  weeklyData,
			"monthly": monthlyData,
			"yearly":  yearlyData,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func GetSellerOrdersHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	sellerMobile := claims.Mobile

	query := `
		SELECT o.id, o.date, o.phone, o.address, o.city, o.state, o.pincode, o.payment_method, o.status, o.total, u.name, o.items, o.delivery_charge
		FROM orders o
		JOIN users u ON o.username = u.username
		WHERE o.items @> $1
		ORDER BY o.date DESC
	`

	// Fast JSONB containment search for the seller's mobile
	searchJSON := fmt.Sprintf(`[{"seller_mobile": "%s"}]`, sellerMobile)

	rows, err := buyerDB.Query(query, searchJSON)
	if err != nil {
		fmt.Println("Error querying buyer orders:", err)
		http.Error(w, "Failed to retrieve orders", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []map[string]interface{}
	for rows.Next() {
		var id int
		var date time.Time
		var phone, address, city, state, pincode, paymentMethod, status, buyerName, itemsJSON string
		var total, deliveryCharge float64

		if err := rows.Scan(&id, &date, &phone, &address, &city, &state, &pincode, &paymentMethod, &status, &total, &buyerName, &itemsJSON, &deliveryCharge); err != nil {
			fmt.Println("Scan error:", err)
			continue
		}

		// Parse the items
		var items []map[string]interface{}
		if err := json.Unmarshal([]byte(itemsJSON), &items); err != nil {
			fmt.Println("JSON unmarshal error:", err)
			continue
		}

		// Filter items to only those belonging to this seller
		var sellerItems []map[string]interface{}
		for _, item := range items {
			if sm, ok := item["seller_mobile"].(string); ok && sm == sellerMobile {
				sellerItems = append(sellerItems, item)
			}
		}

		// If no items match (false positive on LIKE), skip
		if len(sellerItems) == 0 {
			continue
		}

		var deliveryName, deliveryPhone, deliveryStatus string

		// Query delivery info
		deliveryQuery := `
			SELECT u.name, u.phone, do.status 
			FROM delivery_orders do
			JOIN users u ON do.delivery_user = u.username
			WHERE do.order_id = $1
			ORDER BY do.updated_at DESC LIMIT 1
		`
		err = deliveryDB.QueryRow(deliveryQuery, id).Scan(&deliveryName, &deliveryPhone, &deliveryStatus)
		if err != nil && err != sql.ErrNoRows {
			fmt.Println("Error fetching delivery info:", err)
		}

		if deliveryStatus == "completed" && status != "Delivered" {
			status = "Delivered"
			buyerDB.Exec("UPDATE orders SET status = 'Delivered' WHERE id = $1", id)
		}

		order := map[string]interface{}{
			"id":              id,
			"orderId":         fmt.Sprintf("TK%05d", id),
			"date":            date,
			"phone":           phone,
			"address":         address,
			"city":            city,
			"state":           state,
			"pincode":         pincode,
			"payment_method":  paymentMethod,
			"status":          status,
			"buyer_name":      buyerName,
			"items":           sellerItems,
			"delivery_name":   deliveryName,
			"delivery_phone":  deliveryPhone,
			"delivery_status": deliveryStatus,
			"delivery_charge": deliveryCharge,
		}
		orders = append(orders, order)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Rows error:", err)
	}

	if orders == nil {
		orders = []map[string]interface{}{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

func UpdateOrderStatusHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := getClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	id := strings.TrimPrefix(r.URL.Path, "/orders/")
	id = strings.TrimSuffix(id, "/status")

	var body struct {
		Status    string  `json:"status"`
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Fast JSONB containment search for the seller's mobile to ensure they have an item in this order
	searchJSON := fmt.Sprintf(`[{"seller_mobile": "%s"}]`, claims.Mobile)

	res, err := buyerDB.Exec("UPDATE orders SET status=$1, seller_latitude=$2, seller_longitude=$3 WHERE id=$4 AND items @> $5", body.Status, body.Latitude, body.Longitude, id, searchJSON)
	if err != nil {
		http.Error(w, "Failed to update status: "+err.Error(), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Order not found or unauthorized", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Status updated successfully"})
}

func main() {
	initDB()
	defer db.Close()
	defer buyerDB.Close()

	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
        mobile TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT NOT NULL,
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
        quantity INT DEFAULT 0,
        unit TEXT,
        price NUMERIC(10,2) DEFAULT 0,
        image1 BYTEA,
        image2 BYTEA,
        image3 BYTEA,
        image4 BYTEA,
        in_stock BOOLEAN DEFAULT true,
        mobile TEXT,  -- ✅ CHANGE: from 'username' to 'mobile'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`)

	if err != nil {
		panic("Failed to create products table: " + err.Error())
	}

	_, err = db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS about_store TEXT`)
	if err != nil {
		panic("Failed to add about_store column: " + err.Error())
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/send-otp", SendOTPHandler)
	mux.HandleFunc("/verify-otp", VerifyOTPHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))
	mux.Handle("/dashboard/stats", AuthMiddleware(http.HandlerFunc(GetDashboardStatsHandler)))
	mux.Handle("/upload", AuthMiddleware(http.HandlerFunc(UploadProductHandler)))
	mux.Handle("/profile", AuthMiddleware(http.HandlerFunc(GetProfileHandler)))
	mux.Handle("/profile/update", AuthMiddleware(http.HandlerFunc(UpdateProfileHandler)))
	mux.Handle("/account", AuthMiddleware(http.HandlerFunc(DeleteAccountHandler)))
	mux.HandleFunc("/public/products", GetAllProductsHandler)
	mux.HandleFunc("/public/seller", GetSellerInfoHandler)

	mux.Handle("/orders", AuthMiddleware(http.HandlerFunc(GetSellerOrdersHandler)))
	mux.Handle("/orders/", AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut && strings.HasSuffix(r.URL.Path, "/status") {
			UpdateOrderStatusHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	mux.Handle("/products", AuthMiddleware(http.HandlerFunc(GetMyProductsHandler)))
	mux.Handle("/products/", AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPut:
			if strings.HasSuffix(r.URL.Path, "/stock") {
				UpdateStockHandler(w, r)
			} else if strings.HasSuffix(r.URL.Path, "/price") {
				UpdatePriceHandler(w, r)
			} else {
				UpdateProductHandler(w, r) // ✅ Add this line
			}
		case http.MethodDelete:
			DeleteProductHandler(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})))

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"},
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
