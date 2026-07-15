import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ChefLayout } from './layouts/ChefLayout';
import { WaiterLayout } from './layouts/WaiterLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ChefDashboard } from './pages/chef/Dashboard';
import { LoginPage } from './pages/auth/Login';
import { NotFound } from './pages/NotFound';
import { WaiterDashboard } from './pages/waiter/Dashboard';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRedirect } from './routes/RoleRedirect';
import { UserRole } from './types/auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Admin]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<PlaceholderPage title="Menu Management" description="Manage categories, pricing, modifiers, and item availability." />} />
          <Route path="orders" element={<PlaceholderPage title="Order Management" description="Review dine-in, pickup, and completed order activity." />} />
          <Route path="inventory" element={<PlaceholderPage title="Inventory" description="Track stock, par levels, suppliers, and purchasing needs." />} />
          <Route path="employees" element={<PlaceholderPage title="Employee Management" description="Manage staff profiles, roles, shifts, and access." />} />
          <Route path="reports" element={<PlaceholderPage title="Reports" description="Analyze sales, product mix, labor, and operational trends." />} />
          <Route path="recipes" element={<PlaceholderPage title="Recipes" description="Connect menu items to preparation notes and ingredient usage." />} />
          <Route path="suppliers" element={<PlaceholderPage title="Suppliers" description="Maintain supplier contacts and purchase history." />} />
          <Route path="settings" element={<PlaceholderPage title="Settings" description="Configure cafe preferences, taxes, service areas, and devices." />} />
        </Route>

        <Route
          path="/waiter"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Waiter]}>
              <WaiterLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<WaiterDashboard />} />
          <Route path="menu" element={<WaiterDashboard />} />
          <Route path="orders" element={<PlaceholderPage title="Active Orders" description="Fast order review and table handoff tools." />} />
          <Route path="checkout" element={<PlaceholderPage title="Checkout" description="Payment flow will be connected when a backend is available." />} />
        </Route>

        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Chef]}>
              <ChefLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ChefDashboard />} />
          <Route path="queue" element={<ChefDashboard />} />
          <Route path="prep" element={<PlaceholderPage title="Prep List" description="Ingredient prep and batch production planning." />} />
        </Route>

        <Route path="/" element={<RoleRedirect />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
