package routes

import (
	"encoding/json"
	"net/http"
	"server/db"
	"strconv"
	"strings"
)

type UpdateStatusRequest struct {
	Status string `json:"status"`
}

func UpdateStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	username := GetUsernameFromContext(r.Context())
	if username == "" {
		http.Error(w, "Username not found in context", http.StatusUnauthorized)
		return
	}

	// Extract delivery ID from URL path
	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 4 || pathParts[3] != "status" {
		http.Error(w, "Invalid URL format", http.StatusBadRequest)
		return
	}

	deliveryID, err := strconv.Atoi(pathParts[2])
	if err != nil {
		http.Error(w, "Invalid delivery ID", http.StatusBadRequest)
		return
	}

	var req UpdateStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Validate status
	validStatuses := map[string]bool{
		"assigned":    true,
		"in_progress": true,
		"completed":   true,
	}

	if !validStatuses[req.Status] {
		http.Error(w, "Invalid status", http.StatusBadRequest)
		return
	}

	// Update delivery status
	query := `
		UPDATE delivery_orders 
		SET status = $1, updated_at = NOW()
		WHERE id = $2 AND delivery_user = $3`

	result, err := db.GetDeliveryDB().Exec(query, req.Status, deliveryID, username)
	if err != nil {
		http.Error(w, "Error updating status", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		http.Error(w, "Error checking update result", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Delivery not found or not authorized", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Status updated successfully"})
}
