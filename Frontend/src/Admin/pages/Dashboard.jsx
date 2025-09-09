// import React, { useEffect, useState } from 'react';
// import Header from '../components/Header';
// import { Container, Row, Col, Card } from 'react-bootstrap';
// import axios from 'axios';

// const Dashboard = () => {
//   const [summary, setSummary] = useState({});

//   useEffect(() => {
//     axios.get('http://localhost:3000/')
//       .then(res => setSummary(res.data))
//       .catch(err => console.error('Dashboard fetch error:', err));
//   }, []);

//   return (
//     <>
//       <Header />
//       <Container fluid>
//         <h4 className="mb-4">{summary.welcome || 'Welcome to Admin Dashboard'}</h4>
//         <Row>
//           <Col md={4}>
//             <Card className="mb-4 shadow-sm">
//               <Card.Body>
//                 <Card.Title>Products</Card.Title>
//                 <Card.Text>Total Products: {summary.productCount || '...'}</Card.Text>
//                 <a href="/admin/manage-product" className="btn btn-primary btn-sm">Go</a>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={4}>
//             <Card className="mb-4 shadow-sm">
//               <Card.Body>
//                 <Card.Title>Recent Orders</Card.Title>
//                 <Card.Text>Orders Today: {summary.recentOrders || '...'}</Card.Text>
//                 <a href="/" className="btn btn-secondary btn-sm">View Site</a>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default Dashboard;