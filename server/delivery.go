package main

import (
	"database/sql"
	"fmt"
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
	deliveryDB, err = sql.Open("postgres", "user=postgres password=22102004 dbname=deliverydb sslmode=disable")
	if err != nil {
		panic(err)
	}
	if err = deliveryDB.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to deliverydb")

	// Connect to buyerdb (read-only)
	buyerDB, err = sql.Open("postgres", "user=postgres password=22102004 dbname=buyerdb sslmode=disable")
	if err != nil {
		panic(err)
	}
	if err = buyerDB.Ping(); err != nil {
		panic(err)
	}
	fmt.Println("Connected to buyerdb")

	// Connect to sellerdb (read-only)
	sellerDB, err = sql.Open("postgres", "user=postgres password=22102004 dbname=sellerdb sslmode=disable")
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

	// Protected routes
	mux.Handle("/dashboard", routes.AuthMiddleware(http.HandlerFunc(routes.DashboardHandler)))
	mux.Handle("/available", routes.AuthMiddleware(http.HandlerFunc(routes.AvailableHandler)))
	mux.Handle("/available/take", routes.AuthMiddleware(http.HandlerFunc(routes.TakeDeliveryHandler)))
	mux.Handle("/delivery/", routes.AuthMiddleware(http.HandlerFunc(routes.UpdateStatusHandler)))
	mux.Handle("/map/", routes.AuthMiddleware(http.HandlerFunc(routes.MapHandler)))

	// CORS configuration
	handler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5174"},
		AllowedMethods:   []string{"GET", "POST", "PATCH", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(mux)

	fmt.Println("Server starting on port 8082...")
	log.Fatal(http.ListenAndServe(":8082", handler))
}
