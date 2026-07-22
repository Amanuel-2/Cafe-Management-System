import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Spinner } from './components/ui/Spinner';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRedirect } from './routes/RoleRedirect';
import { STAFF_ROUTE_ROLES } from './routes/access';
import { lazyNamed } from './utils/lazyNamed';

const AdminLayout = lazyNamed(() => import('./layouts/AdminLayout'), 'AdminLayout');
const AuthLayout = lazyNamed(() => import('./layouts/AuthLayout'), 'AuthLayout');
const ChefLayout = lazyNamed(() => import('./layouts/ChefLayout'), 'ChefLayout');
const WaiterLayout = lazyNamed(() => import('./layouts/WaiterLayout'), 'WaiterLayout');
const CashierLayout = lazyNamed(() => import('./layouts/CashierLayout'), 'CashierLayout');
const ConsumerLayout = lazyNamed(() => import('./layouts/ConsumerLayout'), 'ConsumerLayout');
const AdminDashboard = lazyNamed(() => import('./pages/admin/Dashboard'), 'AdminDashboard');
const PlaceholderPage = lazyNamed(() => import('./pages/PlaceholderPage'), 'PlaceholderPage');
const ChefDashboard = lazyNamed(() => import('./pages/chef/Dashboard'), 'ChefDashboard');
const CashierDashboard = lazyNamed(() => import('./pages/cashier/Dashboard'), 'CashierDashboard');
const ConsumerHome = lazyNamed(() => import('./pages/consumer/Home'), 'ConsumerHome');
const ConsumerMenu = lazyNamed(() => import('./pages/consumer/Menu'), 'ConsumerMenu');
const MenuManagementPage = lazyNamed(() => import('./features/menu/MenuManagementPage'), 'MenuManagementPage');
const LoginPage = lazyNamed(() => import('./pages/auth/Login'), 'LoginPage');
const NotFound = lazyNamed(() => import('./pages/NotFound'), 'NotFound');
const WaiterDashboard = lazyNamed(() => import('./pages/waiter/Dashboard'), 'WaiterDashboard');
const WaiterOrdersPage = lazyNamed(() => import('./features/orders/WaiterOrdersPage'), 'WaiterOrdersPage');
const WaiterCheckoutPage = lazyNamed(() => import('./features/orders/WaiterCheckoutPage'), 'WaiterCheckoutPage');
const OrderManagementPage = lazyNamed(() => import('./features/orders/OrderManagementPage'), 'OrderManagementPage');
const InventoryPage = lazyNamed(() => import('./features/inventory/InventoryPage'), 'InventoryPage');
const EmployeesPage = lazyNamed(() => import('./features/employees/EmployeesPage'), 'EmployeesPage');
const RecipesPage = lazyNamed(() => import('./features/recipes/RecipesPage'), 'RecipesPage');
const ReportsPage = lazyNamed(() => import('./features/reports/ReportsPage'), 'ReportsPage');
const SuppliersPage = lazyNamed(() => import('./features/suppliers/SuppliersPage'), 'SuppliersPage');

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-100 dark:bg-stone-950">
      <div className="space-y-3 text-center">
        <Spinner className="mx-auto h-10 w-10 text-stone-500" />
        <p className="text-sm text-stone-500 dark:text-stone-400">Loading workspace…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
            <ProtectedRoute allowedRoles={STAFF_ROUTE_ROLES.admin}>
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
            <ProtectedRoute allowedRoles={STAFF_ROUTE_ROLES.cashier}>
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
            <ProtectedRoute allowedRoles={STAFF_ROUTE_ROLES.waiter}>
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
            <ProtectedRoute allowedRoles={STAFF_ROUTE_ROLES.chef}>
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
      </Suspense>
    </BrowserRouter>
  );
}
