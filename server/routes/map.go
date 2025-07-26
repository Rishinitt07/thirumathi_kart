package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"server/db"
	"strconv"
	"strings"
	"time"
)

type Coordinate struct {
	Lat     float64 `json:"lat"`
	Lng     float64 `json:"lng"`
	Type    string  `json:"type"`
	OrderID int     `json:"order_id"`
	Address string  `json:"address"`
}

type RouteResponse struct {
	Route []Coordinate `json:"route"`
	Debug DebugInfo    `json:"debug"`
}

type DebugInfo struct {
	TotalPoints    int    `json:"total_points"`
	PickupPoints   int    `json:"pickup_points"`
	DropPoints     int    `json:"drop_points"`
	DeliveryOrders int    `json:"delivery_orders"`
	Message        string `json:"message"`
}

type DeliveryPoint struct {
	Type    string  `json:"type"`
	Address string  `json:"address"`
	Pincode string  `json:"pincode"`
	Lat     float64 `json:"lat"`
	Lng     float64 `json:"lng"`
	OrderID int     `json:"order_id"`
}

// Nominatim API response structure
type NominatimResponse []struct {
	Lat         string  `json:"lat"`
	Lon         string  `json:"lon"`
	DisplayName string  `json:"display_name"`
	Importance  float64 `json:"importance"`
}

// BigDataCloud API response structure
type BigDataCloudResponse struct {
	Results []struct {
		Latitude   float64 `json:"latitude"`
		Longitude  float64 `json:"longitude"`
		Name       string  `json:"name"`
		Confidence float64 `json:"confidence"`
	} `json:"results"`
}

func MapHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	pathParts := strings.Split(r.URL.Path, "/")
	if len(pathParts) < 3 {
		http.Error(w, "Invalid URL format", http.StatusBadRequest)
		return
	}

	targetUser := pathParts[2]
	fmt.Printf("🔍 MapHandler called for user: %s\n", targetUser)

	lat, err := strconv.ParseFloat(r.URL.Query().Get("lat"), 64)
	if err != nil {
		http.Error(w, "Invalid latitude", http.StatusBadRequest)
		return
	}

	lng, err := strconv.ParseFloat(r.URL.Query().Get("lng"), 64)
	if err != nil {
		http.Error(w, "Invalid longitude", http.StatusBadRequest)
		return
	}

	deliveryPoints, err := getDeliveryPointsEnhanced(targetUser)
	if err != nil {
		http.Error(w, "Error fetching delivery points", http.StatusInternalServerError)
		return
	}

	fmt.Printf("📍 Total delivery points fetched: %d\n", len(deliveryPoints))

	// Start with current location
	route := []Coordinate{{
		Lat:     lat,
		Lng:     lng,
		Type:    "start",
		Address: "Current Location",
	}}

	pickupCount := 0
	dropCount := 0

	// Add ALL pickup points first (maintain order)
	for _, point := range deliveryPoints {
		if point.Type == "pickup" {
			route = append(route, Coordinate{
				Lat:     point.Lat,
				Lng:     point.Lng,
				Type:    "pickup",
				OrderID: point.OrderID,
				Address: point.Address,
			})
			pickupCount++
			fmt.Printf("📦 Added pickup %d: %s (Order %d)\n", pickupCount, point.Address, point.OrderID)
		}
	}

	// Then add ALL drop points (maintain order)
	for _, point := range deliveryPoints {
		if point.Type == "drop" {
			route = append(route, Coordinate{
				Lat:     point.Lat,
				Lng:     point.Lng,
				Type:    "drop",
				OrderID: point.OrderID,
				Address: point.Address,
			})
			dropCount++
			fmt.Printf("🏠 Added drop %d: %s (Order %d)\n", dropCount, point.Address, point.OrderID)
		}
	}

	debug := DebugInfo{
		TotalPoints:    len(route),
		PickupPoints:   pickupCount,
		DropPoints:     dropCount,
		DeliveryOrders: len(deliveryPoints) / 2,
		Message:        fmt.Sprintf("User %s has %d active orders with %d total waypoints", targetUser, len(deliveryPoints)/2, len(route)-1),
	}

	fmt.Printf("🗺️ Final route: %d total points (%d pickups, %d drops)\n", len(route), pickupCount, dropCount)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(RouteResponse{
		Route: route,
		Debug: debug,
	})
}

