import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Suppliers from '../pages/Suppliers';
import Products from '../pages/Products';
import Customers from '../pages/Customers';
import Sales from '../pages/Sales';
import Expenses from '../pages/Expenses';
import AIAssistant from '../pages/AIAssistant';
import OwnerSubscriptionPlans from '../pages/OwnerSubscriptionPlans';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageBusinesses from '../pages/admin/ManageBusinesses';
import AIUsageLogs from '../pages/admin/AIUsageLogs';
import SubscriptionPlans from '../pages/admin/SubscriptionPlans';
import './App.css';

// Auth guard — checks for JWT token
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Admin-only guard — checks token AND role
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();
  if (!token) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Business Owner Routes */}
          <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/suppliers"    element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
          <Route path="/products"     element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/customers"    element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/sales"        element={<ProtectedRoute><Sales /></ProtectedRoute>} />
          <Route path="/expenses"     element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/ai-assistant"        element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/subscription-plans"  element={<ProtectedRoute><OwnerSubscriptionPlans /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard"  element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/businesses" element={<AdminRoute><ManageBusinesses /></AdminRoute>} />
          <Route path="/admin/ai-logs"    element={<AdminRoute><AIUsageLogs /></AdminRoute>} />
          <Route path="/admin/plans"      element={<AdminRoute><SubscriptionPlans /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
