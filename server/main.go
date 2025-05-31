
// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	 _ "github.com/lib/pq"
	
// )

// var db *sql.DB

// // initDB connects to PostgreSQL and sets up the connection.
// func initDB() {
// 	var err error
// 	// Adjust the connection string as needed.
// 	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// // generateSecretKey creates a random secret key.
// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// // Credentials for login requests.
// type Credentials struct {
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// }

// // RegisterRequest represents the JSON payload for registration.
// type RegisterRequest struct {
// 	Name     string `json:"name"`
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// }

// // Claims represents the JWT claims.
// type Claims struct {
// 	Username string `json:"username"`
// 	jwt.RegisteredClaims
// }

// // RegisterHandler handles user registration.
// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var req RegisterRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	// Hash the password using bcrypt.
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}
// 	// Insert new user into the database.
// 	_, err = db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)", req.Name, req.Username, string(hashedPassword))
// 	if err != nil {
// 		http.Error(w, "Error registering user", http.StatusInternalServerError)
// 		return
// 	}
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// // LoginHandler authenticates a user and returns a JWT.
// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	// Retrieve the stored hashed password.
// 	var storedHashedPassword string
// 	err = db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username).Scan(&storedHashedPassword)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	// Compare the stored password with the provided password.
// 	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Username: creds.Username,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// // AuthMiddleware protects routes by validating JWT tokens.
// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// // ProtectedHandler is an example of a protected route.
// func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
// }

// func main() {
// 	// Initialize PostgreSQL connection.
// 	initDB()
// 	defer db.Close()

// 	// Create the users table if it doesn't exist.
// 	createTableQuery := `
//     CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name TEXT,
//         username TEXT UNIQUE,
//         password TEXT
//     );
//     `
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	// Route handlers.
// 	http.HandleFunc("/info", RegisterHandler)
// 	http.HandleFunc("/login", LoginHandler)
// 	http.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	err = http.ListenAndServe(":8080", nil)
// 	if err != nil {
// 		panic(err)
// 	}
// }



// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/rs/cors" // 👈 Added CORS package
// 	_ "github.com/lib/pq"
// )

// var db *sql.DB

// func initDB() {
// 	var err error
// 	connStr := "user=postgres password=tkart@123 dbname=seller_info sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// type Credentials struct {
// 	Account_number int `json:"account_number"`
// 	Password string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name     string `json:"name"`
// 	Account_number int `json:"account_number"`
// 	Password string `json:"password"`
// }

// type Claims struct {
// 	Account_number string `json:"account_number"`
// 	jwt.RegisteredClaims
// }

// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var req RegisterRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}
// 	_, err = db.Exec("INSERT INTO seller_info (name, account_number, password) VALUES ($1, $2, $3)", req.Name, req.Account_number, string(hashedPassword))
// 	if err != nil {
// 		http.Error(w, "Error registering user", http.StatusInternalServerError)
// 		return
// 	}
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	var storedHashedPassword string
// 	err = db.QueryRow("SELECT password FROM seller_info WHERE account_number=$1", creds.Account_number).Scan(&storedHashedPassword)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Account_number: creds.Account_number,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
// }

// func main() {
// 	initDB()
// 	defer db.Close()

// 	createTableQuery := `
//     CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name TEXT,
//         password TEXT,
// 		account_number BIGINT UNIQUE
//     );
//     `
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/info", RegisterHandler)
// 	mux.HandleFunc("/login", LoginHandler)
// 	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	// ✅ Add CORS middleware
// 	corsHandler := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:5173"},
// 		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
// 		AllowedHeaders:   []string{"Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}).Handler(mux)

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	err = http.ListenAndServe(":8080", corsHandler)
// 	if err != nil {
// 		panic(err)
// 	}
// }



// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/rs/cors"
// 	_ "github.com/lib/pq"
// )

// var db *sql.DB