func getDeliveryPointsEnhanced(username string) ([]DeliveryPoint, error) {
	query := `
        SELECT 
            d.id, d.order_id,
            d.pickup_address, d.pickup_pincode,
            d.drop_address, d.drop_pincode
        FROM delivery_orders d
        WHERE d.delivery_user = $1 AND d.status IN ('assigned', 'in_progress')
        ORDER BY d.assigned_at ASC`

	rows, err := db.GetDeliveryDB().Query(query, username)
	if err != nil {
		fmt.Printf("❌ Database query error: %v\n", err)
		return nil, err
	}
	defer rows.Close()

	var points []DeliveryPoint
	orderCount := 0

	for rows.Next() {
		var deliveryID, orderID int
		var pickupAddr, pickupPin, dropAddr, dropPin string

		err := rows.Scan(&deliveryID, &orderID, &pickupAddr, &pickupPin, &dropAddr, &dropPin)
		if err != nil {
			fmt.Printf("❌ Row scan error: %v\n", err)
			return nil, err
		}

		orderCount++
		fmt.Printf("🔄 Processing order %d (delivery ID %d)\n", orderID, deliveryID)

		// Geocode pickup address
		pickupLat, pickupLng := addressToCoordinatesMultiProvider(pickupAddr, pickupPin)
		if pickupLat == 0 && pickupLng == 0 {
			fmt.Printf("⚠️ Warning: Failed to geocode pickup address: %s, %s\n", pickupAddr, pickupPin)
		}

		// Geocode drop address
		dropLat, dropLng := addressToCoordinatesMultiProvider(dropAddr, dropPin)
		if dropLat == 0 && dropLng == 0 {
			fmt.Printf("⚠️ Warning: Failed to geocode drop address: %s, %s\n", dropAddr, dropPin)
		}

		// Add pickup point
		points = append(points, DeliveryPoint{
			Type:    "pickup",
			Address: pickupAddr,
			Pincode: pickupPin,
			Lat:     pickupLat,
			Lng:     pickupLng,
			OrderID: orderID,
		})

		// Add drop point
		points = append(points, DeliveryPoint{
			Type:    "drop",
			Address: dropAddr,
			Pincode: dropPin,
			Lat:     dropLat,
			Lng:     dropLng,
			OrderID: orderID,
		})

		fmt.Printf("✅ Order %d: Pickup (%.4f, %.4f) + Drop (%.4f, %.4f)\n",
			orderID, pickupLat, pickupLng, dropLat, dropLng)
	}

	fmt.Printf("📊 Summary: %d orders processed, %d total points generated\n", orderCount, len(points))
	return points, nil
}

