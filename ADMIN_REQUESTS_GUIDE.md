# Admin Requests Management Guide

## Where Customer Booking/Purchase Requests Appear

### 1. **Dashboard (Main Entry Point)**
- **Location**: Admin Dashboard (`/admin/dashboard`)
- **What you see**: 
  - A clickable "Pending Requests" card showing the count of pending booking/purchase requests
  - Click on the card to navigate directly to the Requests page
- **Visual**: Yellow card with message icon and arrow indicating it's clickable

### 2. **Sidebar Navigation**
- **Location**: Left sidebar in admin panel
- **Menu Item**: "Requests" (with MessageSquare icon)
- **Route**: `/requests`
- **Always visible**: Yes, in the main navigation menu

### 3. **Requests Page (Main Management Page)**
- **Location**: `/requests`
- **Features**:
  - **Summary Cards**: Shows counts for:
    - Pending (Yellow)
    - Approved (Blue)
    - Rejected (Red)
    - Completed (Green)
  
  - **Request Details Table** showing:
    - Customer name and email
    - Property name and location
    - Request type (booking/purchase)
    - Visit date
    - Amount (rent/purchase price)
    - Message (if provided)
    - Request date
    - Status
    - Actions (Approve/Reject buttons)

### 4. **How to Access Requests**

**Method 1: From Dashboard**
1. Login as admin
2. Go to Dashboard (`/admin/dashboard`)
3. Click on the "Pending Requests" card
4. You'll be taken to `/requests`

**Method 2: From Sidebar**
1. Login as admin
2. Look at the left sidebar
3. Click on "Requests" menu item
4. You'll be taken to `/requests`

**Method 3: Direct URL**
- Navigate to: `http://localhost:3000/requests`

## Request Flow

1. **Customer submits request**:
   - Customer browses properties on home page
   - Clicks "Book" or "Buy" on a property
   - Fills in:
     - Visit Date (required)
     - Amount (required)
     - Message (optional)
   - Submits request

2. **Request appears in admin panel**:
   - Status: `pending`
   - Visible in Dashboard as "Pending Requests" count
   - Visible in Requests page in the table

3. **Admin actions**:
   - **Approve**: Changes status to `approved`
   - **Reject**: Changes status to `rejected`
   - **Complete**: For approved requests, can mark as `completed`

## Request Statuses

- **Pending**: New request, waiting for admin review (Yellow badge)
- **Approved**: Admin approved the request (Blue badge)
- **Rejected**: Admin rejected the request (Red badge)
- **Completed**: Request has been completed (Green badge)

## Important Notes

- Only admins, managers, and superadmins can access the Requests page
- Customers can view their own requests in "My Requests" (Customer Dashboard)
- All requests are stored with full details: customer info, property info, visit date, amount, and message

