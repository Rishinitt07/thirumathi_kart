

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
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// }

// type RegisterRequest struct {
// 	Name     string `json:"name"`
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// }

// type Claims struct {
// 	Username string `json:"username"`
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
// 	_, err = db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)", req.Name, req.Username, string(hashedPassword))
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
// 	err = db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username).Scan(&storedHashedPassword)
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
//         username TEXT UNIQUE,
//         password TEXT
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

	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/rs/cors"
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

// 🟡 Upload Product Handler
func UploadProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		http.Error(w, "Failed to parse form", http.StatusBadRequest)
		return
	}

	description := r.FormValue("description")
	price := r.FormValue("price")
	quantity := r.FormValue("quantity")

	file, _, err := r.FormFile("image")
	if err != nil {
		http.Error(w, "Failed to read image", http.StatusBadRequest)
		return
	}
	defer file.Close()

	imageBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Failed to read image bytes", http.StatusInternalServerError)
		return
	}

	_, err = db.Exec("INSERT INTO products (description, price, quantity, image) VALUES ($1, $2, $3, $4)",
		description, price, quantity, imageBytes)
	if err != nil {
		http.Error(w, "Failed to insert product", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"message": "Product uploaded successfully"})
}

func main() {
	initDB()
	defer db.Close()

	// 🛠 Create `users` table
	createUserTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		name TEXT,
		username TEXT UNIQUE,
		password TEXT
	);
	`
	_, err := db.Exec(createUserTable)
	if err != nil {
		panic(err)
	}

	// 🛠 Create `products` table
	createProductTable := `
	CREATE TABLE IF NOT EXISTS products (
		id SERIAL PRIMARY KEY,
		description TEXT,
		price NUMERIC,
		quantity INT,
		image BYTEA
	);
	`
	_, err = db.Exec(createProductTable)
	if err != nil {
		panic(err)
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/info", RegisterHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))
	mux.Handle("/upload", AuthMiddleware(http.HandlerFunc(UploadProductHandler)))

	// ✅ Enable CORS
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