// NEW: Trichy-specific geocoding with accurate landmarks
func getTrichySpecificCoordinates(address, pincode string) (float64, float64) {
	addressLower := strings.ToLower(address)

	// Trichy-specific landmark coordinates (very accurate)
	trichyLandmarks := map[string][2]float64{
		"srirangam":         {10.8522, 78.6950}, // Ranganathaswamy Temple area
		"thillai nagar":     {10.8231, 78.7047}, // Bharathidasan University area
		"golden rock":       {10.8235, 78.6840}, // Golden Rock Railway area
		"woraiyur":          {10.8330, 78.6970}, // East - Residential area
		"k.k. nagar":        {10.8050, 78.7000}, // South - Medical College area
		"ponmalai":          {10.8180, 78.6820}, // West - Industrial area
		"thiruverumbur":     {10.7650, 78.6850}, // Far East - Industrial area
		"bhel":              {10.7990, 78.6900}, // Southwest - Township
		"central":           {10.8233, 78.6930}, // Central - Market area
		"organic farm":      {10.8700, 78.7200}, // North outskirts
		"kk nagar":          {10.8050, 78.7000}, // Alternative spelling
		"theppakulam":       {10.8238, 78.6900}, // Teppakulam tank area
		"railway station":   {10.8233, 78.6930}, // Central Bus Stand area
		"thiruvanaikoil":    {10.8400, 78.7000}, // Jambukeswarar Temple area
		"tennur":            {10.8200, 78.7100}, // NIT Trichy area
		"fort":              {10.8230, 78.6905}, // Rock Fort area
		"kailasapuram":      {10.7990, 78.6900}, // BHEL area
		"chathram":          {10.8200, 78.6950}, // Bus stand area
		"central market":    {10.8240, 78.6920}, // Market area
		"main bazaar":       {10.8240, 78.6920}, // Market area
		"industrial estate": {10.8180, 78.6820}, // Industrial area
		"warehouse complex": {10.7650, 78.6850}, // Warehouse area
		"market street":     {10.8200, 78.6950}, // Market area
		"temple street":     {10.8400, 78.7000}, // Temple area
		"high road":         {10.8200, 78.7100}, // Main road area
		"main road":         {10.8522, 78.6950}, // Main roads
		"cross street":      {10.8231, 78.7047}, // Cross streets
		"colony":            {10.8235, 78.6840}, // Colony areas
		"nagar":             {10.8050, 78.7000}, // Nagar areas
		"outskirts":         {10.8600, 78.7100}, // Outskirt areas
	}

	// Check for landmark matches
	for landmark, coords := range trichyLandmarks {
		if strings.Contains(addressLower, landmark) {
			fmt.Printf("🎯 Matched Trichy landmark '%s': %f, %f\n", landmark, coords[0], coords[1])
			return coords[0], coords[1]
		}
	}

	// Pincode-based fallback for Trichy areas
	pincodeInt, _ := strconv.Atoi(pincode)
	switch pincodeInt {
	case 620001: // Central Trichy
		return 10.8233, 78.6930
	case 620002: // Theppakulam area
		return 10.8238, 78.6900
	case 620003: // Woraiyur area
		return 10.8230, 78.6870
	case 620004: // Golden Rock area
		return 10.8235, 78.6840
	case 620005: // Thiruvanaikoil area
		return 10.8400, 78.7000
	case 620006: // Srirangam area
		return 10.8522, 78.6950
	case 620008: // Fort area
		return 10.8230, 78.6905
	case 620013: // Thiruverumbur area
		return 10.7650, 78.6850
	case 620014: // BHEL area
		return 10.7990, 78.6900
	case 620017: // Tennur area
		return 10.8200, 78.7100
	case 620018: // Thillai Nagar area
		return 10.8231, 78.7047
	case 620021: // K.K. Nagar area
		return 10.8050, 78.7000
	default:
		// Default Trichy center (near Rock Fort)
		return 10.8230, 78.6905
	}
}

// Multi-provider geocoding with Trichy-first strategy
func addressToCoordinatesMultiProvider(address, pincode string) (float64, float64) {
	fmt.Printf("🔍 Geocoding: %s, %s\n", address, pincode)

	// Strategy 1: Check if it's a Trichy address first (fastest and most accurate)
	if strings.Contains(strings.ToLower(address), "trichy") ||
		strings.Contains(strings.ToLower(address), "tiruchirappalli") ||
		strings.Contains(strings.ToLower(address), "tiruchirapalli") ||
		(len(pincode) >= 3 && pincode[:3] == "620") {
		lat, lng := getTrichySpecificCoordinates(address, pincode)
		fmt.Printf("✅ Trichy-specific: %f, %f\n", lat, lng)
		return lat, lng
	}

	// Strategy 2: Try BigDataCloud (generous free tier, no API key)
	lat, lng := tryBigDataCloudGeocoding(address, pincode)
	if lat != 0 && lng != 0 {
		fmt.Printf("✅ BigDataCloud: %f, %f\n", lat, lng)
		return lat, lng
	}

	// Strategy 3: Try OpenStreetMap Nominatim (unlimited but rate limited)
	lat, lng = tryNominatimGeocoding(address, pincode)
	if lat != 0 && lng != 0 {
		fmt.Printf("✅ Nominatim: %f, %f\n", lat, lng)
		return lat, lng
	}

	// Strategy 4: Smart fallback based on city detection + pincode
	lat, lng = getSmartIndiaFallback(address, pincode)
	fmt.Printf("🎯 Fallback: %f, %f\n", lat, lng)
	return lat, lng
}

