import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validate, isRequired, minLen, isPositive, isNonNegative, isAlpha, isDigits, isDecimal } from '../utils/validate';
import { toastError, toastSuccess } from '../utils/notify';

export default function AddBag() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [bagList, setBagList] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
    material: '',
    color: '',
    size: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetch(`https://shreepratha.onrender.com/bag/${id}`)
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => console.error('Failed to fetch item:', err));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stock' && value < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`https://shreepratha.onrender.com/bag/${formData._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setBagList(prev => prev.filter(item => item._id !== formData._id));
        alert('Deleted successfully');
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Network error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = validate(
      { title: formData.title, price: formData.price, material: formData.material, color: formData.color, size: formData.size, stock: formData.stock },
      {
        title: [ { check: isRequired, message: 'Title is required' }, { check: (v) => minLen(v, 2), message: 'Title must be at least 2 characters' }, { check: isAlpha, message: 'Title must contain only letters' } ],
        price: [ { check: isRequired, message: 'Price is required' }, { check: isDecimal, message: 'Price must be a valid number' }, { check: isPositive, message: 'Price must be greater than 0' } ],
        material: [ { check: isRequired, message: 'Material is required' }, { check: isAlpha, message: 'Material must contain only letters' } ],
        color: [ { check: isRequired, message: 'Color is required' } ],
        size: [ { check: isRequired, message: 'Size is required' } ],
        stock: [ { check: isRequired, message: 'Stock is required' }, { check: isDigits, message: 'Stock must be an integer' }, { check: isNonNegative, message: 'Stock cannot be negative' } ],
      }
    );
    if (!result.valid) { toastError(result.message); setLoading(false); return; }
    
    const endpoint = isEditMode
      ? `https://shreepratha.onrender.com/bag/${id}`
      : 'https://shreepratha.onrender.com/bag/';

    const submitData = {
      title: formData.title,
      price: Number(formData.price),
      description: formData.description || '',
      material: formData.material || '',
      color: formData.color || '',
      size: formData.size || '',
      stock: Number(formData.stock) || 0,
      images: formData.image ? [formData.image] : ['/default.jpg']
    };

    try {
      const res = await fetch(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      toastSuccess(isEditMode ? 'Bag updated!' : 'Bag added!');
      if (!isEditMode) {
        setFormData({
          title: '',
          price: '',
          image: '',
          description: '',
          material: '',
          color: '',
          size: '',
          stock: '',
        });
      }
    } catch (err) {
      console.error(err);
      alert('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">{isEditMode ? 'Edit Bag Item' : 'Add Bag Item'}</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            name="title"
            placeholder="Bag Title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="price"
            placeholder="Price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleImageUpload}
          />
        </div>

        {formData.image && (
          <div className="col-md-6 text-center">
            <img
              src={formData.image}
              alt="Preview"
              style={{ maxHeight: '400px', objectFit: 'contain', marginBottom: '1rem' }}
            />
            {isEditMode && (
              <button
                type="button"
                className="btn btn-outline-danger mt-2"
                onClick={handleDelete}
              >
                Delete Image
              </button>
            )}
          </div>
        )}

        
        <div className="col-md-4">
          <input
            type="text"
            name="material"
            placeholder="Material (e.g. Leather, Jute)"
            className="form-control"
            value={formData.material}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="color"
            placeholder="Color"
            className="form-control"
            value={formData.color}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="size"
            placeholder="Size (e.g. Small, Medium, Large)"
            className="form-control"
            value={formData.size}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            className="form-control"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading
              ? isEditMode ? 'Updating...' : 'Adding...'
              : isEditMode ? 'Update Bag' : 'Add Bag'}
          </button>
        </div>
      </form>
    </div>
  );
}
