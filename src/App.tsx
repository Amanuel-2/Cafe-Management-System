import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { ChefLayout } from './layouts/ChefLayout';
import { WaiterLayout } from './layouts/WaiterLayout';
import { CashierLayout } from './layouts/CashierLayout';
import { ConsumerLayout } from './layouts/ConsumerLayout';
import { AdminDashboard } from './pages/admin/Dashboard';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { ChefDashboard } from './pages/chef/Dashboard';
import { CashierDashboard } from './pages/cashier/Dashboard';
import { ConsumerHome } from './pages/consumer/Home';
import { ConsumerMenu } from './pages/consumer/Menu';
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

        <Route element={<ConsumerLayout />}>
          <Route path="/" element={<ConsumerHome />} />
          <Route path="/menu" element={<ConsumerMenu />} />
          <Route path="/track-order" element={<PlaceholderPage title="Track order" description="Consumer order tracking will be connected in Phase 10." />} />
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
          path="/cashier"
          element={
            <ProtectedRoute allowedRoles={[UserRole.Cashier]}>
              <CashierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CashierDashboard />} />
          <Route path="pos" element={<PlaceholderPage title="Point of Sale" description="The transactional POS workflow is scheduled after menu and inventory services." />} />
          <Route path="orders" element={<OrderManagementPage />} />
          <Route path="payments" element={<PlaceholderPage title="Payments" description="Payment capture and history are scheduled in Phase 7." />} />
          <Route path="receipts" element={<PlaceholderPage title="Receipts" description="Receipt lookup and printing are scheduled in Phase 7." />} />
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

        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