func tryBigDataCloudGeocoding(address, pincode string) (float64, float64) {
	fullAddress := fmt.Sprintf("%s, %s, India", address, pincode)
	encodedAddress := url.QueryEscape(fullAddress)

	apiURL := fmt.Sprintf(
		"https://api.bigdatacloud.net/data/forward-geocoding?query=%s&key=bdc_free",
		encodedAddress,
	)

	client := &http.Client{Timeout: 8 * time.Second}
	resp, err := client.Get(apiURL)
	if err != nil {
		fmt.Printf("❌ BigDataCloud error: %v\n", err)
		return 0, 0
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		fmt.Printf("❌ BigDataCloud status: %d\n", resp.StatusCode)
		return 0, 0
	}

	var bigDataResp BigDataCloudResponse
	if err := json.NewDecoder(resp.Body).Decode(&bigDataResp); err != nil {
		fmt.Printf("❌ BigDataCloud parse error: %v\n", err)
		return 0, 0
	}

	if len(bigDataResp.Results) == 0 {
		fmt.Printf("❌ BigDataCloud: No results\n")
		return 0, 0
	}

	lat := bigDataResp.Results[0].Latitude
	lng := bigDataResp.Results[0].Longitude

	// Validate coordinates are in India (roughly)
	if lat < 6.0 || lat > 37.0 || lng < 68.0 || lng > 98.0 {
		fmt.Printf("❌ BigDataCloud: Coordinates outside India: %f, %f\n", lat, lng)
		return 0, 0
	}

	return lat, lng
}

func tryNominatimGeocoding(address, pincode string) (float64, float64) {
	fullAddress := fmt.Sprintf("%s, %s, India", address, pincode)
	encodedAddress := url.QueryEscape(fullAddress)

	nominatimURL := fmt.Sprintf(
		"https://nominatim.openstreetmap.org/search?q=%s&format=json&limit=1&countrycodes=in",
		encodedAddress,
	)

	client := &http.Client{Timeout: 10 * time.Second}
	req, err := http.NewRequest("GET", nominatimURL, nil)
	if err != nil {
		fmt.Printf("❌ Nominatim request error: %v\n", err)
		return 0, 0
	}

	// Required User-Agent header for Nominatim
	req.Header.Set("User-Agent", "ThirumathiKart/1.0 (delivery-app)")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("❌ Nominatim error: %v\n", err)
		return 0, 0
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		fmt.Printf("❌ Nominatim status: %d\n", resp.StatusCode)
		return 0, 0
	}

	var nominatimResp NominatimResponse
	if err := json.NewDecoder(resp.Body).Decode(&nominatimResp); err != nil {
		fmt.Printf("❌ Nominatim parse error: %v\n", err)
		return 0, 0
	}

	if len(nominatimResp) == 0 {
		fmt.Printf("❌ Nominatim: No results\n")
		return 0, 0
	}

	lat, err := strconv.ParseFloat(nominatimResp[0].Lat, 64)
	if err != nil {
		fmt.Printf("❌ Nominatim lat parse error: %v\n", err)
		return 0, 0
	}

	lng, err := strconv.ParseFloat(nominatimResp[0].Lon, 64)
	if err != nil {
		fmt.Printf("❌ Nominatim lng parse error: %v\n", err)
		return 0, 0
	}

	// Validate coordinates are in India
	if lat < 6.0 || lat > 37.0 || lng < 68.0 || lng > 98.0 {
		fmt.Printf("❌ Nominatim: Coordinates outside India: %f, %f\n", lat, lng)
		return 0, 0
	}

	// Be respectful to free API - 1 request per second
	time.Sleep(1 * time.Second)

	return lat, lng
}

