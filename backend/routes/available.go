// package routes

// import (
// 	"encoding/json"
// 	"net/http"
// 	"thirumathi_delivery/db"
// )

// type AvailableOrder struct {
// 	OrderID       int    `json:"order_id"`
// 	Buyer         string `json:"buyer"`
// 	DropAddress   string `json:"drop_address"`
// 	DropPincode   string `json:"drop_pincode"`
// 	Phone         string `json:"phone"`
// 	PickupAddress string `json:"pickup_address"`
// 	PickupPincode string `json:"pickup_pincode"`
// }

// type TakeDeliveryRequest struct {
// 	OrderID int `json:"order_id"`
// }

// func AvailableHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodGet {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	// Simple query that works with your actual data
// 	query := `
//         SELECT bo.id, bo.username, bo.phone, bo.address, bo.pincode
//         FROM buyer_orders bo
//         WHERE bo.id NOT IN (
//             SELECT DISTINCT order_id
//             FROM delivery_orders
//             WHERE status IN ('assigned', 'in_progress')
//         )
//         ORDER BY bo.date DESC
//         LIMIT 20`

// 	deliveryDB := db.GetDeliveryDB()
// 	rows, err := deliveryDB.Query(query)
// 	if err != nil {
// 		http.Error(w, "Error fetching orders: "+err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	defer rows.Close()

// 	var availableOrders []AvailableOrder
// 	for rows.Next() {
// 		var orderID int
// 		var username, phone, address, pincode string

// 		err := rows.Scan(&orderID, &username, &phone, &address, &pincode)
// 		if err != nil {
// 			http.Error(w, "Error scanning order: "+err.Error(), http.StatusInternalServerError)
// 			return
// 		}

// 		// Use default seller address for now (we'll fix matching later)
// 		pickupAddress := "Plot 45, Industrial Estate, Guindy, Chennai, Tamil Nadu"
// 		pickupPincode := "600032"

// 		availableOrders = append(availableOrders, AvailableOrder{
// 			OrderID:       orderID,
// 			Buyer:         username,
// 			DropAddress:   address,       // Real customer address from buyer_orders
// 			DropPincode:   pincode,       // Real customer pincode
// 			Phone:         phone,         // Real customer phone
// 			PickupAddress: pickupAddress, // Default for now
// 			PickupPincode: pickupPincode, // Default for now
// 		})
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(availableOrders)
// }

// func TakeDeliveryHandler(w http.ResponseWriter, r *http.Request) {
// 	if r.Method != http.MethodPost {
// 		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
// 		return
// 	}

// 	username := GetUsernameFromContext(r.Context())
// 	if username == "" {
// 		http.Error(w, "Username not found in context", http.StatusUnauthorized)
// 		return
// 	}

// 	var req TakeDeliveryRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		http.Error(w, "Invalid JSON", http.StatusBadRequest)
// 		return
// 	}

// 	// Check if user already has 3 or more active deliveries
// 	countQuery := `
//         SELECT COUNT(*) FROM delivery_orders
//         WHERE delivery_user = $1 AND status != 'completed'`
// 	var activeCount int
// 	err := db.GetDeliveryDB().QueryRow(countQuery, username).Scan(&activeCount)
// 	if err != nil {
// 		http.Error(w, "Error checking active deliveries", http.StatusInternalServerError)
// 		return
// 	}

// 	if activeCount >= 3 {
// 		http.Error(w, "Maximum of 3 active deliveries allowed", http.StatusBadRequest)
// 		return
// 	}

// 	// Get order details using FDW
// 	order, err := db.GetOrderDetails(req.OrderID)
// 	if err != nil {
// 		http.Error(w, "Order not found", http.StatusNotFound)
// 		return
// 	}

// 	// Get real pickup details using FDW chain
// 	pickupAddress, pickupPincode, err := db.GetOrderPickupDetails(req.OrderID)
// 	if err != nil {
// 		// Use defaults if no seller found
// 		pickupAddress = "Default Warehouse Address"
// 		pickupPincode = "000000"
// 	}

// 	// Insert delivery assignment with real pickup details
// 	insertQuery := `
//         INSERT INTO delivery_orders
//         (order_id, delivery_user, status, drop_address, drop_pincode, pickup_address, pickup_pincode)
//         VALUES ($1, $2, 'assigned', $3, $4, $5, $6)`

// 	// Use placeholder drop address since buyerdb.orders doesn't have address fields in your schema
// 	dropAddress := "Customer Address - " + order.Username
// 	dropPincode := "000000"

// 	_, err = db.GetDeliveryDB().Exec(insertQuery, req.OrderID, username, dropAddress, dropPincode, pickupAddress, pickupPincode)
// 	if err != nil {
// 		http.Error(w, "Error assigning delivery", http.StatusInternalServerError)
// 		return
// 	}

