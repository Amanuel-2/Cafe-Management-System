import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ChefLayout } from './layouts/ChefLayout';
import { WaiterLayout } from './layouts/WaiterLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ChefDashboard } from './pages/chef/Dashboard';
import { MenuManagementPage } from './features/menu/MenuManagementPage';
import { LoginPage } from './pages/auth/Login';
import { NotFound } from './pages/NotFound';
import { WaiterDashboard } from './pages/waiter/Dashboard';
import { WaiterOrdersPage } from './features/orders/WaiterOrdersPage';
import { WaiterCheckoutPage } from './features/orders/WaiterCheckoutPage';
import { OrderManagementPage } from './features/orders/OrderManagementPage';
import { InventoryPage } from './features/inventory/InventoryPage';
import { EmployeesPage } from './features/employees/EmployeesPage';
import { RecipesPage } from './features/recipes/RecipesPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { SuppliersPage } from './features/suppliers/SuppliersPage';
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
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="recipes" element={<RecipesPage />} />
          <Route path="suppliers" element={<SuppliersPage />} />
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
          <Route path="orders" element={<WaiterOrdersPage />} />
          <Route path="checkout" element={<WaiterCheckoutPage />} />
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