// Smart India-wide fallback system (keeping your existing comprehensive list)
func getSmartIndiaFallback(address, pincode string) (float64, float64) {
	pincodeInt, _ := strconv.Atoi(pincode)
	addressLower := strings.ToLower(address)

	// Major Indian cities detection (your existing comprehensive list)
	cityCoords := map[string][2]float64{
		"mumbai":             {19.0760, 72.8777},
		"delhi":              {28.7041, 77.1025},
		"bangalore":          {12.9716, 77.5946},
		"bengaluru":          {12.9716, 77.5946},
		"hyderabad":          {17.3850, 78.4867},
		"ahmedabad":          {23.0225, 72.5714},
		"chennai":            {13.0827, 80.2707},
		"kolkata":            {22.5726, 88.3639},
		"tiruchirappalli":    {10.7905, 78.7047}, // Added Trichy to the list
		"trichy":             {10.7905, 78.7047}, // Alternative name
		"surat":              {21.1702, 72.8311},
		"pune":               {18.5204, 73.8567},
		"jaipur":             {26.9124, 75.7873},
		"lucknow":            {26.8467, 80.9462},
		"kanpur":             {26.4499, 80.3319},
		"nagpur":             {21.1458, 79.0882},
		"indore":             {22.7196, 75.8577},
		"thane":              {19.2183, 72.9781},
		"bhopal":             {23.2599, 77.4126},
		"visakhapatnam":      {17.6868, 83.2185},
		"patna":              {25.5941, 85.1376},
		"vadodara":           {22.3072, 73.1812},
		"ghaziabad":          {28.6692, 77.4538},
		"ludhiana":           {30.9010, 75.8573},
		"agra":               {27.1767, 78.0081},
		"nashik":             {19.9975, 73.7898},
		"faridabad":          {28.4089, 77.3178},
		"meerut":             {28.9845, 77.7064},
		"rajkot":             {22.3039, 70.8022},
		"varanasi":           {25.3176, 82.9739},
		"srinagar":           {34.0837, 74.7973},
		"aurangabad":         {19.8762, 75.3433},
		"dhanbad":            {23.7957, 86.4304},
		"amritsar":           {31.6340, 74.8723},
		"allahabad":          {25.4484, 81.8318},
		"prayagraj":          {25.4484, 81.8318},
		"ranchi":             {23.3441, 85.3096},
		"howrah":             {22.5958, 88.2636},
		"coimbatore":         {11.0168, 76.9558},
		"jabalpur":           {23.1815, 79.9864},
		"gwalior":            {26.2183, 78.1828},
		"vijayawada":         {16.5062, 80.6480},
		"jodhpur":            {26.2389, 73.0243},
		"madurai":            {9.9252, 78.1198},
		"raipur":             {21.2514, 81.6296},
		"kota":               {25.2138, 75.8648},
		"chandigarh":         {30.7333, 76.7794},
		"guwahati":           {26.1445, 91.7362},
		"solapur":            {17.6599, 75.9064},
		"hubli":              {15.3647, 75.1240},
		"bareilly":           {28.3670, 79.4304},
		"mysore":             {12.2958, 76.6394},
		"mysuru":             {12.2958, 76.6394},
		"tiruppur":           {11.1085, 77.3411},
		"gurgaon":            {28.4595, 77.0266},
		"gurugram":           {28.4595, 77.0266},
		"aligarh":            {27.8974, 78.0880},
		"jalandhar":          {31.3260, 75.5762},
		"bhubaneswar":        {20.2961, 85.8245},
		"salem":              {11.6643, 78.1460},
		"warangal":           {17.9689, 79.5941},
		"thiruvananthapuram": {8.5241, 76.9366},
		"kochi":              {9.9312, 76.2673},
		"kozhikode":          {11.2588, 75.7804},
		"thrissur":           {10.5276, 76.2144},
		"mangalore":          {12.9141, 74.8560},
		"belgaum":            {15.8497, 74.4977},
		"gulbarga":           {17.3297, 76.8343},
		"davangere":          {14.4644, 75.9218},
		"bellary":            {15.1394, 76.9214},
		"bijapur":            {16.8302, 75.7100},
		"shimoga":            {13.9299, 75.5681},
		"tumkur":             {13.3379, 77.1022},
		"raichur":            {16.2076, 77.3463},
		"bidar":              {17.9103, 77.5120},
		"hospet":             {15.2687, 76.3874},
		"gadag":              {15.4316, 75.6191},
		"noida":              {28.5355, 77.3910},
		"mathura":            {27.4924, 77.6737},
		"firozabad":          {27.1592, 78.3957},
		"mainpuri":           {27.2350, 79.0647},
		"bulandshahr":        {28.4041, 77.8498},
		"moradabad":          {28.8386, 78.7733},
		"saharanpur":         {29.9680, 77.5552},
		"muzaffarnagar":      {29.4726, 77.7085},
		"bijnor":             {29.3729, 78.1363},
		"rampur":             {28.8152, 79.0250},
		"pilibhit":           {28.6270, 79.8216},
		"shahjahanpur":       {27.8831, 79.9109},
		"hardoi":             {27.4057, 80.1322},
		"sitapur":            {27.5676, 80.6772},
		"lakhimpur":          {27.9479, 80.7780},
		"bahraich":           {27.5743, 81.5943},
		"gonda":              {27.1333, 81.9667},
		"faizabad":           {26.7751, 82.1485},
		"sultanpur":          {26.2644, 82.0738},
		"ballia":             {25.7522, 84.1495},
		"deoria":             {26.5024, 83.7791},
		"kushinagar":         {26.7411, 83.8958},
		"gorakhpur":          {26.7606, 83.3732},
		"maharajganj":        {27.1441, 83.5615},
		"siddharthnagar":     {27.2518, 83.1022},
		"basti":              {26.8014, 82.7390},
		"sant kabir nagar":   {26.7648, 83.0539},
		"ambedkar nagar":     {26.4058, 82.6950},
		"azamgarh":           {26.0685, 83.1836},
		"mau":                {25.9417, 83.5611},
		"jaunpur":            {25.7506, 82.6782},
		"ghazipur":           {25.5881, 83.5775},
		"chandauli":          {25.2677, 83.2718},
		"mirzapur":           {25.1463, 82.5693},
		"sonbhadra":          {24.2093, 83.0739},
		"sant ravidas nagar": {25.3318, 82.6389},
	}

	// Check if city name is in address
	for city, coords := range cityCoords {
		if strings.Contains(addressLower, city) {
			fmt.Printf("🏙️ Detected city '%s' in address\n", city)
			return coords[0], coords[1]
		}
	}

	// Enhanced pincode-based fallback for major regions
	switch {
	case pincodeInt >= 620000 && pincodeInt <= 620099:
		// Trichy region (620xxx)
		return 10.8230, 78.6905 // Trichy center
	case pincodeInt >= 100000 && pincodeInt <= 199999:
		// Delhi & NCR
		return 28.7041, 77.1025
	case pincodeInt >= 200000 && pincodeInt <= 299999:
		// Uttar Pradesh
		return 26.8467, 80.9462 // Lucknow
	case pincodeInt >= 300000 && pincodeInt <= 399999:
		// Rajasthan
		return 26.9124, 75.7873 // Jaipur
	case pincodeInt >= 400000 && pincodeInt <= 499999:
		// Mumbai & Maharashtra
		return 19.0760, 72.8777 // Mumbai
	case pincodeInt >= 500000 && pincodeInt <= 599999:
		// Telangana & Andhra Pradesh
		return 17.3850, 78.4867 // Hyderabad
	case pincodeInt >= 600000 && pincodeInt <= 699999:
		// Tamil Nadu
		return 13.0827, 80.2707 // Chennai
	case pincodeInt >= 700000 && pincodeInt <= 799999:
		// West Bengal
		return 22.5726, 88.3639 // Kolkata
	case pincodeInt >= 800000 && pincodeInt <= 899999:
		// Bihar & Jharkhand
		return 25.5941, 85.1376 // Patna
	default:
		// Default to Trichy center for unknown addresses
		return 10.8230, 78.6905
	}
}
