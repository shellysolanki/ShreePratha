// src/admin/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="bg-light border-end vh-100 p-3" style={{ width: '250px' }}>
      <h5 className="fw-bold mb-4">Admin Menu</h5>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/admin/add-product">Add Product</Nav.Link>
        <Nav.Link as={Link} to="/admin/manage-product">Manage Products</Nav.Link>
        <Nav.Link as={Link} to="/">Go to Site</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;