# System Startup Guide

## 🚀 Starting the System

### Backend (Port 5000)
```bash
cd backend
npm install  # First time only
npm start
# or
node src/server.js
```

### Frontend (Port 5173)
```bash
cd frontend
npm install  # First time only
npm run dev
```

## 📍 Default Route

When you start the system and visit **http://localhost:5173/**, you will see:

### ✅ Home Page (Default)
- **Route**: `/` (root)
- **Access**: Public (no login required)
- **Shows**:
  - Hero section with "Welcome to Aayatiin"
  - All available properties
  - Property prices and details
  - Buy and Book buttons (visible to everyone)
  - Navbar with Login/Register buttons

### 🔐 What Happens:

1. **Not Logged In**:
   - Home page shows all properties
   - Can see prices and details
   - Can click Buy/Book buttons
   - Clicking Buy/Book redirects to Login page
   - After login, returns to Home page

2. **Logged In as Customer**:
   - Home page shows all properties
   - Can see prices and details
   - Can click Buy/Book buttons
   - Clicking Buy/Book opens request modal
   - Can submit booking/purchase requests

3. **Logged In as Admin**:
   - Home page shows all properties
   - Can see prices and details
   - Can navigate to Admin Dashboard via navbar

## 🎯 Route Configuration

- `/` → **Home Page** (Default - Shows First)
- `/login` → Login Page
- `/register` → Register Page
- `/admin/dashboard` → Admin Dashboard (Protected)
- `/customer/dashboard` → Customer Dashboard (Protected)
- `/properties` → Admin Properties Management (Protected)
- `/requests` → Admin Requests Management (Protected)

## ✨ Features on Home Page

- ✅ Shows ALL properties (no filtering)
- ✅ Shows prices for all properties
- ✅ Shows all property details (bedrooms, bathrooms, location, etc.)
- ✅ Buy and Book buttons always visible
- ✅ Beautiful modern design
- ✅ Responsive layout
- ✅ Works for logged in and not logged in users

## 🔄 Navigation Flow

```
Start → http://localhost:5173/
  ↓
Home Page (Default)
  ↓
Browse Properties
  ↓
Click Buy/Book
  ↓
[If not logged in] → Login Page → Home Page (with modal)
[If logged in] → Request Modal → Submit Request
```

## 📝 Notes

- Home page is **always accessible** (public route)
- No authentication required to view properties
- Authentication only needed to submit requests
- After login/register, user returns to Home page
- Home page is the default landing page for everyone

