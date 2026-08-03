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
	"database/sql"
	"encoding/json"
	"net/http"
	"server/db"
	"strings"
)

type AvailableOrder struct {
	OrderID       int    `json:"order_id"`
	Buyer         string `json:"buyer"`
	DropAddress   string `json:"drop_address"`
	DropPincode   string `json:"drop_pincode"`
	Phone         string  `json:"phone"`
	PickupAddress string  `json:"pickup_address"`
	PickupPincode string  `json:"pickup_pincode"`
	BuyerLat      float64 `json:"buyer_lat"`
	BuyerLng      float64 `json:"buyer_lng"`
	SellerLat     float64 `json:"seller_lat"`
	SellerLng     float64 `json:"seller_lng"`
}

type TakeDeliveryRequest struct {
	OrderID int `json:"order_id"`
}

func AvailableHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	deliveryDB := db.GetDeliveryDB()
	buyerDB := db.GetBuyerDB()

	// 1. Get IDs of orders already taken by delivery partners
	assignedRows, err := deliveryDB.Query("SELECT DISTINCT order_id FROM delivery_orders WHERE status IN ('assigned', 'in_progress', 'completed')")
	if err != nil {
		http.Error(w, "Error fetching assigned orders: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer assignedRows.Close()

	assignedMap := make(map[int]bool)
	for assignedRows.Next() {
		var oID int
		if err := assignedRows.Scan(&oID); err == nil {
			assignedMap[oID] = true
		}
	}

	// 2. Query buyerdb for orders marked 'Shipped' (seller packed & ready for delivery)
	query := `
        SELECT id, COALESCE(username, ''), COALESCE(phone, ''), COALESCE(address, ''), COALESCE(pincode, ''), latitude, longitude, seller_latitude, seller_longitude
        FROM orders
        WHERE status = 'Shipped'
        ORDER BY date DESC
        LIMIT 50`

	rows, err := buyerDB.Query(query)
	if err != nil {
		http.Error(w, "Error fetching orders: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var availableOrders []AvailableOrder
	for rows.Next() {
		var orderID int
		var username, phone, address, pincode string
		var bLat, bLng, sLat, sLng sql.NullFloat64

		err := rows.Scan(&orderID, &username, &phone, &address, &pincode, &bLat, &bLng, &sLat, &sLng)
		if err != nil {
			continue // Skip problematic rows
		}

		// Check if already assigned
		if assignedMap[orderID] {
			continue
		}

		// Get pickup address using relaxed matching
		_, _, pickupAddress, pickupPincode := getPickupAddressForOrderRelaxed(orderID)

		order := AvailableOrder{
			OrderID:       orderID,
			Buyer:         username,
			DropAddress:   address,
			DropPincode:   pincode,
			Phone:         phone,
			PickupAddress: pickupAddress,
			PickupPincode: pickupPincode,
		}

		if bLat.Valid { order.BuyerLat = bLat.Float64 }
		if bLng.Valid { order.BuyerLng = bLng.Float64 }
		if sLat.Valid { order.SellerLat = sLat.Float64 }
		if sLng.Valid { order.SellerLng = sLng.Float64 }

		availableOrders = append(availableOrders, order)
		
		if len(availableOrders) >= 20 {
			break // Limit to 20 returned to frontend
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if availableOrders == nil {
		availableOrders = []AvailableOrder{}
	}
	json.NewEncoder(w).Encode(availableOrders)
}

func getPickupAddressForOrderRelaxed(orderID int) (string, string, string, string) {
	buyerDB := db.GetBuyerDB()
	sellerDB := db.GetSellerDB()

	// 1. Get the seller_mobile from the first item in the order
	var itemsJSON string
	err := buyerDB.QueryRow("SELECT items FROM orders WHERE id = $1", orderID).Scan(&itemsJSON)
	if err != nil {
		return "Thirumathi Seller", "9876543210", "Default Warehouse, Chennai, Tamil Nadu", "600032"
	}

	var items []map[string]interface{}
	if err := json.Unmarshal([]byte(itemsJSON), &items); err != nil || len(items) == 0 {
		return "Thirumathi Seller", "9876543210", "Default Warehouse, Chennai, Tamil Nadu", "600032"
	}

	sellerMobile, ok := items[0]["seller_mobile"].(string)
	if !ok || sellerMobile == "" {
		return "Thirumathi Seller", "9876543210", "Default Warehouse, Chennai, Tamil Nadu", "600032"
	}

	// 2. Query sellerDB for the seller's address and name
	var firstName, lastName, addr1, addr2, area, city, state, pincode string
	err = sellerDB.QueryRow(`
		SELECT COALESCE(first_name, ''), COALESCE(last_name, ''), COALESCE(address_line_1, ''), COALESCE(address_line_2, ''), COALESCE(area, ''), COALESCE(city, ''), COALESCE(state, ''), COALESCE(pincode, '')
		FROM users WHERE mobile = $1`, sellerMobile).Scan(&firstName, &lastName, &addr1, &addr2, &area, &city, &state, &pincode)

	if err != nil {
		return "Thirumathi Seller", sellerMobile, "Default Warehouse, Chennai, Tamil Nadu", "600032"
	}

	sellerName := strings.TrimSpace(firstName + " " + lastName)
	if sellerName == "" {
		sellerName = "Thirumathi Seller"
	}

	// Build the full address
	var parts []string
	for _, p := range []string{addr1, addr2, area, city, state} {
		if strings.TrimSpace(p) != "" {
			parts = append(parts, strings.TrimSpace(p))
		}
	}
	
	if len(parts) == 0 {
		return sellerName, sellerMobile, "Default Warehouse, Chennai, Tamil Nadu", "600032"
	}

	return sellerName, sellerMobile, strings.Join(parts, ", "), pincode
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

	// Check if user already has 1 or more active deliveries
	countQuery := `
        SELECT COUNT(*) FROM delivery_orders 
        WHERE delivery_user = $1 AND status != 'completed'`
	var activeCount int
	err := deliveryDB.QueryRow(countQuery, username).Scan(&activeCount)
	if err != nil {
		http.Error(w, "Error checking active deliveries: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if activeCount >= 1 {
		http.Error(w, "You already have an active delivery. Complete it before taking a new one.", http.StatusBadRequest)
		return
	}

	buyerDB := db.GetBuyerDB()

	// 1. Check if it's already assigned
	var assignedStatus string
	err = deliveryDB.QueryRow("SELECT status FROM delivery_orders WHERE order_id = $1 AND status IN ('assigned', 'in_progress')", req.OrderID).Scan(&assignedStatus)
	if err == nil {
		// Found it, so it's already assigned
		http.Error(w, "Order already assigned", http.StatusConflict)
		return
	}

	// 2. Fetch order details from buyerdb
	var buyerUsername, buyerPhone, buyerAddress, buyerPincode string
	err = buyerDB.QueryRow(`
        SELECT COALESCE(username, ''), COALESCE(phone, ''), COALESCE(address, ''), COALESCE(pincode, '')
        FROM orders
        WHERE id = $1 AND status = 'Shipped'`, req.OrderID).Scan(&buyerUsername, &buyerPhone, &buyerAddress, &buyerPincode)
	if err != nil {
		http.Error(w, "Order not available or not ready for pickup", http.StatusNotFound)
		return
	}

	// Get pickup address using relaxed matching
	_, _, pickupAddress, pickupPincode := getPickupAddressForOrderRelaxed(req.OrderID)

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
