// package main

// import (
// 	"crypto/rand"
// 	"encoding/hex"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"         
// 	"strings"
// 	"time"
// 	"github.com/golang-jwt/jwt/v5"
// )


// func generateSecretKey() string {
// 	bytes := make([]byte, 64)
// 	_, err := rand.Read(bytes)
// 	if err != nil {
// 		panic(err)
// 	}
// 	return hex.EncodeToString(bytes)
// }


// var secretKey1 = generateSecretKey()
// var secretKey2 = generateSecretKey()


// func init() {
// 	fmt.Println("🔐 Generated Secret Key 1:", secretKey1)
// 	fmt.Println("🔐 Generated Secret Key 2:", secretKey2)
// }

// var jwtKey = []byte(secretKey1) 

// type Credentials struct {
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// }

// type Claims struct {
// 	Username string `json:"username"`
// 	jwt.RegisteredClaims
// }

// func LoginHandler(w http.ResponseWriter, r *http.Request) {
// 	var creds Credentials
// 	err := json.NewDecoder(r.Body).Decode(&creds)
// 	if err != nil {
// 		http.Error(w, "Invalid request", http.StatusBadRequest)
// 		return
// 	}

	
// 	if creds.Username != "admin" || creds.Password != "password" {
// 		http.Error(w, "Unauthorized", http.StatusUnauthorized)
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
// 	tokenStr, err := token.SignedString(jwtKey)
// 	if err != nil {
// 		http.Error(w, "Error generating token", http.StatusInternalServerError)
// 		return
// 	}

// 	json.NewEncoder(w).Encode(map[string]string{"token": tokenStr})
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
// 	http.HandleFunc("/login", LoginHandler)
// 	http.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

// 	fmt.Println("🚀 Server running on http://localhost:8080")
// 	http.ListenAndServe(":8080", nil)
// }



// main.go
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
	//  "github.com/lib/pq"
)

var db *sql.DB

// initDB connects to PostgreSQL and sets up the connection.
func initDB() {
	var err error
	// Adjust the connection string as needed.
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

// generateSecretKey creates a random secret key.
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

// Credentials for login requests.
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterRequest represents the JSON payload for registration.
type RegisterRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// Claims represents the JWT claims.
type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

// RegisterHandler handles user registration.
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
	// Hash the password using bcrypt.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	// Insert new user into the database.
	_, err = db.Exec("INSERT INTO users (name, username, password) VALUES ($1, $2, $3)", req.Name, req.Username, string(hashedPassword))
	if err != nil {
		http.Error(w, "Error registering user", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// LoginHandler authenticates a user and returns a JWT.
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
	// Retrieve the stored hashed password.
	var storedHashedPassword string
	err = db.QueryRow("SELECT password FROM users WHERE username=$1", creds.Username).Scan(&storedHashedPassword)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}
	// Compare the stored password with the provided password.
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

// AuthMiddleware protects routes by validating JWT tokens.
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

// ProtectedHandler is an example of a protected route.
func ProtectedHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "✅ You are authenticated and can access this route.")
}

func main() {
	// Initialize PostgreSQL connection.
	initDB()
	defer db.Close()

	// Create the users table if it doesn't exist.
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

	// Route handlers.
	http.HandleFunc("/info", RegisterHandler)
	http.HandleFunc("/login", LoginHandler)
	http.Handle("/dashboard", AuthMiddleware(http.HandlerFunc(ProtectedHandler)))

	fmt.Println("🚀 Server running on http://localhost:8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		panic(err)
	}
}
