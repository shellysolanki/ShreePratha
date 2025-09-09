// src/admin/pages/ManageProduct.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Table, Button, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      // Try deleting from all known collections; ignore 404s
      const endpoints = [
        `http://localhost:5000/api/products/${id}`, // generic (if used)
        `http://localhost:5000/jewellery/${id}`,
        `http://localhost:5000/bag/${id}`,
        `http://localhost:5000/inner/${id}`,
        `http://localhost:5000/makeup/${id}`,
      ];
      await Promise.allSettled(
        endpoints.map((url) => axios.delete(url).catch(() => null))
      );
      setProducts(products.filter((p) => p._id !== id));
      window.dispatchEvent(new CustomEvent('product:deleted', { detail: { id } }));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Header />
      <Container className="mt-4">
        <h4 className="mb-4">Manage Products</h4>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img src={p.imageUrl} alt={p.name} width="60" height="60" />
                  </td>
                  <td>{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.description}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(p._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
    </>
  );
};

export default ManageProduct;