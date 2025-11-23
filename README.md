# Smart Estate Management System

A production-ready Property Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **Dashboard**: Real-time KPI cards (Revenue, Occupancy, Maintenance) and Activity Feed.
- **Property Management**: Manage Properties, Units, Tenants, and Leases.
- **Financials**: Track Payments, Generate PDF Receipts, and View Revenue Charts.
- **Maintenance**: Submit and track maintenance requests.
- **User Management**: Role-based access control (Admin, Manager, Tenant).
- **Security**: JWT Authentication, Password Hashing, and Protected Routes.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Recharts, Axios.
- **Backend**: Node.js, Express, MongoDB (Mongoose), PDFKit.
- **DevOps**: Docker, Docker Compose.

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Docker (Optional)

### Local Setup

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd AAyatiin
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    # Create .env file (see .env.example)
    npm run seed # Populate database with sample data
    npm start
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Docker Setup

Run the entire stack with one command:

```bash
docker-compose up --build
```

The backend will be available at `http://localhost:5000` and the database at `mongodb://localhost:27017`.

## API Documentation

The API documentation is available at `/api/docs` (Swagger UI) once the server is running.

### Key Endpoints

- `POST /api/auth/login` - User login
- `GET /api/properties` - List properties
- `POST /api/payments` - Record payment
- `GET /api/dashboard/stats` - Dashboard statistics

## Deployment

### Backend (Render/Heroku)
1.  Connect repository to Render/Heroku.
2.  Set environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV`).
3.  Build command: `npm install`
4.  Start command: `npm start`

### Frontend (Netlify/Vercel)
1.  Connect repository.
2.  Set build command: `npm run build`.
3.  Set publish directory: `dist`.

## License

MIT
