import { Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Spinner } from './components/ui/Spinner';
import { RouteErrorBoundary } from './components/common/RouteErrorBoundary';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PermissionRoute } from './routes/PermissionRoute';
import { RoleRedirect } from './routes/RoleRedirect';
import { PERMISSION, STAFF_ROUTE_ROLES } from './routes/access';
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
const CategoriesPage = lazyNamed(() => import('./features/categories/CategoriesPage'), 'CategoriesPage');
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
const RolesPage = lazyNamed(() => import('./features/roles/RolesPage'), 'RolesPage');
const AuditLogsPage = lazyNamed(() => import('./features/audit/AuditLogsPage'), 'AuditLogsPage');
const AccessDenied = lazyNamed(() => import('./pages/AccessDenied'), 'AccessDenied');

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
      <RouteErrorBoundary>
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
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={STAFF_ROUTE_ROLES.admin}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="menu" element={<PermissionRoute permission={PERMISSION.MANAGE_MENU}><MenuManagementPage /></PermissionRoute>} />
          <Route path="categories" element={<PermissionRoute permission={PERMISSION.MANAGE_MENU}><CategoriesPage /></PermissionRoute>} />
          <Route path="orders" element={<PermissionRoute permission={PERMISSION.MANAGE_ORDERS}><OrderManagementPage /></PermissionRoute>} />
          <Route path="inventory" element={<PermissionRoute permission={PERMISSION.MANAGE_INVENTORY}><InventoryPage /></PermissionRoute>} />
          <Route path="employees" element={<PermissionRoute permission={PERMISSION.MANAGE_EMPLOYEES}><EmployeesPage /></PermissionRoute>} />
          <Route path="roles" element={<PermissionRoute permission={PERMISSION.MANAGE_EMPLOYEES}><RolesPage /></PermissionRoute>} />
          <Route path="reports" element={<PermissionRoute permission={PERMISSION.VIEW_REPORTS}><ReportsPage /></PermissionRoute>} />
          <Route path="recipes" element={<PermissionRoute permission={PERMISSION.MANAGE_MENU}><RecipesPage /></PermissionRoute>} />
          <Route path="suppliers" element={<PermissionRoute permission={PERMISSION.MANAGE_INVENTORY}><SuppliersPage /></PermissionRoute>} />
          <Route path="audit-logs" element={<PermissionRoute permission={PERMISSION.MANAGE_EMPLOYEES}><AuditLogsPage /></PermissionRoute>} />
          <Route path="settings" element={<PermissionRoute permission={PERMISSION.MANAGE_SETTINGS}><PlaceholderPage title="Settings" description="Configure cafe preferences, taxes, service areas, and devices." /></PermissionRoute>} />
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
          <Route path="pos" element={<PermissionRoute permission={PERMISSION.TAKE_PAYMENT}><PlaceholderPage title="Point of Sale" description="The transactional POS workflow is scheduled after menu and inventory services." /></PermissionRoute>} />
          <Route path="orders" element={<PermissionRoute permission={PERMISSION.MANAGE_ORDERS}><OrderManagementPage /></PermissionRoute>} />
          <Route path="payments" element={<PermissionRoute permission={PERMISSION.TAKE_PAYMENT}><PlaceholderPage title="Payments" description="Payment capture and history are scheduled in Phase 7." /></PermissionRoute>} />
          <Route path="receipts" element={<PermissionRoute permission={PERMISSION.TAKE_PAYMENT}><PlaceholderPage title="Receipts" description="Receipt lookup and printing are scheduled in Phase 7." /></PermissionRoute>} />
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
          <Route path="menu" element={<PermissionRoute permission={PERMISSION.CREATE_ORDER}><WaiterDashboard /></PermissionRoute>} />
          <Route path="orders" element={<PermissionRoute permission={PERMISSION.MANAGE_ORDERS}><WaiterOrdersPage /></PermissionRoute>} />
          <Route path="checkout" element={<PermissionRoute permission={PERMISSION.MANAGE_ORDERS}><WaiterCheckoutPage /></PermissionRoute>} />
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
          <Route path="queue" element={<PermissionRoute permission={PERMISSION.PREPARE_ORDERS}><ChefDashboard /></PermissionRoute>} />
          <Route path="prep" element={<PermissionRoute permission={PERMISSION.VIEW_PUBLIC_MENU}><PlaceholderPage title="Inventory alerts" description="Ingredient alerts and preparation planning." /></PermissionRoute>} />
        </Route>

        <Route path="/dashboard" element={<RoleRedirect />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </RouteErrorBoundary>
    </BrowserRouter>
  );
}
