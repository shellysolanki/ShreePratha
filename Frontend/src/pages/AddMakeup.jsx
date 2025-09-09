
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function AddMakeup() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = Boolean(id);

//   const [formData, setFormData] = useState({
//     _id: '',
//     title: '',
//     price: '',
//     image: '',
//     description: '',
//     type: '',
//     shade: '',
//     stock: '',
//   });

//   const [loading, setLoading] = useState(false);

//   // Fetch existing item if editing
//   useEffect(() => {
//     if (isEditMode) {
//       fetch(`https://shreepratha.onrender.com/makeup/${id}`)
//         .then(res => res.json())
//         .then(data => setFormData(data))
//         .catch(err => console.error('Failed to fetch item:', err));
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'stock' && Number(value) < 0) return;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 1024 * 1024) {
//       alert('Image size should be less than 1MB');
//       return;
//     }
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFormData({ ...formData, image: reader.result });
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleDelete = async () => {
//     if (!formData._id) return;

//     try {
//       const res = await fetch(`https://shreepratha.onrender.com/makeup/${formData._id}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//       });

//       if (res.ok) {
//         alert('Item deleted successfully');
//         navigate('/');
//       } else {
//         alert('Delete failed');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       alert('Network error');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const payload = {
//       title: formData.title?.trim(),
//       price: Number(formData.price) || 1,
//       type: formData.type?.toLowerCase(),
//       shade: formData.shade?.trim(),
//       description: formData.description?.trim(),
//       image: formData.image || 'https://placeholder.com/image.jpg',
//       stock: Number(formData.stock) || 0,
//     };

//     try {
//       const url = isEditMode
//         ? `https://shreepratha.onrender.com/makeup/${formData._id}`
//         : 'https://shreepratha.onrender.com/makeup/add';

//       const method = isEditMode ? 'PUT' : 'POST';

//       const res = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         alert(isEditMode ? 'Item updated successfully' : 'Item added successfully');
//         navigate('/');
//       } else {
//         console.error('Failed:', data.message || 'Unknown error');
//         alert('Submission failed');
//       }
//     } catch (err) {
//       console.error('Network error:', err);
//       alert('Network error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container py-4">
//       <h3 className="mb-4">{isEditMode ? 'Edit Makeup Item' : 'Add Makeup Item'}</h3>
//       <form onSubmit={handleSubmit} className="row g-3">
//         <div className="col-md-6">
//           <input
//             type="text"
//             name="title"
//             placeholder="Makeup Title"
//             className="form-control"
//             value={formData.title}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="col-md-6">
//           <input
//             type="text"
//             name="price"
//             placeholder="Price"
//             className="form-control"
//             value={formData.price}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="col-md-6">
//           <input
//             type="file"
//             accept="image/*"
//             className="form-control"
//             onChange={handleImageUpload}
//           />
//         </div>

//         {formData.image && (
//           <div className="col-md-6 text-center">
//             <img
//               src={formData.image}
//               alt="Preview"
//               style={{ maxHeight: '400px', objectFit: 'contain', marginBottom: '1rem' }}
//             />
//             {isEditMode && (
//               <button
//                 type="button"
//                 className="btn btn-outline-danger mt-2"
//                 onClick={handleDelete}
//               >
//                 Delete Item
//               </button>
//             )}
//           </div>
//         )}

//         <div className="col-md-6">
//           <textarea
//             name="description"
//             placeholder="Description"
//             className="form-control"
//             value={formData.description}
//             onChange={handleChange}
//             rows="2"
//             required
//           />
//         </div>

//         <div className="col-md-4">
//           <select
//             name="type"
//             className="form-control"
//             value={formData.type}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Type</option>
//             <option value="foundation">Foundation</option>
//             <option value="lipstick">Lipstick</option>
//             <option value="eyeliner">Eyeliner</option>
//             <option value="mascara">Mascara</option>
//             <option value="blush">Blush</option>
//             <option value="concealer">Concealer</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         <div className="col-md-4">
//           <input
//             type="text"
//             name="shade"
//             placeholder="Shade (e.g. Nude Beige)"
//             className="form-control"
//             value={formData.shade}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="col-md-4">
//           <input
//             type="number"
//             name="stock"
//             placeholder="Stock Quantity"
//             className="form-control"
//             value={formData.stock}
//             onChange={handleChange}
//             required
//             min="0"
//           />
//         </div>

//         <div className="col-12 text-end">
//           <button type="submit" className="btn btn-dark" disabled={loading}>
//             {loading
//               ? isEditMode ? 'Updating...' : 'Adding...'
//               : isEditMode ? 'Update Makeup' : 'Add Makeup'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { toastSuccess, toastError } from '../utils/notify';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { validate, isRequired, minLen, isPositive, isNonNegative, isAlpha, isDigits, isDecimal } from '../utils/validate';

export default function AddMakeup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    price: '',
    image: '',
    description: '',
    type: '',
    shade: '',
    stock: '',
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing item if editing
  useEffect(() => {
    if (isEditMode) {
      fetch(`https://shreepratha.onrender.com/makeup/${id}`)
        .then(res => res.json())
        .then(data => setFormData(data))
        .catch(err => console.error('Failed to fetch item:', err));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stock' && Number(value) < 0) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async () => {
    if (!formData._id) return;

    try {
      const res = await fetch(`https://shreepratha.onrender.com/makeup/${formData._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        toastSuccess('Item deleted successfully', '/');
      } else {
        toastError('Delete failed');
      }
    } catch (err) {
      console.error('Error:', err);
      toastError('Network error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    const result = validate(
      { title: formData.title, type: formData.type, shade: formData.shade, price: formData.price, stock: formData.stock },
      {
        title: [
          { check: isRequired, message: 'Title is required' },
          { check: (v) => minLen(v, 2), message: 'Title must be at least 2 characters' },
          { check: isAlpha, message: 'Title must contain only letters' },
        ],
        type: [
          { check: isRequired, message: 'Type is required' },
        ],
        shade: [
          { check: isRequired, message: 'Shade is required' },
          { check: isAlpha, message: 'Shade must contain only letters' },
        ],
        price: [
          { check: isRequired, message: 'Price is required' },
          { check: isDecimal, message: 'Price must be a valid number' },
          { check: isPositive, message: 'Price must be greater than 0' },
        ],
        stock: [
          { check: isRequired, message: 'Stock is required' },
          { check: isDigits, message: 'Stock must be an integer' },
          { check: isNonNegative, message: 'Stock cannot be negative' },
        ],
      }
    );
    if (!result.valid) {
      toastError(result.message);
      setLoading(false);
      return;
    }

    const payload = {
      title: formData.title?.trim(),
      price: Number(formData.price) || 1,
      type: formData.type?.toLowerCase(),
      shade: formData.shade?.trim(),
      description: formData.description?.trim(),
      image: formData.image || 'https://placeholder.com/image.jpg',
      stock: Number(formData.stock) || 0,
    };

    try {
      const url = isEditMode
        ? `https://shreepratha.onrender.com/makeup/${formData._id}`
        : 'https://shreepratha.onrender.com/makeup/add';

      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toastSuccess(isEditMode ? 'Item updated successfully' : 'Item added successfully', '/');
      } else {
        console.error('Failed:', data.message || 'Unknown error');
        toastError('Submission failed');
      }
    } catch (err) {
      console.error('Network error:', err);
      toastError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">{isEditMode ? 'Edit Makeup Item' : 'Add Makeup Item'}</h3>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <input
            type="text"
            name="title"
            placeholder="Makeup Title"
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
          <select
            name="type"
            className="form-control"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="foundation">Foundation</option>
            <option value="lipstick">Lipstick</option>
            <option value="eyeliner">Eyeliner</option>
            <option value="mascara">Mascara</option>
            <option value="blush">Blush</option>
            <option value="concealer">Concealer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="col-md-4">
          <input
            type="text"
            name="shade"
            placeholder="Shade (e.g. Nude Beige)"
            className="form-control"
            value={formData.shade}
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
              : isEditMode ? 'Update Makeup' : 'Add Makeup'}
          </button>
        </div>
      </form>
    </div>
  );
}
