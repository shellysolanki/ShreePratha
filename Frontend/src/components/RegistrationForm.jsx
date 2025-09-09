// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // ✅ added
// import axios from 'axios';
// import { toastSuccess, toastError } from '../utils/notify';

// const RegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: ''
//   });

//   const navigate = useNavigate(); // ✅ added

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', formData);
//       toastSuccess(res.data.message || 'Registered successfully', '/login');
//     } catch (err) {
//       toastError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="container-fluid py-5" style={{ 
//       background: 'linear-gradient(135deg, #ffc0cb 0%, #fffdd0 50%, #ffb6c1 100%)',
//       minHeight: '100vh'
//     }}>
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-md-6 col-lg-5">
//           <div className="card shadow-lg border-0" style={{ 
//             borderRadius: '25px',
//             background: 'linear-gradient(135deg, #fff 0%, #fff5f8 100%)',
//             border: '2px solid rgba(255, 107, 157, 0.1)'
//           }}>
//             <div className="card-body p-5">
//               {/* Header */}
//               <div className="text-center mb-4">
//                 <div className="mb-3" style={{ fontSize: '3rem' }}>🛍️</div>
//                 <h2 className="fw-bold" style={{ 
//                   color: '#d63384',
//                   textShadow: '2px 2px 4px rgba(255, 192, 203, 0.3)'
//                 }}>
//                   Join ShreePratha
//                 </h2>
//                 <p className="text-muted">Create your account to start shopping</p>
//               </div>

//               <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                   <label className="form-label fw-bold" style={{ color: '#d63384' }}>
//                     <i className="bi bi-person me-2"></i>Full Name
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     className="form-control form-control-lg"
//                     style={{
//                       borderRadius: '15px',
//                       border: '2px solid #ffc0cb',
//                       padding: '12px 20px',
//                       fontSize: '1.1rem'
//                     }}
//                     placeholder="Enter your full name"
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label fw-bold" style={{ color: '#d63384' }}>
//                     <i className="bi bi-envelope me-2"></i>Email Address
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     className="form-control form-control-lg"
//                     style={{
//                       borderRadius: '15px',
//                       border: '2px solid #ffc0cb',
//                       padding: '12px 20px',
//                       fontSize: '1.1rem'
//                     }}
//                     placeholder="Enter your email"
//                     required
//                     value={formData.email}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label fw-bold" style={{ color: '#d63384' }}>
//                     <i className="bi bi-lock me-2"></i>Password
//                   </label>
//                   <input
//                     type="password"
//                     name="password"
//                     className="form-control form-control-lg"
//                     style={{
//                       borderRadius: '15px',
//                       border: '2px solid #ffc0cb',
//                       padding: '12px 20px',
//                       fontSize: '1.1rem'
//                     }}
//                     placeholder="Create a strong password"
//                     required
//                     value={formData.password}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <div className="mb-4">
//                   <label className="form-label fw-bold" style={{ color: '#d63384' }}>
//                     <i className="bi bi-phone me-2"></i>Phone Number
//                   </label>
//                   <input
//                     type="tel"
//                     name="phone"
//                     className="form-control form-control-lg"
//                     style={{
//                       borderRadius: '15px',
//                       border: '2px solid #ffc0cb',
//                       padding: '12px 20px',
//                       fontSize: '1.1rem'
//                     }}
//                     placeholder="Enter your phone number"
//                     required
//                     value={formData.phone}
//                     onChange={handleChange}
//                   />
//                 </div>

//                 <button 
//                   type="submit" 
//                   className="btn w-100 py-3 fw-bold"
//                   style={{
//                     background: 'linear-gradient(135deg, #ff6b9d, #ffc0cb)',
//                     border: 'none',
//                     borderRadius: '15px',
//                     fontSize: '1.2rem',
//                     color: '#fff',
//                     boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)',
//                     transition: 'all 0.3s ease'
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.transform = 'translateY(-2px)';
//                     e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 157, 0.6)';
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.transform = 'translateY(0)';
//                     e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 157, 0.4)';
//                   }}
//                 >
//                   <i className="bi bi-person-plus me-2"></i>Create Account
//                 </button>
//               </form>

//               <div className="text-center mt-4">
//                 <p className="text-muted">
//                   Already have an account? 
//                   <a href="/login" className="text-decoration-none fw-bold ms-1" style={{ color: '#d63384' }}>
//                     Sign In
//                   </a>
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;




import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toastSuccess, toastError } from '../utils/notify';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!nameRegex.test(formData.name)) {
      toastError('Name must contain only letters and spaces (no numbers)');
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      toastError('Enter a valid email address');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      toastError('Password must be at least 6 characters and include letters and numbers');
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      toastError('Phone number must be 10 digits and start with 6-9');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      toastSuccess(res.data.message || 'Registered successfully', '/login');
    } catch (err) {
      toastError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
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
              <div className="text-center mb-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🛍️</div>
                <h2 className="fw-bold" style={{
                  color: '#d63384',
                  textShadow: '2px 2px 4px rgba(255, 192, 203, 0.3)'
                }}>
                  Join ShreePratha
                </h2>
                <p className="text-muted">Create your account to start shopping</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#d63384' }}>
                    <i className="bi bi-person me-2"></i>Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    style={{
                      borderRadius: '15px',
                      border: '2px solid #ffc0cb',
                      padding: '12px 20px',
                      fontSize: '1.1rem'
                    }}
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#d63384' }}>
                    <i className="bi bi-envelope me-2"></i>Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control form-control-lg"
                    style={{
                      borderRadius: '15px',
                      border: '2px solid #ffc0cb',
                      padding: '12px 20px',
                      fontSize: '1.1rem'
                    }}
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#d63384' }}>
                    <i className="bi bi-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    style={{
                      borderRadius: '15px',
                      border: '2px solid #ffc0cb',
                      padding: '12px 20px',
                      fontSize: '1.1rem'
                    }}
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold" style={{ color: '#d63384' }}>
                    <i className="bi bi-phone me-2"></i>Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control form-control-lg"
                    style={{
                      borderRadius: '15px',
                      border: '2px solid #ffc0cb',
                      padding: '12px 20px',
                      fontSize: '1.1rem'
                    }}
                    placeholder="Enter your phone number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 py-3 fw-bold"
                  style={{
                    background: 'linear-gradient(135deg, #ff6b9d, #ffc0cb)',
                    border: 'none',
                    borderRadius: '15px',
                    fontSize: '1.2rem',
                    color: '#fff',
                    boxShadow: '0 8px 25px rgba(255, 107, 157, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 157, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 157, 0.4)';
                  }}
                >
                  <i className="bi bi-person-plus me-2"></i>Create Account
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="text-muted">
                  Already have an account?
                  <a href="/login" className="text-decoration-none fw-bold ms-1" style={{ color: '#d63384' }}>
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;