# Thirumathi Kart - Delivery Partner Dashboard

A complete delivery partner management system for Thirumathi Kart, built with Go backend and React frontend.

## 🚀 Features

- **Delivery Partner Authentication**: Secure login/registration with JWT tokens
- **Dashboard**: View assigned deliveries with status tracking
- **Available Orders**: Browse and take available delivery orders
- **Route Optimization**: Interactive map with optimized delivery routes using Dijkstra's algorithm
- **Real-time Status Updates**: Update delivery status as you progress
- **Mobile-Responsive Design**: Works seamlessly on all devices

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

### System Requirements
- **Go** 1.21 or higher
- **Node.js** 18.0 or higher
- **npm** or **yarn**
- **PostgreSQL** 12 or higher

### Database Setup
You need to create three PostgreSQL databases:
1. `deliverydb` - Main delivery database (managed by this application)
2. `buyerdb` - Buyer database (read-only access)
3. `sellerdb` - Seller database (read-only access)

```sql
-- Create databases
CREATE DATABASE deliverydb;
CREATE DATABASE buyerdb;
CREATE DATABASE sellerdb;

-- Create a user (optional, or use existing postgres user)
CREATE USER tkart_user WITH PASSWORD 'tkart@123';
GRANT ALL PRIVILEGES ON DATABASE deliverydb TO tkart_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO tkart_user;
```

### Required Database Tables

**buyerdb.orders** (should already exist):
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    address TEXT NOT NULL,
    pincode TEXT NOT NULL,
    -- other buyer order fields
);
```

**sellerdb.users** (should already exist):
```sql
CREATE TABLE users (
    username TEXT PRIMARY KEY,
    address TEXT NOT NULL,
    district TEXT,
    state TEXT,
    country TEXT,
    pincode TEXT NOT NULL,
    -- other seller fields
);
```

*Note: The deliverydb tables will be automatically created by the application.*

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd thirumathi_delivery
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install Go dependencies:
```bash
go mod download
```

Ensure your PostgreSQL databases are running and accessible with the credentials:
- **Username**: postgres
- **Password**: tkart@123
- **Host**: localhost
- **Port**: 5432

Start the backend server:
```bash
go run main.go
```

The backend will start on `http://localhost:8082`

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5174`

## 🎯 Usage

### For Delivery Partners

1. **Registration**: Create a new delivery partner account
2. **Login**: Sign in with your credentials
3. **Dashboard**: View your assigned deliveries and track progress
4. **Available Orders**: Browse available orders and take up to 3 at a time
5. **Route Map**: View optimized delivery routes on an interactive map
6. **Status Updates**: Update delivery status as you complete pickups and deliveries

### API Endpoints

#### Authentication
- `POST /register` - Register new delivery partner
- `POST /login` - Login with username/password

#### Delivery Management
- `GET /dashboard` - Get assigned deliveries for logged-in user
- `GET /available` - Get available orders for pickup
- `POST /available/take` - Take an available order
- `PATCH /delivery/:id/status` - Update delivery status

#### Route Planning
- `GET /map/:user?lat=<lat>&lng=<lng>` - Get optimized route for user

## 🏗️ Project Structure

```
thirumathi_delivery/
├── backend/
│   ├── main.go                 # Main server file
│   ├── go.mod                  # Go module dependencies
│   ├── db/
│   │   ├── deliverydb.go       # Delivery database connection
│   │   ├── buyerdb.go          # Buyer database connection
│   │   └── sellerdb.go         # Seller database connection
│   └── routes/
│       ├── auth.go             # Authentication handlers
│       ├── dashboard.go        # Dashboard handlers
│       ├── available.go        # Available orders handlers
│       ├── status.go           # Status update handlers
│       └── map.go              # Route mapping handlers
├── frontend/
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Main React component
│   ├── login.jsx               # Login component
│   ├── register.jsx            # Registration component
│   ├── dashboard.jsx           # Dashboard component
│   ├── available.jsx           # Available orders component
│   ├── map.jsx                 # Map component
│   └── styles.css              # Custom styles
├── map/
│   └── dijkstra.js             # Route optimization algorithms
└── README.md                   # This file
```

## 🔧 Configuration

### Environment Variables

You can customize the database connection by modifying the connection strings in `backend/main.go`:

```go
// Default connection strings
deliveryDB: "user=postgres password=tkart@123 dbname=deliverydb sslmode=disable"
buyerDB:    "user=postgres password=tkart@123 dbname=buyerdb sslmode=disable"
sellerDB:   "user=postgres password=tkart@123 dbname=sellerdb sslmode=disable"
```

### Port Configuration

- Backend: Port 8082 (configurable in `main.go`)
- Frontend: Port 5174 (configurable in `vite.config.js`)

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check database credentials
   - Verify database names exist

2. **CORS Errors**
   - Ensure frontend is running on port 5174
   - Check CORS configuration in backend

3. **JWT Token Issues**
   - Clear browser localStorage
   - Re-login to get new token

4. **Map Not Loading**
   - Check internet connection for map tiles
   - Ensure Leaflet.js is loaded properly

5. **Geolocation Not Working**
   - Enable location access in browser
   - Use HTTPS for production (required for geolocation)

### Build Issues

**Go Build Errors:**
```bash
# Clean module cache
go clean -modcache
go mod download
```

**Node.js Build Errors:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Deployment

### Backend Deployment
1. Build the Go binary:
```bash
go build -o delivery-server main.go
```

2. Set up environment variables for production database
3. Use a process manager like systemd or PM2
4. Configure reverse proxy (nginx/Apache)

### Frontend Deployment
1. Build the React app:
```bash
npm run build
```

2. Serve the `dist` directory with a web server
3. Configure HTTPS for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code documentation
3. Create an issue on GitHub

---

**Note**: This is a microservice that integrates with existing Buyer and Seller modules. Ensure those systems are properly configured and running for full functionality.
