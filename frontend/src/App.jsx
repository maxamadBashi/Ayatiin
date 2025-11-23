import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Land from './pages/Land';
import Tenants from './pages/Tenants';
import Leases from './pages/Leases';
import Payments from './pages/Payments';
import Maintenance from './pages/Maintenance';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import Requests from './pages/Requests';

import CustomerDashboard from './pages/CustomerDashboard';

import Home from './pages/Home';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard if role not allowed
    if (user.role === 'customer' || user.role === 'tenant') {
      return <Navigate to="/customer/dashboard" replace />;
    }

    const validAdminRoles = ['admin', 'manager', 'superadmin'];
    if (validAdminRoles.includes(user.role)) {
      // If we are already at /admin/dashboard, don't redirect there again (avoid loop if role is valid but somehow failing)
      // But here, if role is valid admin, they should be allowed unless specific route restriction.
      // If they are restricted from this specific route, go to dashboard.
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Invalid or unknown role (e.g. 'tenant') -> Redirect to login
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Only show Sidebar/Navbar for Admin Routes if desired, or conditionally render */}
      {user.role !== 'customer' && user.role !== 'tenant' && <Sidebar />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {user.role !== 'customer' && user.role !== 'tenant' && <Navbar />}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/properties" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Properties />
            </ProtectedRoute>
          } />

          <Route path="/land" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Land />
            </ProtectedRoute>
          } />

          <Route path="/tenants" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Tenants />
            </ProtectedRoute>
          } />

          <Route path="/leases" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Leases />
            </ProtectedRoute>
          } />

          <Route path="/payments" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Payments />
            </ProtectedRoute>
          } />

          <Route path="/maintenance" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Maintenance />
            </ProtectedRoute>
          } />
          <Route path="/requests" element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'superadmin']}>
              <Requests />
            </ProtectedRoute>
          } />

          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute allowedRoles={['customer', 'tenant']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
