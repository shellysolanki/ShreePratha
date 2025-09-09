import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RequireAdminAuth from './components/RequireAdminAuth';
import UserDashboard from './pages/UserDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <RequireAdminAuth>
          <AdminDashboard />
        </RequireAdminAuth>
      } />
      <Route path="/account" element={<UserDashboard />} />
    </Routes>
  );
}