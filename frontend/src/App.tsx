import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toast } from '@components/Toast'
import { Landing } from '@modules/landing/Landing'
import { EcommerceStore } from '@modules/ecommerce/EcommerceStore'
import ProductDetail from '@modules/ecommerce/pages/ProductDetail'
import { AuthLayout } from '@app/layouts/AuthLayout'
import { Login } from '@modules/auth/Login'
import { AdminLogin } from '@modules/auth/AdminLogin'
import { ProtectedRoute } from '@app/routing/ProtectedRoute'

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Ecommerce Routes */}
        <Route path="/ecommerce/store/:storeId" element={<EcommerceStore />} />
        <Route path="/ecommerce/products/:productId" element={<ProductDetail />} />

        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="admin-login" element={<AdminLogin />} />
        </Route>

        {/* Protected Routes - User Dashboard (coming soon) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requireAuth requireRole="user">
              <div>User Dashboard</div>
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin Dashboard (coming soon) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAuth requireRole="admin">
              <div>Admin Dashboard</div>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App