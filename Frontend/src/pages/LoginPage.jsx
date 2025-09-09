
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Toast } from 'react-bootstrap';
import axios from 'axios';
import { validate, isRequired, isEmail, minLen } from '../utils/validate';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'; // ✅ Fixed

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "priyankasolanki@admin.com";
  const ADMIN_PASSWORD = "shellshreeprathuaana";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowToast(false);

    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem('token', 'admin-token');
      navigate('/admin/dashboard');
      return;
    }

    // Validate inputs
    const result = validate(
      { email: form.email, password: form.password },
      {
        email: [
          { check: isRequired, message: 'Email is required' },
          { check: isEmail, message: 'Enter a valid email' },
        ],
        password: [
          { check: isRequired, message: 'Password is required' },
          { check: (v) => minLen(v, 6), message: 'Password must be at least 6 characters' },
        ],
      }
    );
    if (!result.valid) {
      setError(result.message);
      return;
    }

    try {
      const res = await axios.post('https://shreepratha.onrender.com/api/auth/login', form);
      const { token } = res.data;
      localStorage.setItem('token', token);
      if (res.data?.user) {
        localStorage.setItem('userData', JSON.stringify(res.data.user));
      }
      
      // Trigger custom event to update wishlist context
      window.dispatchEvent(new CustomEvent('userLogin'));
      const decoded = jwtDecode(token);

      if (decoded.role === 'user') {
        setShowToast(true);
        setTimeout(() => navigate('/Categories'), 1500);
      } else if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Unknown role');
        localStorage.removeItem('token');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post('https://shreepratha.onrender.com/api/auth/google-login', {
        token: credentialResponse.credential,
      });

      console.log('Google login response:', res.data); // Debug log
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      
      // Store user data in localStorage for debugging
      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
        console.log('Stored user data:', user);
      }
      
      // Trigger custom event to update wishlist context
      window.dispatchEvent(new CustomEvent('userLogin'));
      
      const decoded = jwtDecode(token);

      if (decoded.role === 'user') {
        setShowToast(true);
        setTimeout(() => navigate('/Categories'), 1500);
      } else if (decoded.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        setError('Unknown role');
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="container-fluid py-5" style={{ 
        background: 'linear-gradient(135deg, #ffc0cb 0%, #fffdd0 50%, #ffb6c1 100%)',
        minHeight: '100vh'
      }}>
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{ 
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #fff 0%, #fff5f8 100%)',
              border: '2px solid rgba(255, 107, 157, 0.1)'
            }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🛍️</div>
                  <h2 className="fw-bold" style={{ 
                    color: '#d63384',
                    textShadow: '2px 2px 4px rgba(255, 192, 203, 0.3)'
                  }}>
                    Welcome Back
                  </h2>
                  <p className="text-muted">Sign in to your ShreePratha account</p>
                </div>

                {error && (
                  <Alert variant="danger" className="text-center rounded-pill" style={{
                    border: 'none',
                    background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>{error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold" style={{ color: '#d63384' }}>
                      <i className="bi bi-envelope me-2"></i>Email Address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="form-control-lg"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #ffc0cb',
                        padding: '12px 20px',
                        fontSize: '1.1rem'
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold" style={{ color: '#d63384' }}>
                      <i className="bi bi-lock me-2"></i>Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="form-control-lg"
                      style={{
                        borderRadius: '15px',
                        border: '2px solid #ffc0cb',
                        padding: '12px 20px',
                        fontSize: '1.1rem'
                      }}
                      required
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 py-3 fw-bold mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #c2185b, #880e4f)',
                      border: 'none',
                      borderRadius: '15px',
                      fontSize: '1.2rem',
                      color: '#fff',
                      boxShadow: '0 8px 25px rgba(136, 14, 79, 0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 35px rgba(136, 14, 79, 0.7)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(136, 14, 79, 0.5)';
                    }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </Button>

                  {/* Google Login Button */}
                  <div className="text-center">
                    <div className="mb-3">
                      <hr style={{ borderColor: '#ffc0cb' }} />
                      <span className="text-muted bg-white px-3" style={{ position: 'relative', top: '-12px' }}>
                        or continue with
                      </span>
                    </div>
                    <GoogleLogin
                      onSuccess={handleGoogleLogin}
                      onError={() => setError('Google login failed')}
                      theme="outline"
                      size="large"
                      text="signin_with"
                      shape="rectangular"
                    />
                  </div>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Don't have an account? 
                    <a href="/register" className="text-decoration-none fw-bold ms-1" style={{ color: '#d63384' }}>
                      Sign Up
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast after successful user login */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={1200}
        autohide
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          minWidth: '200px',
          backgroundColor: '#28a745',
          color: '#fff',
          fontWeight: 'bold',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body>Login Successful</Toast.Body>
      </Toast>
    </GoogleOAuthProvider>

    
  );
};

export default LoginPage;



// import React, { useState } from 'react';
// import { Form, Button, Container, Row, Col, Alert, Toast } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

// const LoginPage = () => {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const [showToast, setShowToast] = useState(false);
//   const [query, setQuery] = useState('');
//   const navigate = useNavigate();

//   const ADMIN_EMAIL = "priyankasolanki@admin.com";
//   const ADMIN_PASSWORD = "shellshreeprathuaana";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setShowToast(false);

//     if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
//       localStorage.setItem('token', 'admin-token');
//       navigate('/admin/dashboard');
//       return;
//     }

//     try {
//       const res = await axios.post('https://shreepratha.onrender.com/api/auth/login', form);
//       const { token } = res.data;
//       localStorage.setItem('token', token);
//       const decoded = jwtDecode(token);

//       if (decoded.role === 'user') {
//         setShowToast(true);
//         setTimeout(() => navigate('/Categories'), 1500);
//       } else if (decoded.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         setError('Unknown role');
//         localStorage.removeItem('token');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid credentials');
//     }
//   };

//   const handleGoogleLogin = async (credentialResponse) => {
//     try {
//       const res = await axios.post('https://shreepratha.onrender.com/api/auth/google-login', {
//         token: credentialResponse.credential,
//       });

//       const { token } = res.data;
//       localStorage.setItem('token', token);
//       const decoded = jwtDecode(token);

//       if (decoded.role === 'user') {
//         setShowToast(true);
//         setTimeout(() => navigate('/Categories'), 1500);
//       } else if (decoded.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         setError('Unknown role');
//         localStorage.removeItem('token');
//       }
//     } catch (err) {
//       setError('Google login failed');
//     }
//   };

//   // ✅ Search logic
//   const handleSearch = () => {
//     const normalized = query.trim().toLowerCase();
//     if (['jewel', 'jewels', 'jewellery', 'jewelry'].includes(normalized)) {
//       navigate('/jewellery');
//     } else {
//       navigate(`/search?query=${encodeURIComponent(query)}`);
//     }
//   };

//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
//       <Container className="mt-5">
//         <Row className="justify-content-md-center">
//           <Col md={6}>
//             <h3 className="mb-4 text-center" style={{ color: '#bd0221ff' }}>Login</h3>
//             {error && <Alert variant="danger" className="text-center">{error}</Alert>}
//             <Form onSubmit={handleSubmit} className="p-4 shadow" style={{ backgroundColor: '#fff' }}>
//               <Form.Group className="mb-3">
//                 <Form.Label>Email</Form.Label>
//                 <Form.Control
//                   type="email"
//                   placeholder="Enter email"
//                   value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-4">
//                 <Form.Label>Password</Form.Label>
//                 <Form.Control
//                   type="password"
//                   placeholder="Enter password"
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   required
//                 />
//               </Form.Group>
//               <Button type="submit" className="w-100" style={{ backgroundColor: '#bd0221ff', color: '#fff' }}>
//                 Login
//               </Button>

//               {/* ✅ Google Login Button */}
//               <div className="mt-3 text-center">
//                 <GoogleLogin
//                   onSuccess={handleGoogleLogin}
//                   onError={() => setError('Google login failed')}
//                 />
//               </div>
//             </Form>

//             {/* ✅ Search Bar */}
//             <div className="mt-4 d-flex">
//               <Form.Control
//                 type="text"
//                 placeholder="Search..."
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <Button variant="outline-danger" onClick={handleSearch} className="ms-2">
//                 Search
//               </Button>
//             </div>
//           </Col>
//         </Row>
//       </Container>

//       {/* ✅ Toast after successful user login */}
//       <Toast
//         onClose={() => setShowToast(false)}
//         show={showToast}
//         delay={1200}
//         autohide
//         style={{
//           position: 'fixed',
//           top: 20,
//           right: 20,
//           minWidth: '200px',
//           backgroundColor: '#28a745',
//           color: '#fff',
//           fontWeight: 'bold',
//           boxShadow: '0 0 10px rgba(0,0,0,0.2)'
//         }}
//       >
//         <Toast.Header closeButton={false}>
//           <strong className="me-auto">Success</strong>
//         </Toast.Header>
//         <Toast.Body>Login Successful</Toast.Body>
//       </Toast>
//     </GoogleOAuthProvider>
//   );
// };

// export default LoginPage;