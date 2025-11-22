# Property Management System - Backend

## Description
Backend API for AAYATIIN PROPERTY LTD SMART CHOICE. Built with Node.js, Express, and MongoDB.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   - Create a `.env` file in the `backend` root directory.
   - Copy the contents from `.env.example` (see Step 2).

## Running the Server

### Development Mode
Runs the server with `nodemon` for auto-reloading.
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Documentation
API endpoints are structured as follows:
- `/api/auth` - Authentication
- `/api/properties` - Property Management
- `/api/units` - Unit Management
- `/api/tenants` - Tenant Management
- `/api/leases` - Lease Management
- `/api/payments` - Payment & Accounting
- `/api/maintenance` - Maintenance Requests
- `/api/dashboard` - Dashboard Statistics
