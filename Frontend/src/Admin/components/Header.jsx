// src/admin/components/Header.jsx
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Swal from 'sweetalert2';

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-4">
      <Container fluid>
        <Navbar.Brand href="/admin/dashboard" className="fw-bold">
          Admin Panel
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/admin/add-product">Add Product</Nav.Link>
            <Nav.Link href="/admin/manage-product">Manage Products</Nav.Link>
            <Nav.Link href="/">Go to Site</Nav.Link>
            <Nav.Link onClick={async () => {
              const res = await Swal.fire({
                title: 'Logout?',
                text: 'Are you sure you want to logout from Admin?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, logout',
                cancelButtonText: 'Cancel'
              });
              if (res.isConfirmed) {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }
            }}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;