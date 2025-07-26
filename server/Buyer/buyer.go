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

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := GetUsernameFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
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
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Password encryption failed", http.StatusInternalServerError)
		return
	}
	_, err = db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
		req.Name, req.Username, string(hash))
	if err != nil {
		http.Error(w, "Error saving user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered"})
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	var storedHash string
	err = db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username).Scan(&storedHash)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(creds.Password)) != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	expiration := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: creds.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expiration),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Token generation failed", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"token": tokenStr})
}

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{
		"message": fmt.Sprintf("Welcome, %s", username),
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
	err = db.QueryRow(`SELECT username, first_name, last_name, gender, email, mobile, feedback 
					   FROM users WHERE username = $1`, username).
		Scan(&profile.Username, &profile.FirstName, &profile.LastName,
			&profile.Gender, &profile.Email, &profile.Mobile, &profile.Feedback)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(profile)
}

func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	err = r.ParseForm()
	if err != nil {
		http.Error(w, "Invalid form", http.StatusBadRequest)
		return
	}
	_, err = db.Exec(`UPDATE users SET first_name=$1, last_name=$2, gender=$3, email=$4,
		mobile=$5, feedback=$6 WHERE username=$7`,
		r.FormValue("firstName"), r.FormValue("lastName"), r.FormValue("gender"),
		r.FormValue("email"), r.FormValue("mobile"), r.FormValue("feedback"), username)
	if err != nil {
		http.Error(w, "Update failed", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated"})
}

func GetProductsHandler(w http.ResponseWriter, r *http.Request) {

	client := &http.Client{}
	req, err := http.NewRequest("GET", "http://localhost:8080/products", nil)
	if err != nil {
		http.Error(w, "Failed to prepare request", http.StatusInternalServerError)
		return
	}

	if token := r.Header.Get("Authorization"); token != "" {
		req.Header.Set("Authorization", token)
	}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Seller API unreachable", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}

type CartItem struct {
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Qty   int     `json:"qty"`
	Image string  `json:"image"`
}

type Order struct {
	Username string     `json:"username"`
	Items    []CartItem `json:"items"`
	Date     time.Time  `json:"date"`
	Phone    string     `json:"phone"`
	Address  string     `json:"address"`
	Pincode  string     `json:"pincode"`
}

func PlaceOrderHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var order Order
	err = json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		http.Error(w, "Invalid order data", http.StatusBadRequest)
		return
	}
	order.Date = time.Now()
	order.Username = username

	orderJSON, _ := json.Marshal(order.Items)
	_, err = db.Exec(`INSERT INTO orders (username, items, date) VALUES ($1, $2, $3)`,
		username, string(orderJSON), order.Date)
	if err != nil {
		http.Error(w, "Order failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Order placed"})
}

func GetOrdersHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	rows, err := db.Query(`SELECT id, items, date FROM orders WHERE username=$1 ORDER BY date DESC`, username)
	if err != nil {
		http.Error(w, "Query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []map[string]interface{}
	for rows.Next() {
		var id int
		var items string
		var date time.Time
		rows.Scan(&id, &items, &date)
		var parsedItems []CartItem
		json.Unmarshal([]byte(items), &parsedItems)
		orders = append(orders, map[string]interface{}{
			"id":    id,
			"date":  date,
			"items": parsedItems,
		})
	}
	json.NewEncoder(w).Encode(orders)
}

func main() {
	initDB()
	defer db.Close()

	_, err := db.Exec(`CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT, username TEXT UNIQUE, password TEXT,
		first_name TEXT, last_name TEXT, gender TEXT,
		email TEXT, mobile TEXT, feedback TEXT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`)
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS orders (
		id SERIAL PRIMARY KEY,
		username TEXT,
		items JSONB,
		date TIMESTAMP
	);`)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))
	mux.Handle("/profile", AuthMiddleware(http.HandlerFunc(GetProfileHandler)))
	mux.Handle("/profile/update", AuthMiddleware(http.HandlerFunc(UpdateProfileHandler)))
	mux.Handle("/products", AuthMiddleware(http.HandlerFunc(GetProductsHandler)))
	mux.Handle("/orders", AuthMiddleware(http.HandlerFunc(GetOrdersHandler)))
	mux.Handle("/orders/place", AuthMiddleware(http.HandlerFunc(PlaceOrderHandler)))

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("🚀 Buyer API running on http://localhost:8081")
	err = http.ListenAndServe(":8081", corsHandler)
	if err != nil {
		panic(err)
	}
}