// func initDB() {
// 	var err error
// 	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// type Credentials struct {
// 	Account_number int    `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name           string `json:"name"`
// 	Account_number int    `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type Claims struct {
// 	Account_number int `json:"account_number"`
// 	jwt.RegisteredClaims
// }

// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var req RegisterRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}
// 	_, err = db.Exec("INSERT INTO seller_info (name, account_number, password) VALUES ($1, $2, $3)", req.Name, req.Account_number, string(hashedPassword))
// 	if err != nil {
// 		http.Error(w, "Error registering user", http.StatusInternalServerError)
// 		return
// 	}
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	var storedHashedPassword string
// 	err = db.QueryRow("SELECT password FROM seller_info WHERE account_number=$1", creds.Account_number).Scan(&storedHashedPassword)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Account_number: creds.Account_number,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
// }

// func main() {
// 	initDB()
// 	defer db.Close()

// 	createTableQuery := `
//     CREATE TABLE IF NOT EXISTS seller_info (
//         id SERIAL PRIMARY KEY,
//         name TEXT,
//         password TEXT,
//         account_number BIGINT UNIQUE
//     );
//     `
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/info", RegisterHandler)
// 	mux.HandleFunc("/login", LoginHandler)
// 	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	corsHandler := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:5173"},
// 		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
// 		AllowedHeaders:   []string{"Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}).Handler(mux)

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	err = http.ListenAndServe(":8080", corsHandler)
// 	if err != nil {
// 		panic(err)
// 	}
// }





// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/rs/cors"
// 	_ "github.com/lib/pq"
// )

// var db *sql.DB

// func initDB() {
// 	var err error
// 	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// type Credentials struct {
// 	Account_number int    `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name           string `json:"name"`
// 	Account_number string    `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type Claims struct {
// 	Account_number string `json:"account_number"`
// 	jwt.RegisteredClaims
// }

// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var req RegisterRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}
// 	_, err = db.Exec("INSERT INTO seller_info (name, account_number, password) VALUES ($1, $2, $3)", req.Name, req.Account_number, string(hashedPassword))
// 	if err != nil {
// 		http.Error(w, "Error registering user", http.StatusInternalServerError)
// 		return
// 	}
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	var storedHashedPassword string
// 	err = db.QueryRow("SELECT password FROM seller_info WHERE account_number=$3", creds.Account_number).Scan(&storedHashedPassword)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Account_number: creds.Account_number,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
// }

// func main() {
// 	initDB()
// 	defer db.Close()

// 	createTableQuery := `
//     CREATE TABLE IF NOT EXISTS seller_info (
//         id SERIAL PRIMARY KEY,
//         name TEXT,
//         password TEXT,
//         account_number TEXT
//     );
//     `
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/info", RegisterHandler)
// 	mux.HandleFunc("/login", LoginHandler)
// 	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	corsHandler := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:5173"},
// 		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
// 		AllowedHeaders:   []string{"Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}).Handler(mux)

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	err = http.ListenAndServe(":8080", corsHandler)
// 	if err != nil {
// 		panic(err)
// 	}
// }



// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/rs/cors"
// 	_ "github.com/lib/pq"
// )

// var db *sql.DB

// func initDB() {
// 	var err error
// 	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// type Credentials struct {
// 	Account_number string `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name           string `json:"name"`
// 	Account_number string `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type Claims struct {
// 	Account_number string `json:"account_number"`
// 	jwt.RegisteredClaims
// }

// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var req RegisterRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}
// 	_, err = db.Exec("INSERT INTO seller_info (name, account_number, password) VALUES ($1, $2, $3)", req.Name, req.Account_number, string(hashedPassword))
// 	if err != nil {
// 		http.Error(w, "Error registering user", http.StatusInternalServerError)
// 		return
// 	}
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}
// 	var storedHashedPassword string
// 	err = db.QueryRow("SELECT password FROM seller_info WHERE account_number=$1", creds.Account_number).Scan(&storedHashedPassword)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Account_number: creds.Account_number,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}
// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
// }

// func main() {
// 	initDB()
// 	defer db.Close()

