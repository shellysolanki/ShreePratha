import { jwtDecode } from 'jwt-decode';

export function getValidToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp || decoded.exp * 1000 <= Date.now()) {
      localStorage.removeItem('token');
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem('token');
    return null;
  }
}


