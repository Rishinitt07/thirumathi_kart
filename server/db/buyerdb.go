package db

import (
	"database/sql"
	"time"
)

// BuyerOrder represents an order with seller information
type BuyerOrder struct {
	ID             int       `json:"id"`
	Username       string    `json:"username"`
	Date           time.Time `json:"date"`
	PickupAddress  string    `json:"pickup_address"`
	PickupPincode  string    `json:"pickup_pincode"`
	SellerUsername string    `json:"seller_username"`
}

// OrderWithDetails represents order with pickup/drop details
type OrderWithDetails struct {
	ID            int       `json:"id"`
	Username      string    `json:"username"`
	Date          time.Time `json:"date"`
	DropAddress   string    `json:"drop_address"`
	DropPincode   string    `json:"drop_pincode"`
	PickupAddress string    `json:"pickup_address"`
	PickupPincode string    `json:"pickup_pincode"`
	Phone         string    `json:"phone"`
}

// GetAvailableOrders fetches orders using FDW with seller pickup addresses
func GetAvailableOrders() ([]OrderWithDetails, error) {
	query := `
    WITH order_sellers AS (
        SELECT DISTINCT 
            bo.id,
            bo.username,
            bo.date,
            sp.username as seller_username,
            su.address,
            su.district,
            su.state,
            su.pincode
        FROM buyer_orders bo
        JOIN buyer_order_items boi ON bo.id = boi.order_id
        JOIN seller_products sp ON LOWER(TRIM(boi.name)) = LOWER(TRIM(sp.name))
        JOIN seller_users su ON sp.username = su.username
        WHERE bo.id NOT IN (
            SELECT DISTINCT order_id 
            FROM delivery_orders 
            WHERE status IN ('assigned', 'in_progress')
        )
    ),
    order_pickup AS (
        SELECT 
            id,
            username,
            date,
            -- Get first seller's address as primary pickup (could be enhanced to get nearest)
            STRING_AGG(
                CASE 
                    WHEN district IS NOT NULL AND state IS NOT NULL 
                    THEN address || ', ' || district || ', ' || state
                    ELSE address
                END, 
                ' | ' 
                ORDER BY seller_username LIMIT 1
            ) as pickup_address,
            STRING_AGG(pincode, ' | ' ORDER BY seller_username LIMIT 1) as pickup_pincode
        FROM order_sellers
        GROUP BY id, username, date
    )
    SELECT 
        op.id,
        op.username,
        op.date,
        'Customer Address' as drop_address,  -- Placeholder - you might want to add this to buyer_orders
        '000000' as drop_pincode,           -- Placeholder
        op.pickup_address,
        op.pickup_pincode,
        'No Phone' as phone                -- Placeholder - you might want to add this to buyer_orders
    FROM order_pickup op
    ORDER BY op.date DESC`

	rows, err := deliveryDB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []OrderWithDetails
	for rows.Next() {
		var order OrderWithDetails
		var date sql.NullTime

		err := rows.Scan(
			&order.ID, &order.Username, &date,
			&order.DropAddress, &order.DropPincode,
			&order.PickupAddress, &order.PickupPincode,
			&order.Phone,
		)
		if err != nil {
			return nil, err
		}

		if date.Valid {
			order.Date = date.Time
		}

		orders = append(orders, order)
	}

	return orders, nil
}

// GetOrderPickupDetails gets pickup details for a specific order using FDW
func GetOrderPickupDetails(orderID int) (string, string, error) {
	query := `
    SELECT 
        CASE 
            WHEN su.district IS NOT NULL AND su.state IS NOT NULL 
            THEN su.address || ', ' || su.district || ', ' || su.state
            ELSE su.address
        END as pickup_address,
        su.pincode as pickup_pincode
    FROM buyer_orders bo
    JOIN buyer_order_items boi ON bo.id = boi.order_id
    JOIN seller_products sp ON LOWER(TRIM(boi.name)) = LOWER(TRIM(sp.name))
    JOIN seller_users su ON sp.username = su.username
    WHERE bo.id = $1
    LIMIT 1` // Get first seller's address as primary pickup

	var pickupAddress, pickupPincode string
	err := deliveryDB.QueryRow(query, orderID).Scan(&pickupAddress, &pickupPincode)
	if err != nil {
		// Return default if no seller found
		return "Default Warehouse Address", "000000", err
	}

	return pickupAddress, pickupPincode, nil
}

// GetOrderDetails fetches basic order info using FDW
func GetOrderDetails(orderID int) (*BuyerOrder, error) {
	query := `SELECT id, username, date FROM buyer_orders WHERE id = $1`

	var order BuyerOrder
	var date sql.NullTime

	err := deliveryDB.QueryRow(query, orderID).Scan(&order.ID, &order.Username, &date)
	if err != nil {
		return nil, err
	}

	if date.Valid {
		order.Date = date.Time
	}

	// Get pickup details
	pickupAddress, pickupPincode, _ := GetOrderPickupDetails(orderID)
	order.PickupAddress = pickupAddress
	order.PickupPincode = pickupPincode

	return &order, nil
}
