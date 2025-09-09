// import React, { useState } from 'react';
// import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import jwt_decode from 'jwt-decode';

// const AdminLogin = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const res = await axios.post('/api/auth/login', { email, password });
//       const { token } = res.data;

//       // Save token
//       localStorage.setItem('token', token);

//       // Decode token to check role
//       const decoded = jwt_decode(token);
//       if (decoded.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         setError('Unauthorized: Not an admin');
//         localStorage.removeItem('token');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//     }
//   };

//   return (
//     <Container className="mt-5">
//       <Row className="justify-content-md-center">
//         <Col md={6}>
//           <h3 className="mb-4 text-center">Admin Login</h3>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <Form onSubmit={handleLogin}>
//             <Form.Group className="mb-3" controlId="formEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Form.Group className="mb-4" controlId="formPassword">
//               <Form.Label>Password</Form.Label>
//               <Form.Control
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </Form.Group>

//             <Button variant="primary" type="submit" className="w-100">
//               Login
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default AdminLogin;