package db

// SellerWarehouse represents seller warehouse information
type SellerWarehouse struct {
	Username string `json:"username"`
	Address  string `json:"address"`
	District string `json:"district"`
	State    string `json:"state"`
	Country  string `json:"country"`
	Pincode  string `json:"pincode"`
}

// GetSellerWarehouse fetches warehouse details for a seller
func GetSellerWarehouse(sellerUsername string) (*SellerWarehouse, error) {
	query := `
		SELECT username, address, district, state, country, pincode
		FROM users
		WHERE username = $1`

	var warehouse SellerWarehouse
	err := sellerDB.QueryRow(query, sellerUsername).Scan(
		&warehouse.Username, &warehouse.Address, &warehouse.District,
		&warehouse.State, &warehouse.Country, &warehouse.Pincode)
	if err != nil {
		return nil, err
	}

	return &warehouse, nil
}

// GetWarehouseByOrderID fetches warehouse details for an order (assuming seller_username in buyerdb.orders)
func GetWarehouseByOrderID(orderID int) (*SellerWarehouse, error) {
	// First get seller_username from buyerdb.orders
	var sellerUsername string
	buyerQuery := `SELECT seller_username FROM orders WHERE id = $1`
	err := buyerDB.QueryRow(buyerQuery, orderID).Scan(&sellerUsername)
	if err != nil {
		return nil, err
	}

	return GetSellerWarehouse(sellerUsername)
}
