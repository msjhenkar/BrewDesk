import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { CartProvider }    from './context/CartContext'
import { AuthProvider }    from './context/AuthContext'
import ProtectedRoute      from './components/ProtectedRoute'

// Auth pages
import Login               from './pages/Login'
import Register            from './pages/Register'

// Customer flow pages
import CustomerMenu        from './pages/CustomerMenu'
import Cart                from './pages/Cart'
import Checkout            from './pages/Checkout'
import OrderSuccess        from './pages/OrderSuccess'

// Dashboards
import CustomerDashboard   from './pages/CustomerDashboard'
import AdminDashboard      from './pages/AdminDashboard'

// Admin (menu management)
import MenuManagement      from './pages/MenuManagement'
import OrdersPage from './pages/Admin/OrdersPage'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public ── */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ── Customer (CUSTOMER role) ── */}
            <Route path="/dashboard" element={
              <ProtectedRoute role="CUSTOMER">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/order/menu" element={
              <ProtectedRoute role="CUSTOMER"><CustomerMenu /></ProtectedRoute>
            } />
            <Route path="/order/cart" element={
              <ProtectedRoute role="CUSTOMER"><Cart /></ProtectedRoute>
            } />
            <Route path="/order/checkout" element={
              <ProtectedRoute role="CUSTOMER"><Checkout /></ProtectedRoute>
            } />
            <Route path="/order/success" element={
              <ProtectedRoute role="CUSTOMER"><OrderSuccess /></ProtectedRoute>
            } />

            {/* ── Admin (ADMIN role) ── */}
            <Route path="/admin" element={
              <ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute role="ADMIN"><MenuManagement /></ProtectedRoute>
            } />

            {/* ── Default ── */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

           <Route
  path="/admin/orders"
  element={
    <ProtectedRoute role="ADMIN">
      <OrdersPage />
    </ProtectedRoute>
  }
/>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App




