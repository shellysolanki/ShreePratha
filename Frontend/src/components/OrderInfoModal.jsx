import React, { useState, useEffect } from 'react';

export default function OrderInfoModal({ open, onClose, onComplete }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!open) return;
    try {
      const saved = JSON.parse(localStorage.getItem('orderInfo') || 'null');
      if (saved) setForm(prev => ({ ...prev, ...saved }));
    } catch {}
  }, [open]);

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces';
        return '';

      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[0-9]{10}$/.test(value.trim())) return 'Phone number must be exactly 10 digits';
        if (!/^[6-9]/.test(value.trim())) return 'Phone number must start with 6, 7, 8, or 9';
        return '';

      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Address must be at least 10 characters';
        if (value.trim().length > 200) return 'Address must be less than 200 characters';
        return '';

      case 'city':
        if (!value.trim()) return 'City is required';
        if (value.trim().length < 2) return 'City must be at least 2 characters';
        if (value.trim().length > 50) return 'City must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'City can only contain letters and spaces';
        return '';

      case 'state':
        if (!value.trim()) return 'State is required';
        if (value.trim().length < 2) return 'State must be at least 2 characters';
        if (value.trim().length > 50) return 'State must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'State can only contain letters and spaces';
        
        // Valid Indian states
        const validStates = [
          'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
          'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
          'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
          'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu',
          'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
          'andaman and nicobar islands', 'chandigarh', 'dadra and nagar haveli and daman and diu',
          'delhi', 'jammu and kashmir', 'ladakh', 'lakshadweep', 'puducherry'
        ];
        
        const stateLower = value.trim().toLowerCase();
        if (!validStates.includes(stateLower)) {
          return 'Please enter a valid Indian state name';
        }
        return '';

      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^[0-9]{6}$/.test(value.trim())) return 'Pincode must be exactly 6 digits';
        return '';

      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Mark field as touched
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field and update errors
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isValid = () => {
    const fields = ['fullName', 'phone', 'address', 'city', 'state', 'pincode'];
    return fields.every(field => !validateField(field, form[field]));
  };

  const handleSave = () => {
    if (!isValid()) return;
    localStorage.setItem('orderInfo', JSON.stringify(form));
    if (onComplete) onComplete(form);
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', width: '95%', maxWidth: '520px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          &times;
        </button>
        <h3 style={{ marginBottom: '15px' }}>Delivery details</h3>
        <div className="mb-3">
          <label className="form-label">Full name *</label>
          <input 
            className={`form-control ${touched.fullName && errors.fullName ? 'is-invalid' : ''}`}
            name="fullName" 
            value={form.fullName} 
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            maxLength="50"
          />
          {touched.fullName && errors.fullName && (
            <div className="invalid-feedback">{errors.fullName}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Phone *</label>
          <input 
            className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`}
            name="phone" 
            value={form.phone} 
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            type="tel"
          />
          {touched.phone && errors.phone && (
            <div className="invalid-feedback">{errors.phone}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Address *</label>
          <textarea 
            className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
            name="address" 
            value={form.address} 
            onChange={handleChange}
            onBlur={handleBlur}
            rows="3"
            placeholder="Enter complete address with house number, street, area"
            maxLength="200"
          />
          {touched.address && errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">City *</label>
              <input 
                className={`form-control ${touched.city && errors.city ? 'is-invalid' : ''}`}
                name="city" 
                value={form.city} 
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter city name"
                maxLength="50"
              />
              {touched.city && errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">State *</label>
              <input 
                className={`form-control ${touched.state && errors.state ? 'is-invalid' : ''}`}
                name="state" 
                value={form.state} 
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter state name"
                maxLength="50"
              />
              {touched.state && errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Pincode *</label>
          <input 
            className={`form-control ${touched.pincode && errors.pincode ? 'is-invalid' : ''}`}
            name="pincode" 
            value={form.pincode} 
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter 6-digit pincode"
            maxLength="6"
            type="tel"
          />
          {touched.pincode && errors.pincode && (
            <div className="invalid-feedback">{errors.pincode}</div>
          )}
        </div>
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!isValid()}>Save & Continue</button>
        </div>
      </div>
    </div>
  );
}


