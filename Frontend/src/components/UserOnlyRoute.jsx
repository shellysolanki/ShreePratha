import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function UserOnlyRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded?.role === 'admin') return <Navigate to="/admin/dashboard" />;
    return children;
  } catch {
    // Fallback to userData if token can't be decoded
    try {
      const user = JSON.parse(localStorage.getItem('userData') || 'null');
      if (user?.role === 'admin') return <Navigate to="/admin/dashboard" />;
      return children;
    } catch {
      return <Navigate to="/login" />;
    }
  }
}


