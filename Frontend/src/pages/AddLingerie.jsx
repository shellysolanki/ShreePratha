import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validate, isRequired, minLen, isPositive, isNonNegative, isAlpha, isDigits, isDecimal, isCsvAlpha } from '../utils/validate';
import { toastError, toastSuccess } from '../utils/notify';

export default function AddLingerie() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [lingerieList, setLingerieList] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    image: '',
    description: '',
    style: '',
    fabric: '',
    sizes: '',
    colors: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetch(`http://localhost:5000/inner/${id}`)
        .then(res => res.json())
        .then(data => setFormData({
          ...data,
          sizes: data.sizes ? data.sizes.join(', ') : '',
          colors: data.colors ? data.colors.join(', ') : ''
        }))
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
    if (file.size > 1024 * 1024) {
      alert('Image size should be less than 1MB');
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
      const res = await fetch(`http://localhost:5000/inner/${formData._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        setLingerieList(prev => prev.filter(item => item._id !== formData._id));
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
      { title: formData.title, price: formData.price, style: formData.style, fabric: formData.fabric, sizes: formData.sizes, colors: formData.colors, stock: formData.stock },
      {
        title: [ { check: isRequired, message: 'Title is required' }, { check: (v) => minLen(v, 2), message: 'Title must be at least 2 characters' }, { check: isAlpha, message: 'Title must contain only letters' } ],
        price: [ { check: isRequired, message: 'Price is required' }, { check: isDecimal, message: 'Price must be a valid number' }, { check: isPositive, message: 'Price must be greater than 0' } ],
        style: [ { check: isRequired, message: 'Style is required' }, { check: isAlpha, message: 'Style must contain only letters' } ],
        fabric: [ { check: isRequired, message: 'Fabric is required' }, { check: isAlpha, message: 'Fabric must contain only letters' } ],
        sizes: [ { check: isRequired, message: 'Sizes are required' }, { check: isCsvAlpha, message: 'Sizes must be letters separated by commas' } ],
        colors: [ { check: isRequired, message: 'Colors are required' }, { check: isCsvAlpha, message: 'Colors must be letters separated by commas' } ],
        stock: [ { check: isRequired, message: 'Stock is required' }, { check: isDigits, message: 'Stock must be an integer' }, { check: isNonNegative, message: 'Stock cannot be negative' } ],
      }
    );
    if (!result.valid) { toastError(result.message); setLoading(false); return; }
    
    const endpoint = isEditMode
      ? `http://localhost:5000/inner/${id}`
      : 'http://localhost:5000/inner/';

    // Convert comma-separated strings to arrays
    const submitData = {
      title: formData.title,
      price: Number(formData.price),
      description: formData.description || '',
      style: formData.style || '',
      fabric: formData.fabric || '',
      stock: Number(formData.stock) || 0,
      images: [formData.image || '/default.jpg'],
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : [],
      colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : []
    };

    try {
      const res = await fetch(endpoint, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      const data = await res.json();
      toastSuccess(isEditMode ? 'Lingerie updated!' : 'Lingerie added!');
      if (!isEditMode) {
        setFormData({
          title: '',
          price: '',
          image: '',
          description: '',
          style: '',
          fabric: '',
          sizes: '',
          colors: '',
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
      <h3 className="mb-4">{isEditMode ? 'Edit Lingerie Item' : 'Add Lingerie Item'}</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            name="title"
            placeholder="Lingerie Title"
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
                Delete Images
              </button>
            )}
          </div>
        )}

        
        <div className="col-md-4">
          <input
            type="text"
            name="style"
            placeholder="Style (e.g. Padded, Non-padded)"
            className="form-control"
            value={formData.style}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="fabric"
            placeholder="Fabric (e.g. Cotton, Lace)"
            className="form-control"
            value={formData.fabric}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="sizes"
            placeholder="Sizes (e.g. S, M, L, XL)"
            className="form-control"
            value={formData.sizes}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="colors"
            placeholder="Colors (e.g. Black, White, Pink)"
            className="form-control"
            value={formData.colors}
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
              : isEditMode ? 'Update Lingerie' : 'Add Lingerie'}
          </button>
        </div>
      </form>
    </div>
  );
}
