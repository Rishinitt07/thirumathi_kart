package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
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
	connStr := "user=postgres password=tkart@123 dbname=buyerdb sslmode=disable"
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to PostgreSQL")
}

func generateSecretKey() string {
	bytes := make([]byte, 64)
	_, err := rand.Read(bytes)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(bytes)
}

var secretKey = generateSecretKey()
var jwtKey = []byte(secretKey)

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

func GetUsernameFromToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return "", fmt.Errorf("missing token")
	}
	tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return "", fmt.Errorf("invalid token")
	}
	return claims.Username, nil
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	_, err := db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)", req.Name, req.Username, string(hashedPassword))
	if err != nil {
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var creds Credentials
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	var storedHashedPassword string
	err := db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username).Scan(&storedHashedPassword)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password)) != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: creds.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, _ := token.SignedString(jwtKey)
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func GetProfileHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	var profile struct {
		Username  string `json:"username"`
		FirstName string `json:"firstName"`
		LastName  string `json:"lastName"`
		Gender    string `json:"gender"`
		Email     string `json:"email"`
		Mobile    string `json:"mobile"`
		Feedback  string `json:"feedback"`
	}
	err = db.QueryRow(`
		SELECT username, first_name, last_name, gender, email, mobile, feedback
		FROM users WHERE username = $1`, username).
		Scan(&profile.Username, &profile.FirstName, &profile.LastName,
			&profile.Gender, &profile.Email, &profile.Mobile, &profile.Feedback)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(profile)
}

func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	r.ParseMultipartForm(10 << 20)
	query := `
		UPDATE users SET first_name=$1, last_name=$2, gender=$3, email=$4,
		mobile=$5, feedback=$6 WHERE username=$7`
	_, err = db.Exec(query,
		r.FormValue("firstName"), r.FormValue("lastName"), r.FormValue("gender"),
		r.FormValue("email"), r.FormValue("mobile"), r.FormValue("feedback"), username)
	if err != nil {
		http.Error(w, "Update failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated"})
}

func GetOrdersHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	rows, err := db.Query(`
		SELECT o.id, o.date, i.name, i.price, i.qty, i.image
		FROM orders o
		JOIN order_items i ON o.id = i.order_id
		WHERE o.username = $1 ORDER BY o.date DESC`, username)
	if err != nil {
		http.Error(w, "Error fetching orders", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type Item struct {
		Name  string `json:"name"`
		Price int    `json:"price"`
		Qty   int    `json:"qty"`
		Image string `json:"image"`
	}
	type Order struct {
		ID    int       `json:"id"`
		Date  time.Time `json:"date"`
		Items []Item    `json:"items"`
	}
	orderMap := make(map[int]*Order)
	for rows.Next() {
		var orderID int
		var date time.Time
		var item Item
		if err := rows.Scan(&orderID, &date, &item.Name, &item.Price, &item.Qty, &item.Image); err != nil {
			http.Error(w, "Error reading order data", http.StatusInternalServerError)
			return
		}
		if orderMap[orderID] == nil {
			orderMap[orderID] = &Order{ID: orderID, Date: date}
		}
		orderMap[orderID].Items = append(orderMap[orderID].Items, item)
	}
	var orders []Order
	for _, o := range orderMap {
		orders = append(orders, *o)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

type Order struct {
	Username string     `json:"username"`
	Items    []CartItem `json:"items"`
	Date     time.Time  `json:"date"`
	Phone    string     `json:"phone"`
	Address  string     `json:"address"`
	Pincode  string     `json:"pincode"`
}

type CartItem struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Qty   int     `json:"qty"`
	Image string  `json:"image"`
}

func PlaceOrderHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var order Order
	if err := json.NewDecoder(r.Body).Decode(&order); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	order.Date = time.Now()
	orderID := 0
	err = db.QueryRow(`
		INSERT INTO orders (username, date, phone, address, pincode)
		VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		username, order.Date, order.Phone, order.Address, order.Pincode).Scan(&orderID)
	if err != nil {
		http.Error(w, "Failed to place order", http.StatusInternalServerError)
		return
	}
	for _, item := range order.Items {
		_, err := db.Exec(`INSERT INTO order_items (order_id, name, price, qty, image) VALUES ($1, $2, $3, $4, $5)`,
			orderID, item.Name, item.Price, item.Qty, item.Image)
		if err != nil {
			http.Error(w, "Failed to save order items", http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Order placed successfully"})
}

func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	sellerURL := "http://localhost:8080/products"

	req, err := http.NewRequest("GET", sellerURL, nil)
	if err != nil {
		http.Error(w, "Failed to create request", http.StatusInternalServerError)
		return
	}
	req.Header = r.Header.Clone()

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to reach seller backend", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		http.Error(w, "Error from seller backend", resp.StatusCode)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	io.Copy(w, resp.Body)
}

func main() {
	initDB()
	defer db.Close()

	// 🔧 Setup required tables
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT,
		username TEXT UNIQUE,
		password TEXT,
		first_name TEXT,
		last_name TEXT,
		gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
		email TEXT,
		mobile VARCHAR(10),
		feedback TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	CREATE TABLE IF NOT EXISTS orders (
		id SERIAL PRIMARY KEY,
		username TEXT,
		date TIMESTAMP,
		phone TEXT,
		address TEXT,
		pincode TEXT
	);
	CREATE TABLE IF NOT EXISTS order_items (
		id SERIAL PRIMARY KEY,
		order_id INTEGER,
		name TEXT,
		price FLOAT,
		qty INTEGER,
		image TEXT
	);`)
	if err != nil {
		panic(err)
	}

	// 📦 Route handlers
	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/profile", AuthMiddleware(http.HandlerFunc(GetProfileHandler)))
	mux.Handle("/profile/update", AuthMiddleware(http.HandlerFunc(UpdateProfileHandler)))
	mux.Handle("/orders", AuthMiddleware(http.HandlerFunc(GetOrdersHandler)))
	mux.Handle("/orders/place", AuthMiddleware(http.HandlerFunc(PlaceOrderHandler)))
	mux.HandleFunc("/products", GetProductsHandler)

	// ✅ Enable CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("🚀 Server running on http://localhost:8081")
	http.ListenAndServe(":8081", corsHandler)
}