// 	createTableQuery := `
//     CREATE TABLE IF NOT EXISTS seller (
//         id SERIAL PRIMARY KEY,
//         name TEXT,
//         password TEXT,
//         account_number TEXT
//     );
//     `
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/info", RegisterHandler)
// 	mux.HandleFunc("/login", LoginHandler)
// 	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	corsHandler := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:5173"},
// 		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
// 		AllowedHeaders:   []string{"Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}).Handler(mux)

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	err = http.ListenAndServe(":8080", corsHandler)
// 	if err != nil {
// 		panic(err)
// 	}
// }










// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/rs/cors"
// 	_ "github.com/lib/pq"
// )

// var db *sql.DB

// func initDB() {
// 	var err error
// 	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// type Credentials struct {
// 	Account_number string `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name           string `json:"name"`
// 	Account_number string `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type Claims struct {
// 	Account_number string `json:"account_number"`
// 	jwt.RegisteredClaims
// }

// // 🔐 Register
// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	var req RegisterRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}

// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		http.Error(w, "Error hashing password", http.StatusInternalServerError)
// 		return
// 	}

// 	_, err = db.Exec("INSERT INTO seller (name, account_number, password) VALUES ($1, $2, $3)", req.Name, req.Account_number, string(hashedPassword))
// 	if err != nil {
// 		http.Error(w, "Error registering user (maybe account already exists)", http.StatusBadRequest)
// 		return
// 	}

// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// // 🔐 Login
// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	var creds Credentials
// 	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}

// 	var hashedPassword string
// 	err := db.QueryRow("SELECT password FROM seller WHERE account_number=$1", creds.Account_number).Scan(&hashedPassword)
// 	if err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}

// 	if err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(creds.Password)); err != nil {
// 		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
// 		return
// 	}

// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Account_number: creds.Account_number,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}

// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}

// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// // 🔐 Middleware
// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}

// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})

// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
// 			return
// 		}

// 		// Store claims for later use in context (optional)
// 		r.Header.Set("account_number", claims.Account_number)
// 		next.ServeHTTP(w, r)
// 	})
// }

// // 🔐 Protected Route
// func HomeHandler(w http.ResponseWriter, r *http.Request) {
// 	account := r.Header.Get("account_number")
// 	message := fmt.Sprintf("✅ Welcome %s! You are authenticated.", account)
// 	json.NewEncoder(w).Encode(map[string]string{"message": message})
// }

// func main() {
// 	initDB()
// 	defer db.Close()

// 	createTableQuery := `
// 	CREATE TABLE IF NOT EXISTS seller (
// 		id SERIAL PRIMARY KEY,
// 		name TEXT,
// 		password TEXT,
// 		account_number TEXT UNIQUE
// 	);
// 	`
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/register", RegisterHandler)               // register
// 	mux.HandleFunc("/login", LoginHandler)                     // login
// 	mux.Handle("/home", AuthMiddleware(http.HandlerFunc(HomeHandler))) // protected