//		w.Header().Set("Content-Type", "application/json")
//		json.NewEncoder(w).Encode(map[string]string{"message": "Delivery assigned successfully"})
//	}
package routes

import (
	"encoding/json"
	"net/http"
	"strings"
	"thirumathi_delivery/db"
)

type AvailableOrder struct {
	OrderID       int    `json:"order_id"`
	Buyer         string `json:"buyer"`
	DropAddress   string `json:"drop_address"`
	DropPincode   string `json:"drop_pincode"`
	Phone         string `json:"phone"`
	PickupAddress string `json:"pickup_address"`
	PickupPincode string `json:"pickup_pincode"`
}

type TakeDeliveryRequest struct {
	OrderID int `json:"order_id"`
}

func AvailableHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Query using actual buyer_orders schema with real address data
	query := `
        SELECT bo.id, bo.username, bo.phone, bo.address, bo.pincode
        FROM buyer_orders bo
        WHERE bo.id NOT IN (
            SELECT DISTINCT order_id 
            FROM delivery_orders 
            WHERE status IN ('assigned', 'in_progress','completed')
        )
        ORDER BY bo.date DESC
        LIMIT 20`

	deliveryDB := db.GetDeliveryDB()
	rows, err := deliveryDB.Query(query)
	if err != nil {
		http.Error(w, "Error fetching orders: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var availableOrders []AvailableOrder
	for rows.Next() {
		var orderID int
		var username, phone, address, pincode string

		err := rows.Scan(&orderID, &username, &phone, &address, &pincode)
		if err != nil {
			http.Error(w, "Error scanning order: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Get pickup address using relaxed matching
		pickupAddress, pickupPincode := getPickupAddressForOrderRelaxed(orderID)

		availableOrders = append(availableOrders, AvailableOrder{
			OrderID:       orderID,
			Buyer:         username,
			DropAddress:   address,       // Real customer address from buyer_orders
			DropPincode:   pincode,       // Real customer pincode from buyer_orders
			Phone:         phone,         // Real customer phone from buyer_orders
			PickupAddress: pickupAddress, // Real seller warehouse address
			PickupPincode: pickupPincode, // Real seller warehouse pincode
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(availableOrders)
}

// Relaxed matching function to get pickup address for an order
func getPickupAddressForOrderRelaxed(orderID int) (string, string) {
	deliveryDB := db.GetDeliveryDB()

	// Strategy 1: Try exact name matching first
	exactQuery := `
        SELECT DISTINCT su.address, su.district, su.state, su.pincode, su.name
        FROM buyer_order_items boi
        JOIN seller_products sp ON LOWER(TRIM(boi.name)) = LOWER(TRIM(sp.name))
        JOIN seller_users su ON sp.username = su.username
        WHERE boi.order_id = $1
        LIMIT 1`

	var address, district, state, pincode, sellerName string
	err := deliveryDB.QueryRow(exactQuery, orderID).Scan(&address, &district, &state, &pincode, &sellerName)

	if err == nil {
		// Found exact match
		return buildFullAddress(address, district, state), pincode
	}

	// Strategy 2: Try partial matching with key words
	partialQuery := `
        SELECT DISTINCT su.address, su.district, su.state, su.pincode, su.name,
               boi.name as buyer_product, sp.name as seller_product
        FROM buyer_order_items boi
        JOIN seller_products sp ON (
            -- Match if any word from buyer product appears in seller product
            LOWER(sp.name) LIKE '%' || LOWER(SPLIT_PART(boi.name, ' ', 1)) || '%'
            OR LOWER(sp.name) LIKE '%' || LOWER(SPLIT_PART(boi.name, ' ', 2)) || '%'
            OR LOWER(boi.name) LIKE '%' || LOWER(SPLIT_PART(sp.name, ' ', 1)) || '%'
            OR LOWER(boi.name) LIKE '%' || LOWER(SPLIT_PART(sp.name, ' ', 2)) || '%'
            -- Also try category-based matching
            OR (LOWER(boi.name) LIKE '%rice%' AND LOWER(sp.name) LIKE '%rice%')
            OR (LOWER(boi.name) LIKE '%milk%' AND LOWER(sp.name) LIKE '%milk%')
            OR (LOWER(boi.name) LIKE '%flour%' AND LOWER(sp.name) LIKE '%flour%')
            OR (LOWER(boi.name) LIKE '%oil%' AND LOWER(sp.name) LIKE '%oil%')
            OR (LOWER(boi.name) LIKE '%dal%' AND LOWER(sp.name) LIKE '%dal%')
            OR (LOWER(boi.name) LIKE '%bread%' AND LOWER(sp.name) LIKE '%bread%')
            OR (LOWER(boi.name) LIKE '%egg%' AND LOWER(sp.name) LIKE '%egg%')
            OR (LOWER(boi.name) LIKE '%chicken%' AND LOWER(sp.name) LIKE '%chicken%')
            OR (LOWER(boi.name) LIKE '%fish%' AND LOWER(sp.name) LIKE '%fish%')
            OR (LOWER(boi.name) LIKE '%ghee%' AND LOWER(sp.name) LIKE '%ghee%')
        )
        JOIN seller_users su ON sp.username = su.username
        WHERE boi.order_id = $1
        ORDER BY (
            -- Prioritize better matches
            CASE 
                WHEN LOWER(boi.name) = LOWER(sp.name) THEN 1
                WHEN LOWER(boi.name) LIKE '%' || LOWER(sp.name) || '%' THEN 2
                WHEN LOWER(sp.name) LIKE '%' || LOWER(boi.name) || '%' THEN 3
                ELSE 4
            END
        )
        LIMIT 1`

	var buyerProduct, sellerProduct string
	err = deliveryDB.QueryRow(partialQuery, orderID).Scan(&address, &district, &state, &pincode, &sellerName, &buyerProduct, &sellerProduct)

	if err == nil {
		// Found partial match
		return buildFullAddress(address, district, state), pincode
	}

	// Strategy 3: If no product matches, get the first available seller (fallback)
	fallbackQuery := `
        SELECT DISTINCT su.address, su.district, su.state, su.pincode, su.name
        FROM seller_users su
        WHERE su.username IN (
            SELECT DISTINCT username FROM seller_products WHERE in_stock = true
        )
        LIMIT 1`

	err = deliveryDB.QueryRow(fallbackQuery).Scan(&address, &district, &state, &pincode, &sellerName)

	if err == nil {
		// Found fallback seller
		return buildFullAddress(address, district, state), pincode
	}

	// Strategy 4: Ultimate fallback - default address
	return "Default Warehouse, Chennai, Tamil Nadu", "600032"
}

// Helper function to build full address from components
func buildFullAddress(address, district, state string) string {
	parts := []string{address}

	if strings.TrimSpace(district) != "" {
		parts = append(parts, strings.TrimSpace(district))
	}

	if strings.TrimSpace(state) != "" {
		parts = append(parts, strings.TrimSpace(state))
	}

	return strings.Join(parts, ", ")
}

func TakeDeliveryHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username := GetUsernameFromContext(r.Context())
	if username == "" {
		http.Error(w, "Username not found in context", http.StatusUnauthorized)
		return
	}

	var req TakeDeliveryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	deliveryDB := db.GetDeliveryDB()

	// Check if user already has 3 or more active deliveries
	countQuery := `
        SELECT COUNT(*) FROM delivery_orders 
        WHERE delivery_user = $1 AND status != 'completed'`
	var activeCount int
	err := deliveryDB.QueryRow(countQuery, username).Scan(&activeCount)
	if err != nil {
		http.Error(w, "Error checking active deliveries: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if activeCount >= 3 {
		http.Error(w, "Maximum of 3 active deliveries allowed", http.StatusBadRequest)
		return
	}

	// Check if order is still available
	checkQuery := `
        SELECT bo.username, bo.phone, bo.address, bo.pincode
        FROM buyer_orders bo
        WHERE bo.id = $1
        AND bo.id NOT IN (
            SELECT DISTINCT order_id 
            FROM delivery_orders 
            WHERE status IN ('assigned', 'in_progress')
        )`

	var buyerUsername, buyerPhone, buyerAddress, buyerPincode string
	err = deliveryDB.QueryRow(checkQuery, req.OrderID).Scan(&buyerUsername, &buyerPhone, &buyerAddress, &buyerPincode)
	if err != nil {
		http.Error(w, "Order not available or already assigned", http.StatusNotFound)
		return
	}

	// Get pickup address using the same relaxed matching
	pickupAddress, pickupPincode := getPickupAddressForOrderRelaxed(req.OrderID)

	// Insert delivery assignment with real addresses
	insertQuery := `
        INSERT INTO delivery_orders 
        (order_id, delivery_user, status, drop_address, drop_pincode, pickup_address, pickup_pincode)
        VALUES ($1, $2, 'assigned', $3, $4, $5, $6)`

	_, err = deliveryDB.Exec(insertQuery, req.OrderID, username, buyerAddress, buyerPincode, pickupAddress, pickupPincode)
	if err != nil {
		http.Error(w, "Error assigning delivery: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":        "Delivery assigned successfully",
		"order_id":       req.OrderID,
		"pickup_address": pickupAddress,
		"pickup_pincode": pickupPincode,
		"drop_address":   buyerAddress,
		"drop_pincode":   buyerPincode,
	})
}
