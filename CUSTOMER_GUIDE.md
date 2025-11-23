# Customer Guide - Booking & Purchase Requests

## Qeybta Customer-ka (Customer Side)

### 1. **Home Page - Browse Properties**
- **Location**: `/` (Home page)
- **Features**:
  - Browse all available properties
  - See property details: name, location, price, bedrooms, bathrooms
  - View property images
  - Two action buttons on each property:
    - **"Book Now"** - For rental/booking requests
    - **"Buy Now"** - For purchase requests

### 2. **Submit Booking/Purchase Request**

**Steps to submit a request:**

1. **Browse Properties**
   - Go to home page
   - Find a property you like
   - Click either "Book Now" or "Buy Now"

2. **Fill Request Form**
   - If not logged in, you'll be redirected to login first
   - After login, the request form will open automatically
   - Fill in the required information:
     - **Visit Date** (required) - Select your preferred date to visit the property
     - **Amount** (required) - 
       - For booking: Enter monthly rent amount
       - For purchase: Enter your offer amount
     - **Message** (optional) - Any questions or special requirements

3. **Submit Request**
   - Click "Submit Request"
   - You'll see a success message
   - Request is sent to admin for review

### 3. **My Requests Page - Track Your Requests**

- **Location**: Click "My Requests" in navbar (when logged in)
- **Route**: `/customer/dashboard`

**What you can see:**

1. **Summary Cards** (at the top):
   - **Pending** (Yellow) - Requests waiting for admin review
   - **Approved** (Green) - Requests approved by admin
   - **Rejected** (Red) - Requests rejected by admin
   - **Completed** (Blue) - Completed requests

2. **Request Details Table**:
   - **Property** - Name and location
   - **Type** - Booking or Purchase
   - **Visit Date** - Your selected visit date
   - **Amount** - The amount you specified
   - **Request Date** - When you submitted the request
   - **Status** - Current status with color-coded badge
   - **Message** - Your optional message

### 4. **Request Statuses Explained**

- **Pending** ⏳ (Yellow)
  - Your request is waiting for admin review
  - Admin will review and respond soon

- **Approved** ✅ (Green)
  - Admin has approved your request!
  - You can proceed with the booking/purchase

- **Rejected** ❌ (Red)
  - Admin has rejected your request
  - You may want to submit a new request or contact admin

- **Completed** ✓ (Blue)
  - Your request has been completed
  - The booking/purchase process is finished

### 5. **Navigation**

**When Logged In:**
- **Left side of navbar**: "AAYATIIN" logo + "My Requests" button
- **Right side**: "Log Out" button

**When Not Logged In:**
- **Left side**: "AAYATIIN" logo
- **Right side**: "Register" and "Login" buttons

### 6. **How to Access Your Requests**

**Method 1: From Navbar**
- Click "My Requests" button in the navbar (left side, next to logo)

**Method 2: Direct URL**
- Navigate to: `http://localhost:3000/customer/dashboard`

**Method 3: After Submitting Request**
- You can go to "My Requests" to see your newly submitted request

## Complete Customer Flow

1. **Browse** → Home page, see all properties
2. **Select** → Click "Book Now" or "Buy Now" on a property
3. **Login** → If not logged in, login first
4. **Fill Form** → Enter visit date, amount, and optional message
5. **Submit** → Request sent to admin
6. **Track** → Go to "My Requests" to see status
7. **Wait** → Admin reviews and updates status
8. **Respond** → See updated status in "My Requests"

## Features for Customers

✅ Easy property browsing
✅ One-click booking/purchase request
✅ Detailed request form with visit date and amount
✅ Real-time status tracking
✅ Beautiful summary cards showing request counts
✅ Clear status indicators with icons
✅ Responsive design for mobile and desktop

## Tips

- Make sure to select a future date for your visit
- Enter a reasonable amount for better approval chances
- Add a message if you have special requirements
- Check "My Requests" regularly to see status updates
- You can submit multiple requests for different properties