// 	corsHandler := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:5173"}, // your React origin
// 		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
// 		AllowedHeaders:   []string{"Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}).Handler(mux)

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	if err := http.ListenAndServe(":8080", corsHandler); err != nil {
// 		panic(err)
// 	}
// }







// package main

// import (
// 	"crypto/rand"
// 	"database/sql"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strings"
// 	"time"

// 	"golang.org/x/crypto/bcrypt"
// 	"github.com/golang-jwt/jwt/v5"
// 	"github.com/rs/cors"
// 	_ "github.com/lib/pq"
// )

// var db *sql.DB

// func initDB() {
// 	var err error
// 	connStr := "user=postgres password=tkart@123 dbname=mydb sslmode=disable"
// 	db, err = sql.Open("postgres", connStr)
// 	if err != nil {
// 		panic(err)
// 	}
// 	if err = db.Ping(); err != nil {
// 		panic(err)
// 	}
// 	fmt.Println("Connected to PostgreSQL")
// }

// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }

// var secretKey = generateSecretKey()
// var jwtKey = []byte(secretKey)

// type Credentials struct {
// 	Account_number string `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name           string `json:"name"`
// 	Account_number string `json:"account_number"`
// 	Password       string `json:"password"`
// }

// type Claims struct {
// 	Account_number string `json:"account_number"`
// 	jwt.RegisteredClaims
// }

// func RegisterHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		w.WriteHeader(http.StatusMethodNotAllowed)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Method not allowed"})
// 		return
// 	}
// 	var req RegisterRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid request"})
// 		return
// 	}
// 	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Error hashing password"})
// 		return
// 	}
// 	_, err = db.Exec("INSERT INTO seller (name, account_number, password) VALUES ($1, $2, $3)", req.Name, req.Account_number, string(hashedPassword))
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Error registering user"})
// 		return
// 	}
// 	w.WriteHeader(http.StatusCreated)
// 	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		w.WriteHeader(http.StatusMethodNotAllowed)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Method not allowed"})
// 		return
// 	}
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid request"})
// 		return
// 	}
// 	var storedHashedPassword string
// 	err = db.QueryRow("SELECT password FROM seller WHERE account_number=$1", creds.Account_number).Scan(&storedHashedPassword)
// 	if err != nil {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
// 		return
// 	}
// 	err = bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(creds.Password))
// 	if err != nil {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
// 		return
// 	}
// 	expirationTime := time.Now().Add(24 * time.Hour)
// 	claims := &Claims{
// 		Account_number: creds.Account_number,
// 		RegisteredClaims: jwt.RegisteredClaims{
// 			ExpiresAt: jwt.NewNumericDate(expirationTime),
// 		},
// 	}
// 	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
// 	tokenString, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		json.NewEncoder(w).Encode(map[string]string{"message": "Error generating token"})
// 		return
// 	}
// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
// }

// func AuthMiddleware(next http.Handler) http.Handler {
// 	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
// 		authHeader := r.Header.Get("Authorization")
// 		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
// 			http.Error(w, "Missing or invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
// 		claims := &Claims{}
// 		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
// 			return jwtKey, nil
// 		})
// 		if err != nil || !token.Valid {
// 			http.Error(w, "Invalid token", http.StatusUnauthorized)
// 			return
// 		}
// 		next.ServeHTTP(w, r)
// 	})
// }

// func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
// 	json.NewEncoder(w).Encode(map[string]string{"message": "✅ You are authenticated!"})
// }

// func main() {
// 	initDB()
// 	defer db.Close()

// 	createTableQuery := `
// 	CREATE TABLE IF NOT EXISTS seller (
// 		id SERIAL PRIMARY KEY,
// 		name TEXT,
// 		account_number TEXT UNIQUE,
// 		password TEXT
// 	);`
// 	_, err := db.Exec(createTableQuery)
// 	if err != nil {
// 		panic(err)
// 	}

// 	mux := http.NewServeMux()
// 	mux.HandleFunc("/register", RegisterHandler)
// 	mux.HandleFunc("/login", LoginHandler)
// 	mux.Handle("/home", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	corsHandler := cors.New(cors.Options{
// 		AllowedOrigins:   []string{"http://localhost:5173"},
// 		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
// 		AllowedHeaders:   []string{"Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}).Handler(mux)

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	err = http.ListenAndServe(":8080", corsHandler)
// 	if err != nil {
// 		panic(err)
// 	}
// }




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

	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/rs/cors" // 👈 Added CORS package
	_ "github.com/lib/pq"
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

func main() {
	initDB()
	defer db.Close()

	createTableQuery := `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        username TEXT UNIQUE,
        password TEXT
    );
    `
	_, err := db.Exec(createTableQuery)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

	// ✅ Add CORS middleware
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("🚀 Server running on http://localhost:8080")
	err = http.ListenAndServe(":8080", corsHandler)
	if err != nil {
		panic(err)
	}
}
