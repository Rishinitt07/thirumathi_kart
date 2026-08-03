package main

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
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
	connStr := "user=postgres password=dharun123 dbname=buyerdb sslmode=disable"
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
	Mobile   string `json:"mobile"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Mobile    string `json:"mobile"`
	Password  string `json:"password"`
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
	name := strings.TrimSpace(req.FirstName + " " + req.LastName)
	_, err = db.Exec("INSERT INTO users (name, first_name, last_name, username, password, mobile) VALUES ($1, $2, $3, $4, $5, $6)",
		name, req.FirstName, req.LastName, req.Mobile, string(hash), req.Mobile)
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
	err = db.QueryRow("SELECT password FROM users WHERE username=$1 OR mobile=$1", creds.Mobile).Scan(&storedHash)
	if err != nil || bcrypt.CompareHashAndPassword([]byte(storedHash), []byte(creds.Password)) != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	expiration := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: creds.Mobile,
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
	err = db.QueryRow(`SELECT username, COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(gender, ''), COALESCE(email, ''), COALESCE(mobile, ''), COALESCE(feedback, '') 
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
	err = r.ParseMultipartForm(10 << 20) // 10 MB limit
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

type Address struct {
	Id         string `json:"id"`
	Tag        string `json:"tag"` // Home, Office, Parents, Other
	FullName   string `json:"fullName"`
	Mobile     string `json:"mobile"`
	HouseNo    string `json:"houseNo"`
	Street     string `json:"street"`
	Area       string `json:"area"`
	Landmark   string `json:"landmark"`
	City       string `json:"city"`
	State      string `json:"state"`
	Pincode    string `json:"pincode"`
	Country    string `json:"country"`
}

func GetAddressesHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var addressesJSON []byte
	err = db.QueryRow(`SELECT COALESCE(addresses, '[]'::jsonb) FROM users WHERE username = $1`, username).Scan(&addressesJSON)
	if err != nil {
		http.Error(w, "Failed to get addresses", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(addressesJSON)
}

func UpdateAddressesHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Println("--> Received UpdateAddresses request")
	username, err := GetUsernameFromToken(r)
	if err != nil {
		fmt.Println("Auth Error:", err)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	var addresses []Address
	if err := json.NewDecoder(r.Body).Decode(&addresses); err != nil {
		fmt.Println("Decode Error:", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	fmt.Println("Addresses parsed:", len(addresses))

	addressesJSON, err := json.Marshal(addresses)
	if err != nil {
		fmt.Println("Marshal Error:", err)
		http.Error(w, "Error processing addresses", http.StatusInternalServerError)
		return
	}

	_, err = db.Exec(`UPDATE users SET addresses = $1::jsonb WHERE username = $2`, string(addressesJSON), username)
	if err != nil {
		fmt.Println("DB Update Error:", err)
		http.Error(w, "Failed to update addresses", http.StatusInternalServerError)
		return
	}

	fmt.Println("Addresses updated successfully for user:", username)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Addresses updated successfully"})
}

func GetProductsHandler(w http.ResponseWriter, r *http.Request) {

	client := &http.Client{}
	url := "http://localhost:8080/public/products"
	if r.URL.RawQuery != "" {
		url += "?" + r.URL.RawQuery
	}
	req, err := http.NewRequest("GET", url, nil)
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

func GetSellerHandler(w http.ResponseWriter, r *http.Request) {
	client := &http.Client{}
	url := "http://localhost:8080/public/seller"
	if r.URL.RawQuery != "" {
		url += "?" + r.URL.RawQuery
	}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		http.Error(w, "Failed to prepare request", http.StatusInternalServerError)
		return
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

// Removed CartItem struct as we use json.RawMessage

type Order struct {
	Username      string          `json:"username"`
	Items         json.RawMessage `json:"items"`
	Date          time.Time       `json:"date"`
	Phone         string     `json:"phone"`
	Address       string     `json:"address"`
	City          string     `json:"city"`
	State         string     `json:"state"`
	Pincode       string     `json:"pincode"`
	PaymentMethod string     `json:"paymentMethod"`
	Status        string     `json:"status"`
	Total         float64    `json:"total"`
	Latitude      float64    `json:"latitude"`
	Longitude     float64    `json:"longitude"`
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
	order.Status = "Processing"

	var items []map[string]interface{}
	json.Unmarshal(order.Items, &items)

	var total float64
	for _, item := range items {
		price, _ := item["price"].(float64)
		qtyVal := item["qty"]
		if qtyVal == nil {
			qtyVal = item["quantity"]
		}
		var qty float64
		switch v := qtyVal.(type) {
		case float64:
			qty = v
		case int:
			qty = float64(v)
		}
		total += price * qty
	}
	order.Total = total

	_, err = db.Exec(`INSERT INTO orders (username, items, date, phone, address, city, state, pincode, payment_method, status, total, latitude, longitude) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
		username, string(order.Items), order.Date, order.Phone, order.Address, order.City, order.State, order.Pincode, order.PaymentMethod, order.Status, order.Total, order.Latitude, order.Longitude)
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
	rows, err := db.Query(`SELECT o.id, u.name, o.items, o.date, o.phone, o.address, o.city, o.state, o.pincode, o.payment_method, o.status, o.total 
		FROM orders o JOIN users u ON o.username = u.username WHERE o.username=$1 ORDER BY o.date DESC`, username)
	if err != nil {
		http.Error(w, "Query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []map[string]interface{}
	for rows.Next() {
		var id int
		var items, dbUsername, phone, address, city, state, pincode, payment, status string
		var total float64
		var date time.Time
		rows.Scan(&id, &dbUsername, &items, &date, &phone, &address, &city, &state, &pincode, &payment, &status, &total)
		var parsedItems []map[string]interface{}
		json.Unmarshal([]byte(items), &parsedItems)
		orders = append(orders, map[string]interface{}{
			"id":             id,
			"username":       dbUsername,
			"date":           date,
			"items":          parsedItems,
			"phone":          phone,
			"address":        address,
			"city":           city,
			"state":          state,
			"pincode":        pincode,
			"payment_method": payment,
			"status":         status,
			"total":          total,
		})
	}
	json.NewEncoder(w).Encode(orders)
}

func CancelOrderHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	
	orderID := r.URL.Query().Get("id")
	if orderID == "" {
		http.Error(w, "Order ID required", http.StatusBadRequest)
		return
	}

	res, err := db.Exec(`UPDATE orders SET status='Cancelled' WHERE id=$1 AND username=$2 AND status NOT IN ('Out for delivery', 'Near your doorstep', 'Delivered', 'Cancelled')`, orderID, username)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	
	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Cannot cancel this order", http.StatusBadRequest)
		return
	}
	
	json.NewEncoder(w).Encode(map[string]string{"message": "Order cancelled"})
}

func SyncDataHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var cart, wishlist []byte
	err = db.QueryRow(`SELECT COALESCE(cart, '[]'::jsonb), COALESCE(wishlist, '[]'::jsonb) FROM users WHERE username=$1`, username).Scan(&cart, &wishlist)
	if err != nil {
		if err == sql.ErrNoRows {
			cart, wishlist = []byte("[]"), []byte("[]")
		} else {
			http.Error(w, "Query failed", http.StatusInternalServerError)
			return
		}
	}
	
	var c interface{}
	var wl interface{}
	json.Unmarshal(cart, &c)
	json.Unmarshal(wishlist, &wl)
	
	json.NewEncoder(w).Encode(map[string]interface{}{
		"cart": c,
		"wishlist": wl,
	})
}

func UpdateCartHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var req struct {
		Items interface{} `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}
	
	itemsJSON, _ := json.Marshal(req.Items)
	_, err = db.Exec(`UPDATE users SET cart = $1 WHERE username = $2`, string(itemsJSON), username)
	if err != nil {
		http.Error(w, "Update failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func UpdateWishlistHandler(w http.ResponseWriter, r *http.Request) {
	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	var req struct {
		Items interface{} `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid data", http.StatusBadRequest)
		return
	}
	
	itemsJSON, _ := json.Marshal(req.Items)
	_, err = db.Exec(`UPDATE users SET wishlist = $1 WHERE username = $2`, string(itemsJSON), username)
	if err != nil {
		http.Error(w, "Update failed", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func DeleteAccountHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username, err := GetUsernameFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	_, err = db.Exec(`DELETE FROM users WHERE mobile=$1 OR username=$1`, username)
	if err != nil {
		http.Error(w, "Failed to delete account", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Account deleted successfully"})
}

var otpStore = make(map[string]string)

type OTPRequest struct {
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

	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	otpVal := "123456"
	if err == nil {
		otpVal = fmt.Sprintf("%06d", n.Int64())
	}
	otpStore[req.Mobile] = otpVal

	fmt.Printf("\n--- OTP FOR %s IS: %s ---\n\n", req.Mobile, otpVal)

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

	storedOTP, exists := otpStore[req.Mobile]
	if !exists || storedOTP != req.OTP {
		http.Error(w, "Invalid OTP", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "OTP Verified"})
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

	alterQueries := []string{
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS phone TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS state TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS pincode TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Processing';`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS total NUMERIC;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS latitude NUMERIC;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS longitude NUMERIC;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_latitude NUMERIC;`,
		`ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_longitude NUMERIC;`,
	}
	for _, q := range alterQueries {
		if _, err := db.Exec(q); err != nil {
			panic(err)
		}
	}

	_, err = db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS cart JSONB DEFAULT '[]'::jsonb;`)
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(`ALTER TABLE users ADD COLUMN IF NOT EXISTS wishlist JSONB DEFAULT '[]'::jsonb;`)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/send-otp", SendOTPHandler)
	mux.HandleFunc("/verify-otp", VerifyOTPHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))
	mux.Handle("/profile", AuthMiddleware(http.HandlerFunc(GetProfileHandler)))
	mux.Handle("/profile/update", AuthMiddleware(http.HandlerFunc(UpdateProfileHandler)))
	mux.Handle("/addresses", AuthMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			GetAddressesHandler(w, r)
		} else if r.Method == http.MethodPost || r.Method == http.MethodPut {
			UpdateAddressesHandler(w, r)
		} else {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})))
	mux.Handle("/account", AuthMiddleware(http.HandlerFunc(DeleteAccountHandler)))
	mux.HandleFunc("/products", GetProductsHandler)
	mux.HandleFunc("/seller", GetSellerHandler)
	mux.Handle("/orders", AuthMiddleware(http.HandlerFunc(GetOrdersHandler)))
	mux.Handle("/orders/place", AuthMiddleware(http.HandlerFunc(PlaceOrderHandler)))
	mux.Handle("/orders/cancel", AuthMiddleware(http.HandlerFunc(CancelOrderHandler)))
	mux.Handle("/sync", AuthMiddleware(http.HandlerFunc(SyncDataHandler)))
	mux.Handle("/cart", AuthMiddleware(http.HandlerFunc(UpdateCartHandler)))
	mux.Handle("/wishlist", AuthMiddleware(http.HandlerFunc(UpdateWishlistHandler)))

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"},
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
