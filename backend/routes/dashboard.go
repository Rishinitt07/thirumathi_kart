package routes

import (
	"encoding/json"
	"net/http"
	"thirumathi_delivery/db"
)

type DeliveryOrder struct {
	ID            int    `json:"id"`
	OrderID       int    `json:"order_id"`
	Status        string `json:"status"`
	AssignedAt    string `json:"assigned_at"`
	DropAddress   string `json:"drop_address"`
	DropPincode   string `json:"drop_pincode"`
	PickupAddress string `json:"pickup_address"`
	PickupPincode string `json:"pickup_pincode"`
}

func DashboardHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username := GetUsernameFromContext(r.Context())
	if username == "" {
		http.Error(w, "Username not found in context", http.StatusUnauthorized)
		return
	}

	// Query assigned deliveries for the user
	query := `
		SELECT
			d.id, d.order_id, d.status, d.assigned_at,
			d.drop_address, d.drop_pincode,
			d.pickup_address, d.pickup_pincode
		FROM delivery_orders d
		WHERE d.delivery_user = $1
		ORDER BY d.assigned_at DESC`

	rows, err := db.GetDeliveryDB().Query(query, username)
	if err != nil {
		http.Error(w, "Error fetching deliveries", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var deliveries []DeliveryOrder
	for rows.Next() {
		var delivery DeliveryOrder
		err := rows.Scan(
			&delivery.ID, &delivery.OrderID, &delivery.Status, &delivery.AssignedAt,
			&delivery.DropAddress, &delivery.DropPincode,
			&delivery.PickupAddress, &delivery.PickupPincode)
		if err != nil {
			http.Error(w, "Error scanning delivery", http.StatusInternalServerError)
			return
		}
		deliveries = append(deliveries, delivery)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deliveries)
}
