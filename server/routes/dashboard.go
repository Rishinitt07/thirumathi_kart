package routes

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"server/db"
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
	BuyerName     string `json:"buyer_name"`
	BuyerMobile   string `json:"buyer_mobile"`
	SellerName    string  `json:"seller_name"`
	SellerMobile  string  `json:"seller_mobile"`
	BuyerLat      float64 `json:"buyer_lat"`
	BuyerLng      float64 `json:"buyer_lng"`
	SellerLat     float64 `json:"seller_lat"`
	SellerLng     float64 `json:"seller_lng"`
	DeliveryCharge float64 `json:"delivery_charge"`
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

	buyerDB := db.GetBuyerDB()
	var deliveries []DeliveryOrder
	for rows.Next() {
		var delivery DeliveryOrder
		if err := rows.Scan(&delivery.ID, &delivery.OrderID, &delivery.Status, &delivery.AssignedAt, &delivery.DropAddress, &delivery.DropPincode, &delivery.PickupAddress, &delivery.PickupPincode); err != nil {
			log.Printf("Error scanning delivery order: %v", err)
			continue
		}

		// Fetch buyer details
		var buyerUsername, buyerPhone string
		var bLat, bLng, sLat, sLng, dCharge sql.NullFloat64
		if buyerDB != nil {
			buyerDB.QueryRow(`
				SELECT COALESCE(username, ''), COALESCE(phone, ''), latitude, longitude, seller_latitude, seller_longitude, delivery_charge
				FROM orders WHERE id = $1`, delivery.OrderID).Scan(&buyerUsername, &buyerPhone, &bLat, &bLng, &sLat, &sLng, &dCharge)
		}
		
		delivery.BuyerName = buyerUsername
		if delivery.BuyerName == "" {
			delivery.BuyerName = "Buyer (Unknown)"
		}
		delivery.BuyerMobile = buyerPhone
		if bLat.Valid {
			delivery.BuyerLat = bLat.Float64
		}
		if bLng.Valid {
			delivery.BuyerLng = bLng.Float64
		}
		if sLat.Valid {
			delivery.SellerLat = sLat.Float64
		}
		if sLng.Valid {
			delivery.SellerLng = sLng.Float64
		}
		if dCharge.Valid {
			delivery.DeliveryCharge = dCharge.Float64
		}

		// Fetch seller details
		sellerName, sellerMobile, _, _ := getPickupAddressForOrderRelaxed(delivery.OrderID)
		delivery.SellerName = sellerName
		delivery.SellerMobile = sellerMobile

		deliveries = append(deliveries, delivery)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating rows: %v", err)
		http.Error(w, "Error reading database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(deliveries)
}
