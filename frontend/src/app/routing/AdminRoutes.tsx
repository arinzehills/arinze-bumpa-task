import { Route } from 'react-router-dom'
import { AdminProtectedRoute } from './AdminProtectedRoute'

export const AdminRoutes = () => (
  <>
    <Route element={<AdminProtectedRoute />}>
      <Route
        path="/admin"
        element={<div>Admin Dashboard</div>}
      />
      <Route
        path="/admin/users"
        element={<div>Users Management</div>}
      />
    </Route>
  </>
)