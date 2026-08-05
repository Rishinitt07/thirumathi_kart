package main

import (
	"net/smtp"
	"os"
	"encoding/json"
	"math/big"
	"crypto/rand"
	"fmt"
	"database/sql"
	"log"
	"net/http"
	"server/db"
	"server/routes"

	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

var (
	deliveryDB *sql.DB
	buyerDB    *sql.DB
	sellerDB   *sql.DB
)

const (
	createUsersStmt = `
	CREATE TABLE IF NOT EXISTS users (
		username       TEXT PRIMARY KEY,
		name           TEXT NOT NULL,
		email          TEXT UNIQUE NOT NULL,
		phone          TEXT,
		password_hash  TEXT NOT NULL,
		created_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
		updated_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
	);`

	createOrdersStmt = `
	CREATE TABLE IF NOT EXISTS delivery_orders (
		id                  SERIAL    PRIMARY KEY,
		order_id            INT       NOT NULL,
		delivery_user       TEXT      NOT NULL REFERENCES users(username),
		status              TEXT      NOT NULL CHECK (status IN ('assigned','in_progress','completed')),
		assigned_at         TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
		updated_at          TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
		drop_address        TEXT      NOT NULL,
		drop_pincode        TEXT      NOT NULL,
		pickup_address      TEXT      NOT NULL,
		pickup_pincode      TEXT      NOT NULL
	);`
)

func initDB() {
	var err error

	// Connect to deliverydb
	deliveryDB, err = sql.Open("postgres", "user=postgres password=dharun123 dbname=deliverydb sslmode=disable")
	if err != nil {
		panic(err)
	}
	if err = deliveryDB.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to deliverydb")

	// Connect to buyerdb (read-only)
	buyerDB, err = sql.Open("postgres", "user=postgres password=dharun123 dbname=buyerdb sslmode=disable")
	if err != nil {
		panic(err)
	}
	if err = buyerDB.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to buyerdb")

	// Connect to sellerdb (mydb) (read-only)
	sellerDB, err = sql.Open("postgres", "user=postgres password=dharun123 dbname=mydb sslmode=disable")
	if err != nil {
		panic(err)
	}
	if err = sellerDB.Ping(); err != nil {

		panic(err)
	}
	fmt.Println("Connected to sellerdb")

	// Auto-migrate deliverydb tables
	for _, stmt := range []string{createUsersStmt, createOrdersStmt} {
		_, err := deliveryDB.Exec(stmt)
		if err != nil {
			log.Printf("Error creating table: %v", err)
		}
	}
	fmt.Println("Database tables created/verified")

	// Set global database connections
	db.SetDeliveryDB(deliveryDB)
	db.SetBuyerDB(buyerDB)
	db.SetSellerDB(sellerDB)
}


type OTPRequest struct {
	Email  string `json:"email"`
	Mobile string `json:"mobile"`
	OTP    string `json:"otp,omitempty"`
}

var otpStore = make(map[string]string)

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
	delete(otpStore, identifier)
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Verified"})
}

func main() {
	initDB()
	defer deliveryDB.Close()
	defer buyerDB.Close()
	defer sellerDB.Close()

	log.Println("FDW-based delivery system started")

	mux := http.NewServeMux()

	// Auth routes
	mux.HandleFunc("/register", routes.RegisterHandler)
	mux.HandleFunc("/login", routes.LoginHandler)
	mux.HandleFunc("/send-otp", SendOTPHandler)
	mux.HandleFunc("/verify-otp", VerifyOTPHandler)

	// Protected routes
	mux.Handle("/dashboard", routes.AuthMiddleware(http.HandlerFunc(routes.DashboardHandler)))
	mux.Handle("/available", routes.AuthMiddleware(http.HandlerFunc(routes.AvailableHandler)))
	mux.Handle("/available/take", routes.AuthMiddleware(http.HandlerFunc(routes.TakeDeliveryHandler)))
	mux.Handle("/delivery/", routes.AuthMiddleware(http.HandlerFunc(routes.UpdateStatusHandler)))
	mux.Handle("/map/", routes.AuthMiddleware(http.HandlerFunc(routes.MapHandler)))
	mux.Handle("/profile", routes.AuthMiddleware(http.HandlerFunc(routes.GetProfileHandler)))

	// CORS configuration
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174", "http://localhost:5175"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("Server starting on port 8082...")
	log.Fatal(http.ListenAndServe(":8082", handler))
}
