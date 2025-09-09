import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toastError, toastInfo, toastSuccess } from '../utils/notify';
import ProductReviews from '../components/ProductReviews';
import FeedbackForm from '../components/FeedbackForm';
import StarRating from '../components/StarRating';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', phone: '', avatar: '' });
  const [myReviews, setMyReviews] = useState([]);
  const [summary, setSummary] = useState({ totalOrders: 0, totalSpent: 0 });
  const [purchases, setPurchases] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      toastError('Please login to access your account');
      navigate('/login');
      return;
    }
    
    // Function to load user data
    const loadUserData = async () => {
      try {
        // Try to load user data from localStorage first (for Google users)
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            console.log('Using stored user data:', userData);
            setUser(userData);
          } catch (err) {
            console.error('Error parsing stored user data:', err);
          }
        }
        
        // Load user info from API
        const response = await fetch('http://localhost:5000/users/me', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await response.json();
        
        console.log('User data response:', data);
        if (data.success && data.user) {
          setUser(data.user);
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(data.user));
        } else {
          console.error('User data not found in response:', data);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        toastError('Failed to load user data');
      }
    };

    loadUserData();

    fetch('http://localhost:5000/review/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setMyReviews(d.reviews || []))
      .catch(() => {});

    fetch('http://localhost:5000/payment/me/summary', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setSummary({ totalOrders: d.totalOrders || 0, totalSpent: d.totalSpent || 0 }))
      .catch(() => {});

    fetch('http://localhost:5000/payment/me/list', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setPurchases(d.items || []))
      .catch(() => {});
  }, [token, navigate]);

  const saveProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/users/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone
        })
      });
      const data = await res.json();
      if (res.ok) {
        toastSuccess('Profile updated successfully!');
        setUser(data.user || user);
        setIsEditing(false);
        setProfileImage(null);
      } else {
        toastError(data?.message || 'Update failed');
      }
    } catch { 
      toastError('Update failed'); 
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toastError('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      // Preview the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setUser({...user, avatar: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  const refreshUserData = async () => {
    try {
      const res = await fetch('http://localhost:5000/users/me', { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const data = await res.json();
      console.log('Refreshed user data:', data);
      
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('userData', JSON.stringify(data.user));
        toastSuccess('User data refreshed successfully!');
      } else {
        toastError('Failed to refresh user data');
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      toastError('Failed to refresh user data');
    }
  };

  // Get display name from user data or Google profile
  const getDisplayName = () => {
    if (user.name && user.name.trim()) {
      return user.name;
    }
    // Try to get from localStorage as fallback
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.name && parsedData.name.trim()) {
          return parsedData.name;
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    }
    return 'User';
  };

  // Get display email from user data or Google profile
  const getDisplayEmail = () => {
    if (user.email && user.email.trim()) {
      return user.email;
    }
    // Try to get from localStorage as fallback
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.email && parsedData.email.trim()) {
          return parsedData.email;
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    }
    return 'your.email@example.com';
  };

  // Get display avatar from user data or Google profile
  const getDisplayAvatar = () => {
    if (user.avatar && user.avatar.trim()) {
      return user.avatar;
    }
    // Try to get from localStorage as fallback
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
        if (parsedData.avatar && parsedData.avatar.trim()) {
          return parsedData.avatar;
        }
      } catch (err) {
        console.error('Error parsing stored user data:', err);
      }
    }
    return '/image/splogo.png';
  };

  // Extract human-readable product titles for an order, tolerating different API shapes
  const getOrderItemTitles = (order) => {
    try {
      // Common shapes we may receive
      const productsA = order.products; // [{ title }]
      const itemsB = order.items;       // [{ title } or { product: { title } }]
      const linesC = order.lineItems;   // Stripe-style

      const titles = [];
      if (Array.isArray(productsA)) {
        productsA.forEach(p => p?.title && titles.push(p.title));
      }
      if (Array.isArray(itemsB)) {
        itemsB.forEach(i => {
          if (i?.title) titles.push(i.title);
          else if (i?.product?.title) titles.push(i.product.title);
        });
      }
      if (Array.isArray(linesC)) {
        linesC.forEach(l => l?.name && titles.push(l.name));
      }
      // Fallback: show one generic item if nothing available
      return titles.length ? titles.slice(0, 4).join(', ') + (titles.length > 4 ? ' …' : '') : 'Items unavailable';
    } catch {
      return 'Items unavailable';
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #ffc0cb 0%, #fffdd0 50%, #ffb6c1 100%)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
    <div className="container py-4">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 style={{ 
            color: '#d63384', 
            fontWeight: 'bold', 
            fontSize: '2.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '10px'
          }}>
            👋 Welcome Back, {getDisplayName()}!
          </h1>
          <p style={{ color: '#6c757d', fontSize: '1.2rem' }}>
            Manage your account, track orders, and share your feedback
          </p>
        </div>

        <div className="row g-4">
          {/* Profile Card */}
          <div className="col-12 col-lg-4">
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              height: '100%'
            }}>
              <div className="text-center mb-4">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={getDisplayAvatar()}
                    alt="Profile"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '4px solid #ff69b4',
                      boxShadow: '0 8px 25px rgba(255, 105, 180, 0.3)'
                    }}
                  />
                  <label style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: '#ff69b4',
                    color: 'white',
                    borderRadius: '50%',
                    width: '35px',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)'
                  }}>
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                <h4 style={{ color: '#d63384', marginTop: '15px', fontWeight: 'bold' }}>
                  {getDisplayName()}
                </h4>
                <p style={{ color: '#6c757d', margin: '0' }}>
                  {getDisplayEmail()}
                </p>
                {user.avatar && user.avatar.includes('googleusercontent.com') && (
                  <div style={{
                    marginTop: '8px',
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #4285f4, #34a853)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    🔗 Google Account
                  </div>
                )}
              </div>

              {/* Stats Cards */}
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div style={{
                    background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(255, 105, 180, 0.3)'
                  }}>
                    <h3 style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold' }}>
                      {summary.totalOrders}
                    </h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Orders</p>
                  </div>
              </div>
                <div className="col-6">
                  <div style={{
                    background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    boxShadow: '0 5px 15px rgba(78, 205, 196, 0.3)'
                  }}>
                    <h3 style={{ margin: '0', fontSize: '1.8rem', fontWeight: 'bold' }}>
                      ₹{summary.totalSpent}
                    </h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Spent</p>
            </div>
          </div>
        </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  background: isEditing ? 'linear-gradient(135deg, #e74c3c, #c0392b)' : 'linear-gradient(135deg, #ff69b4, #ff1493)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 30px',
                  fontWeight: 'bold',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 15px rgba(255, 105, 180, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(255, 105, 180, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 5px 15px rgba(255, 105, 180, 0.3)';
                }}
              >
                {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-12 col-lg-8">
            {/* Profile Details Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              marginBottom: '25px'
            }}>
              <h4 style={{ color: '#d63384', fontWeight: 'bold', marginBottom: '20px' }}>
                📝 My Details
              </h4>
              
              {isEditing ? (
                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={{ color: '#6c757d', fontWeight: 'bold', marginBottom: '5px' }}>Name</label>
                    <input 
                      className="form-control" 
                      placeholder="Enter your name" 
                      value={user.name || ''} 
                      onChange={e => setUser({...user, name: e.target.value})}
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #ff69b4',
                        padding: '12px 15px'
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={{ color: '#6c757d', fontWeight: 'bold', marginBottom: '5px' }}>Email</label>
                    <input 
                      className="form-control" 
                      placeholder="Enter your email" 
                      value={user.email || ''} 
                      onChange={e => setUser({...user, email: e.target.value})}
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #ff69b4',
                        padding: '12px 15px'
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label style={{ color: '#6c757d', fontWeight: 'bold', marginBottom: '5px' }}>Phone</label>
                    <input 
                      className="form-control" 
                      placeholder="Enter your phone" 
                      value={user.phone || ''} 
                      onChange={e => setUser({...user, phone: e.target.value})}
                      style={{
                        borderRadius: '10px',
                        border: '2px solid #ff69b4',
                        padding: '12px 15px'
                      }}
                    />
                  </div>
        <div className="col-12">
                    <button 
                      onClick={saveProfile}
                      style={{
                        background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '25px',
                        padding: '12px 30px',
                        fontWeight: 'bold',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 5px 15px rgba(39, 174, 96, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(39, 174, 96, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 5px 15px rgba(39, 174, 96, 0.3)';
                      }}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  <div className="col-md-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 5px 15px rgba(255, 105, 180, 0.3)'
                    }}>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>👤 Name</h5>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{getDisplayName()}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 5px 15px rgba(78, 205, 196, 0.3)'
                    }}>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>📧 Email</h5>
                      <p style={{ margin: '0', fontWeight: 'bold', fontSize: '0.9rem' }}>{getDisplayEmail()}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div style={{
                      background: 'linear-gradient(135deg, #f39c12, #e67e22)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '15px',
                      textAlign: 'center',
                      boxShadow: '0 5px 15px rgba(243, 156, 18, 0.3)'
                    }}>
                      <h5 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>📱 Phone</h5>
                      <p style={{ margin: '0', fontWeight: 'bold' }}>{user.phone || 'Not set'}</p>
            </div>
          </div>
                </div>
              )}
            </div>

            {/* Feedback Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              marginBottom: '25px'
            }}>
              <h4 style={{ color: '#d63384', fontWeight: 'bold', marginBottom: '20px' }}>
                💬 Write App Feedback
              </h4>
              <FeedbackForm />
        </div>

            {/* Purchases Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              marginBottom: '25px'
            }}>
              <h4 style={{ color: '#d63384', fontWeight: 'bold', marginBottom: '20px' }}>
                🛍️ My Purchases
              </h4>
              {purchases.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🛒</div>
                  <p style={{ fontSize: '1.1rem', margin: '0' }}>No purchases found. Start shopping to see your orders here!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{
                      background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                      color: 'white'
                    }}>
                      <tr>
                        <th style={{ border: 'none', padding: '15px' }}>Order ID</th>
                        <th style={{ border: 'none', padding: '15px' }}>Items</th>
                        <th style={{ border: 'none', padding: '15px' }}>Amount</th>
                        <th style={{ border: 'none', padding: '15px' }}>Method</th>
                        <th style={{ border: 'none', padding: '15px' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {purchases.map(p => (
                        <tr key={p._id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                          <td style={{ padding: '15px', fontWeight: 'bold', color: '#495057' }}>
                            {p.orderId}
                          </td>
                          <td style={{ padding: '15px', color: '#6c757d', maxWidth: '260px' }}>
                            {getOrderItemTitles(p)}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                              color: 'white',
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontWeight: 'bold'
                            }}>
                              ₹{p.amount}
                            </span>
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              background: 'linear-gradient(135deg, #3498db, #2980b9)',
                              color: 'white',
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontWeight: 'bold'
                            }}>
                              {p.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#6c757d' }}>
                            {new Date(p.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
        </div>

            {/* Reviews Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 192, 203, 0.3)'
            }}>
              <h4 style={{ color: '#d63384', fontWeight: 'bold', marginBottom: '20px' }}>
                ⭐ My Reviews
              </h4>
              {myReviews.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⭐</div>
                  <p style={{ fontSize: '1.1rem', margin: '0' }}>You haven't written any reviews yet. Share your experience!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{
                      background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                      color: 'white'
                    }}>
                      <tr>
                        <th style={{ border: 'none', padding: '15px' }}>Rating</th>
                        <th style={{ border: 'none', padding: '15px' }}>Comment</th>
                        <th style={{ border: 'none', padding: '15px' }}>Status</th>
                        <th style={{ border: 'none', padding: '15px' }}>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myReviews.map(r => (
                        <tr key={r._id} style={{ borderBottom: '1px solid #f8f9fa' }}>
                          <td style={{ padding: '15px' }}>
                            <StarRating rating={r.rating} readOnly={true} />
                          </td>
                          <td style={{ padding: '15px', maxWidth: '300px', color: '#495057' }}>
                            {r.comment || '-'}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <span style={{
                              background: r.approved ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #95a5a6, #7f8c8d)',
                              color: 'white',
                              padding: '5px 15px',
                              borderRadius: '20px',
                              fontWeight: 'bold'
                            }}>
                              {r.approved ? '✅ Approved' : '⏳ Pending'}
                            </span>
                          </td>
                          <td style={{ padding: '15px', color: '#6c757d' }}>
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
