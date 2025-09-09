import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/admin/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== 'admin') {
      return <Navigate to="/admin/login" />;
    }
    return children;
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" />;
  }
}

export default ProtectedRoute;