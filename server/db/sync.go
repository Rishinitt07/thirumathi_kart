package db

import (
	"fmt"
	"log"
	"time"
)

// OrderSync handles syncing orders from buyerdb to deliverydb
type OrderSync struct {
	syncInterval time.Duration
}

// NewOrderSync creates a new sync service
func NewOrderSync(interval time.Duration) *OrderSync {
	return &OrderSync{
		syncInterval: interval,
	}
}

// SyncOrdersFromBuyerDB syncs orders from buyerdb to deliverydb
func (os *OrderSync) SyncOrdersFromBuyerDB() error {
	// Get all orders from buyerdb
	query := `SELECT id, username, date, phone, address, pincode FROM orders ORDER BY id`

	rows, err := buyerDB.Query(query)
	if err != nil {
		return fmt.Errorf("failed to query buyer orders: %v", err)
	}
	defer rows.Close()

	var syncedCount int
	var updatedCount int

	for rows.Next() {
		var id int
		var username, phone, address, pincode string
		var date time.Time

		err := rows.Scan(&id, &username, &date, &phone, &address, &pincode)
		if err != nil {
			log.Printf("Error scanning order: %v", err)
			continue
		}

		// Check if order exists in deliverydb
		exists, err := os.orderExists(id)
		if err != nil {
			log.Printf("Error checking order existence: %v", err)
			continue
		}

		if exists {
			// Update existing order
			err = os.updateOrder(id, username, date, phone, address, pincode)
			if err == nil {
				updatedCount++
			}
		} else {
			// Insert new order
			err = os.insertOrder(id, username, date, phone, address, pincode)
			if err == nil {
				syncedCount++
			}
		}

		if err != nil {
			log.Printf("Error syncing order %d: %v", id, err)
		}
	}

	if syncedCount > 0 || updatedCount > 0 {
		log.Printf("Synced %d new orders, updated %d existing orders", syncedCount, updatedCount)
	}

	return nil
}

// orderExists checks if an order exists in deliverydb
func (os *OrderSync) orderExists(orderID int) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM orders WHERE id = $1)`
	err := deliveryDB.QueryRow(query, orderID).Scan(&exists)
	return exists, err
}

// insertOrder inserts a new order into deliverydb
func (os *OrderSync) insertOrder(id int, username string, date time.Time, phone, address, pincode string) error {
	query := `
        INSERT INTO orders (id, username, date, phone, address, pincode, synced_at) 
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`

	_, err := deliveryDB.Exec(query, id, username, date, phone, address, pincode)
	return err
}

// updateOrder updates an existing order in deliverydb
func (os *OrderSync) updateOrder(id int, username string, date time.Time, phone, address, pincode string) error {
	query := `
        UPDATE orders 
        SET username = $2, date = $3, phone = $4, address = $5, pincode = $6, synced_at = CURRENT_TIMESTAMP
        WHERE id = $1`

	_, err := deliveryDB.Exec(query, id, username, date, phone, address, pincode)
	return err
}

// StartPeriodicSync starts the periodic synchronization
func (os *OrderSync) StartPeriodicSync() {
	log.Printf("Starting periodic order sync every %v", os.syncInterval)

	// Initial sync
	if err := os.SyncOrdersFromBuyerDB(); err != nil {
		log.Printf("Initial sync error: %v", err)
	}

	// Periodic sync
	ticker := time.NewTicker(os.syncInterval)
	go func() {
		for range ticker.C {
			if err := os.SyncOrdersFromBuyerDB(); err != nil {
				log.Printf("Periodic sync error: %v", err)
			}
		}
	}()
}
