package db

import (
	"database/sql"
)

var (
	deliveryDB *sql.DB
	buyerDB    *sql.DB
	sellerDB   *sql.DB
)

func SetDeliveryDB(db *sql.DB) {
	deliveryDB = db
}

func SetBuyerDB(db *sql.DB) {
	buyerDB = db
}

func SetSellerDB(db *sql.DB) {
	sellerDB = db
}

func GetDeliveryDB() *sql.DB {
	return deliveryDB
}

func GetBuyerDB() *sql.DB {
	return buyerDB
}

func GetSellerDB() *sql.DB {
	return sellerDB
}
