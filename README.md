# Thirumathi Kart

Thirumathi Kart is a comprehensive, end-to-end e-commerce platform designed with dedicated portals for Buyers, Sellers, and Delivery Personnel. It aims to provide a seamless shopping experience while empowering sellers to manage their business and enabling delivery personnel to efficiently route and track their deliveries.

## 🏗 Architecture & Tech Stack

The project is structured as a microservices-inspired backend with three distinct frontend applications.

### Backend (Server)
- **Language/Framework:** Go (Golang) using standard `net/http` and routing.
- **Database:** PostgreSQL (using `lib/pq`).
- **Authentication:** JWT (JSON Web Tokens) for secure, stateless user sessions.
- **Security:** `golang.org/x/crypto/bcrypt` for password hashing, `rs/cors` for CORS management.

### Frontend
All three frontends share a modern, high-performance tech stack:
- **Core:** React 19, Vite.
- **Styling:** Tailwind CSS (v4).
- **Animations:** Framer Motion.
- **HTTP Client:** Axios.

#### 1. Buyer Portal (`tkart_buyer`)
- Focuses on product discovery, cart management, and seamless checkout.
- **Key Libraries:** `react-router-dom`, `react-toastify`, Firebase.

#### 2. Seller Portal (`tkart_seller`)
- Focuses on product inventory management, order processing, and business analytics.
- **Key Libraries:** `Chart.js` & `react-chartjs-2` for analytics, `jspdf` & `html2canvas` for reporting, `react-circular-progressbar`.

#### 3. Delivery Portal (`tkart_delivery`)
- Focuses on real-time order tracking, route optimization, and delivery status updates.
- **Key Libraries:** `leaflet` & `leaflet-routing-machine` for interactive maps and routing.

---

## 🚀 Getting Started

### Prerequisites
- [Go](https://golang.org/doc/install) (1.23+)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/download/) (Make sure the database is running and accessible)

### Environment Variables
Before running the backend, ensure you have a `.env` file configured in the `/server` directory with your database connection strings, JWT secrets, and any other necessary configuration (e.g., Firebase credentials, SMTP settings).

---

### Running the Services

You will need to run the backend and the relevant frontend application simultaneously.

#### 1. Backend Server
The Go backend has separate entry points for the different portals. Open a terminal, navigate to the `server` directory, and run the respective service:

```bash
cd server
go mod download

# To run the Buyer backend API:
go run cmd/buyer/main.go

# To run the Seller backend API:
go run cmd/seller/main.go

# To run the Delivery backend API:
go run cmd/delivery/main.go
```
*(Note: Ensure you are running the backend service that corresponds to the frontend you are testing.)*

#### 2. Buyer Frontend
```bash
cd tkart_buyer
npm install
npm run dev
```

#### 3. Seller Frontend
```bash
cd tkart_seller
npm install
npm run dev
```

#### 4. Delivery Frontend
```bash
cd tkart_delivery
npm install
npm run dev
```

---

## 📁 Project Structure

```text
thirumathi_kart/
├── server/                 # Go backend code
│   ├── cmd/                # Entry points for buyer, seller, and delivery APIs
│   ├── db/                 # Database connection and queries
│   ├── routes/             # API route handlers
│   ├── .env                # Environment configuration
│   └── go.mod              # Go dependencies
├── tkart_buyer/            # React frontend for Buyers
│   └── src/                # Components, pages, and assets
├── tkart_seller/           # React frontend for Sellers
│   └── src/                # Dashboard, analytics, and product management
└── tkart_delivery/         # React frontend for Delivery Personnel
    └── src/                # Routing, maps, and active deliveries
```

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
