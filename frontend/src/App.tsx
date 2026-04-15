import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toast } from '@components/Toast'
import { Landing } from '@modules/landing/Landing'
import { EcommerceStore } from '@modules/ecommerce/EcommerceStore'

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Ecommerce Store */}
        <Route path="/e-commerce-store/:storeId" element={<EcommerceStore />} />

        {/* Auth Routes (coming soon) */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Dashboard Routes (coming soon) */}
        {/* <Route path="/dashboard" element={<CustomerDashboard />} /> */}
        {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App