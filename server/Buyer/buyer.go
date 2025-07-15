package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
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
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	_, err = db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)", req.Name, req.Username, string(hashedPassword))
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
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	var storedHashedPassword string
	err = db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username).Scan(&storedHashedPassword)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
	if err != nil {
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
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}
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

func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
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

func GetProductsHandler(w http.ResponseWriter, r *http.Request) {
	// Extract query parameters (category & subcategory filtering)
	category := r.URL.Query().Get("category")
	subcategory := r.URL.Query().Get("subcategory")

	var rows *sql.Rows
	var err error

	// Query based on filters (if provided)
	if category != "" && subcategory != "" {
		rows, err = db.Query(`
            SELECT id, name, price, image, category, subcategory 
            FROM products 
            WHERE category = $1 AND subcategory = $2`,
			category, subcategory)
	} else if category != "" {
		rows, err = db.Query(`
            SELECT id, name, price, image, category, subcategory 
            FROM products 
            WHERE category = $1`,
			category)
	} else {
		rows, err = db.Query(`
            SELECT id, name, price, image, category, subcategory 
            FROM products`)
	}

	if err != nil {
		http.Error(w, "Error fetching products", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type Product struct {
		ID          int     `json:"id"`
		Name        string  `json:"name"`
		Price       float64 `json:"price"`
		Image       string  `json:"image"`
		Category    string  `json:"category"`
		Subcategory string  `json:"subcategory"`
	}

	var products []Product
	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Image, &p.Category, &p.Subcategory)
		if err != nil {
			http.Error(w, "Error reading product data", http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func UpdateProfileHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	firstName := r.FormValue("firstName")
	lastName := r.FormValue("lastName")
	gender := r.FormValue("gender")
	email := r.FormValue("email")
	mobile := r.FormValue("mobile")
	feedback := r.FormValue("feedback")

	query := `
		UPDATE users SET first_name=$1, last_name=$2, gender=$3, email=$4,
		mobile=$5, feedback=$6 WHERE username=$7`
	_, err = db.Exec(query, firstName, lastName, gender, email, mobile, feedback, username)
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
		WHERE o.username = $1
		ORDER BY o.date DESC`, username)
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

		err := rows.Scan(&orderID, &date, &item.Name, &item.Price, &item.Qty, &item.Image)
		if err != nil {
			http.Error(w, "Error reading order data", http.StatusInternalServerError)
			return
		}

		if orderMap[orderID] == nil {
			orderMap[orderID] = &Order{ID: orderID, Date: date}
		}
		orderMap[orderID].Items = append(orderMap[orderID].Items, item)
	}

	// Convert map to slice
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
	err = json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	order.Date = time.Now()

	orderID := 0
	err = db.QueryRow(
		`INSERT INTO orders (username, date, phone, address, pincode) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		username, order.Date, order.Phone, order.Address, order.Pincode,
	).Scan(&orderID)

	if err != nil {
		http.Error(w, "Failed to place order", http.StatusInternalServerError)
		return
	}

	for _, item := range order.Items {
		_, err := db.Exec(
			`INSERT INTO order_items (order_id, name, price, qty, image) VALUES ($1, $2, $3, $4, $5)`,
			orderID, item.Name, item.Price, item.Qty, item.Image,
		)
		if err != nil {
			http.Error(w, "Failed to save order items", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Order placed successfully"})
}

func main() {
	initDB()
	defer db.Close()

	createTableQuery := `
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
    `

	_, err := db.Exec(createTableQuery)
	if err != nil {
		panic(err)
	}

	createOrdersTable := `
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    username TEXT,
    items JSONB,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  name TEXT,
  price FLOAT,
  qty INTEGER,
  image TEXT
);
`
	createProductsTable := `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price FLOAT NOT NULL,
    category TEXT,
    subcategory TEXT,
    image TEXT
);
`
	_, err = db.Exec(createProductsTable)
	if err != nil {
		panic(err)
	}

	_, err = db.Exec(createOrdersTable)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))
	mux.Handle("/profile", AuthMiddleware(http.HandlerFunc(GetProfileHandler)))
	mux.Handle("/profile/update", AuthMiddleware(http.HandlerFunc(UpdateProfileHandler)))
	mux.Handle("/orders", AuthMiddleware(http.HandlerFunc(GetOrdersHandler)))
	mux.Handle("/orders/place", AuthMiddleware(http.HandlerFunc(PlaceOrderHandler)))
	mux.HandleFunc("/products", GetProductsHandler)

	// ✅ Add CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("🚀 Server running on http://localhost:8081")
	err = http.ListenAndServe(":8081", corsHandler)
	if err != nil {
		panic(err)
	}
}
