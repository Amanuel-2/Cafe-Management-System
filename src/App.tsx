// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import WaiterDashboard from './pages/waiter/Dashboard';
import ChefDashboard from './pages/chef/Dashboard';
import NotFound from './pages/NotFound';

// Protected route wrapper that checks authentication and role
function ProtectedRoute({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/*"
          element={
            <ProtectedRoute allowedRoles={["waiter"]}>
              <WaiterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chef/*"
          element={
            <ProtectedRoute allowedRoles={["chef"]}>
              <ChefDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
