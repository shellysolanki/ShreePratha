// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AddJewelForm from './AddJewel';
// import JewelCard from '../components/JewelCard';
// import AddMakeup from './AddMakeup';
// import MakeupCard from '../components/MakeupCard';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const bgCream = '#fffaf0';
//   const pink = '#ffc0cb';

//   const [activeSection, setActiveSection] = useState(null);
//   const [jewelleryList, setJewelleryList] = useState([]);
//   const [makeupList, setMakeupList] = useState([]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/admin/login');
//   };

//   const fetchJewels = async () => {
//     try {
//       const res = await fetch('https://shreepratha.onrender.com/jewellery/all');
//       const data = await res.json();
//       setJewelleryList(data);
//     } catch (err) {
//       console.error('Failed to fetch jewellery:', err.message);
//     }
//   };

//   const fetchMakeup = async () => {
//     try {
//       const res = await fetch('https://shreepratha.onrender.com/makeup/all');
//       if (!res.ok) throw new Error('Failed to fetch makeup');
//       const data = await res.json();
//       setMakeupList(data);
//     } catch (err) {
//       console.error('Failed to fetch makeup:', err.message);
//     }
//   };

//   useEffect(() => {
//     fetchJewels();
//     fetchMakeup();
//   }, []);

//   const handleDelete = (id) => {
//     setJewelleryList(prev => prev.filter(item => item._id !== id));
//   };

//   const handleMakeupDelete = (id) => {
//     setMakeupList(prev => prev.filter(item => item._id !== id));
//   };

//   return (
//     <div className="container-fluid py-4 flex-grow-1" style={{ backgroundColor: bgCream }}>
//       <div className="text-center py-3" style={{ backgroundColor: '#f5efef', fontWeight: 'bold', fontSize: '1.5rem' }}>
//         🛍️ Admin Dashboard
//       </div>

//       <div className="text-center mb-4">
//         <button className="btn btn-danger btn-sm" onClick={handleLogout}>
//           Logout
//         </button>
//       </div>

//       <div className="container py-4 flex-grow-1">
//         <h3 className="mb-4">Manage Your Collections</h3>
//         <div className="row g-4">

//           {/* Cosmetics Section */}
//           <div className="col-12">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title">Cosmetics</h5>
//                 <p className="card-text">Update your makeup and skincare items.</p>
//                 <button
//                   className="btn btn-outline-dark btn-sm"
//                   onClick={() => setActiveSection(activeSection === 'cosmetics' ? null : 'cosmetics')}
//                 >
//                   {activeSection === 'cosmetics' ? 'Close' : 'Manage'}
//                 </button>

//                 {activeSection === 'cosmetics' && (
//                   <div className="mt-4">
//                     <AddMakeup onSuccess={fetchMakeup} />

//                     <div className="row mt-4">
//                       {makeupList.length === 0 ? (
//                         <p className="text-muted text-center">No makeup items found.</p>
//                       ) : (
//                         makeupList.map(item => (
//                           <div className="col-6 col-md-4 col-lg-3" key={item._id}>
//                             <MakeupCard item={item} onDelete={handleMakeupDelete} isAdmin={true} />
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Jewellery Section */}
//           <div className="col-12">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title">Jewellery</h5>
//                 <p className="card-text">Add or manage jewellery items.</p>
//                 <button
//                   className="btn btn-outline-dark btn-sm"
//                   onClick={() => setActiveSection(activeSection === 'jewellery' ? null : 'jewellery')}
//                 >
//                   {activeSection === 'jewellery' ? 'Close' : 'Manage'}
//                 </button>

//                 {activeSection === 'jewellery' && (
//                   <div className="mt-4">
//                     <AddJewelForm onSuccess={fetchJewels} />

//                     <div className="row mt-4">
//                       {jewelleryList.length === 0 ? (
//                         <p className="text-muted text-center">No jewellery items found.</p>
//                       ) : (
//                         jewelleryList.map(item => (
//                           <div className="col-6 col-md-4 col-lg-3" key={item._id}>
//                             <JewelCard item={item} onDelete={handleDelete} isAdmin={true} />
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Placeholder Sections */}
//           <div className="col-6 col-lg-3 mb-4">
//             <div className="card shadow-sm h-100">
//               <div className="card-body text-center">
//                 <h5 className="card-title">Inner</h5>
//                 <p className="card-text">Control your innerwear collection.</p>
//                 <button className="btn btn-outline-dark btn-sm">Manage</button>
//               </div>
//             </div>
//           </div>

//           <div className="col-6 col-lg-3 mb-4">
//             <div className="card shadow-sm h-100">
//               <div className="card-body text-center">
//                 <h5 className="card-title">Bags</h5>
//                 <p className="card-text">Organize your bags inventory.</p>
//                 <button className="btn btn-outline-dark btn-sm">Manage</button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//       <div className="text-center py-3" style={{ backgroundColor: pink, fontWeight: 'bold' }}>
//         © 2025 Your Brand • Admin Panel
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddJewelForm from './AddJewel';
import JewelCard from '../components/JewelCard';
import AddMakeup from './AddMakeup';
import MakeupCard from '../components/MakeupCard';
import AddBag from './AddBag';
import BagCard from '../components/BagCard';
import AddLingerie from './AddLingerie';
import InnerCard from '../components/InnerCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { confirm, toastSuccess, toastError } from '../utils/notify';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const bgGradient = 'linear-gradient(135deg, #ffc0cb 0%, #fffdd0 50%, #ffb6c1 100%)';
  const pink = '#ffc0cb';

  const [activeSection, setActiveSection] = useState(null);
  const [jewelleryList, setJewelleryList] = useState([]);
  const [makeupList, setMakeupList] = useState([]);
  const [bagList, setBagList] = useState([]);
  const [lingerieList, setLingerieList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');


  const handleLogout = async () => {
    const ok = await confirm({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      confirmButtonText: 'Logout'
    });
    if (!ok) return;
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/Categories');
  };

  const fetchJewels = async () => {
    try {
      const res = await fetch('https://shreepratha.onrender.com/jewellery/all');
      const data = await res.json();
      setJewelleryList(data);
    } catch (err) {
      console.error('Failed to fetch jewellery:', err.message);
    }
  };

  const fetchMakeup = async () => {
    try {
      const res = await fetch('https://shreepratha.onrender.com/makeup/all');
      if (!res.ok) throw new Error('Failed to fetch makeup');
      const data = await res.json();
      setMakeupList(data);
    } catch (err) {
      console.error('Failed to fetch makeup:', err.message);
    }
  };

  const fetchBags = async () => {
    try {
      const res = await fetch('https://shreepratha.onrender.com/bag/');
      if (!res.ok) throw new Error('Failed to fetch bags');
      const data = await res.json();
      setBagList(data);
    } catch (err) {
      console.error('Failed to fetch bags:', err.message);
    }
  };

  const fetchLingerie = async () => {
    try {
      const res = await fetch('https://shreepratha.onrender.com/inner/');
      if (!res.ok) throw new Error('Failed to fetch lingerie');
      const data = await res.json();
      setLingerieList(data);
    } catch (err) {
      console.error('Failed to fetch lingerie:', err.message);
    }
  };

  useEffect(() => {
    fetchJewels();
    fetchMakeup();
    fetchBags();
    fetchLingerie();
  }, []);

  const handleDelete = (id) => {
    setJewelleryList(prev => prev.filter(item => item._id !== id));
  };

  const handleMakeupDelete = (id) => {
    setMakeupList(prev => prev.filter(item => item._id !== id));
  };

  const handleBagDelete = (id) => {
    setBagList(prev => prev.filter(item => item._id !== id));
  };

  const handleLingerieDelete = (id) => {
    setLingerieList(prev => prev.filter(item => item._id !== id));
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('https://shreepratha.onrender.com/admin/user-summary');
      const data = await res.json();
      setUserList(data.userDetails || []);
    } catch (err) {
      console.error('Failed to fetch users:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };


  const showUserDetails = (user) => {
    setSelectedUser(user);
  };

  const handleSort = (field) => {
    console.log('Sorting by:', field, 'Current direction:', sortDirection);
    if (sortField === field) {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      console.log('Toggling direction to:', newDirection);
    } else {
      setSortField(field);
      setSortDirection('asc');
      console.log('New field:', field, 'Direction: asc');
    }
  };

  const getSortedUsers = () => {
    if (!userList || userList.length === 0) return [];
    
    return [...userList].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (sortField === 'name' || sortField === 'email') {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      } else if (sortField === 'totalSpent' || sortField === 'orders' || sortField === 'totalProductsBought') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      } else if (sortField === 'createdAt' || sortField === 'lastOrderDate') {
        aValue = new Date(aValue || new Date(0));
        bValue = new Date(bValue || new Date(0));
      }

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      let result = 0;
      if (aValue < bValue) result = -1;
      else if (aValue > bValue) result = 1;
      else result = 0;

      return sortDirection === 'asc' ? result : -result;
    });
  };

  const getSortableHeaderStyle = (field) => ({
    cursor: 'pointer',
    userSelect: 'none',
    backgroundColor: sortField === field ? '#e3f2fd' : '',
    transition: 'background-color 0.2s'
  });

  const handleHeaderMouseEnter = (e) => {
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleHeaderMouseLeave = (e, field) => {
    e.target.style.backgroundColor = sortField === field ? '#e3f2fd' : '';
  };

  const handleDeleteUser = async (userId) => {
    const ok = await confirm({
      title: 'Delete user?',
      text: 'This action cannot be undone.',
      confirmButtonText: 'Delete'
    });
    if (!ok) return;
    try {
      const res = await fetch(`https://shreepratha.onrender.com/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        setUserList(prev => prev.filter(user => user.userId !== userId));
        toastSuccess('User deleted successfully');
      } else {
        toastError('Failed to delete user');
      }
    } catch (err) {
      console.error('Failed to delete user:', err.message);
      toastError('Failed to delete user');
    }
  };

  return (
    <div className="container-fluid py-4 flex-grow-1" style={{ background: bgGradient, minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="text-center py-4 mb-4">
        <div className="d-inline-block p-4 rounded-4" style={{ 
          background: 'linear-gradient(135deg, #ff6b9d, #ffc0cb, #ffd700)', 
          boxShadow: '0 8px 32px rgba(255, 107, 157, 0.3)',
          border: '2px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 className="mb-2" style={{ 
            color: '#fff', 
            fontWeight: 'bold', 
            fontSize: '2.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🛍️ Admin Dashboard
          </h1>
          <p className="mb-0" style={{ color: '#fff', fontSize: '1.1rem', opacity: 0.9 }}>
            Manage your collections and oversee the platform
          </p>
        </div>

        {/* Admin Logout button (styled) */}
        <div className="mt-3 d-flex justify-content-center">
          <button 
            className="btn btn-lg px-4 py-2 rounded-pill"
            onClick={handleLogout}
            style={{ 
              background: 'linear-gradient(45deg, #dc3545, #ff6b9d)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 6px 18px rgba(220, 53, 69, 0.35)',
              fontWeight: 'bold',
              letterSpacing: '0.3px'
            }}
            title="Logout from admin"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="container py-4 flex-grow-1">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold" style={{ 
            color: '#d63384',
            textShadow: '2px 2px 4px rgba(255, 192, 203, 0.5)'
          }}>
            Manage Your Collections
          </h2>
          <p className="lead" style={{ color: '#6c757d' }}>
            Add, edit, and manage products across all categories
          </p>
        </div>
        <div className="row g-4">

          {/* Cosmetics Section */}
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #fff5f8 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 107, 157, 0.1)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3" style={{ fontSize: '2rem' }}>💄</div>
                  <div>
                    <h5 className="card-title mb-1 fw-bold" style={{ color: '#d63384' }}>Cosmetics</h5>
                    <p className="card-text mb-0 text-muted">Update your makeup and skincare items</p>
                  </div>
                </div>
                <button
                  className="btn btn-outline-danger btn-lg px-4 py-2 rounded-pill fw-bold"
                  onClick={() => setActiveSection(activeSection === 'cosmetics' ? null : 'cosmetics')}
                  style={{ 
                    borderWidth: '2px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {activeSection === 'cosmetics' ? '❌ Close' : '✨ Manage'}
                </button>

                {activeSection === 'cosmetics' && (
                  <div className="mt-4">
                    <AddMakeup onSuccess={fetchMakeup} />

                    <div className="row mt-4">
                      {makeupList.length === 0 ? (
                        <p className="text-muted text-center">No makeup items found.</p>
                      ) : (
                        makeupList.map(item => (
                          <div className="col-6 col-md-4 col-lg-3" key={item._id}>
                            <MakeupCard item={item} onDelete={handleMakeupDelete} isAdmin={true} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Jewellery Section */}
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #fffef7 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(212, 175, 55, 0.1)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3" style={{ fontSize: '2rem' }}>💎</div>
                  <div>
                    <h5 className="card-title mb-1 fw-bold" style={{ color: '#d4af37' }}>Jewellery</h5>
                    <p className="card-text mb-0 text-muted">Add or manage jewellery items</p>
                  </div>
                </div>
                <button
                  className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill fw-bold"
                  onClick={() => setActiveSection(activeSection === 'jewellery' ? null : 'jewellery')}
                  style={{ 
                    borderWidth: '2px',
                    transition: 'all 0.3s ease',
                    color: '#d4af37',
                    borderColor: '#d4af37'
                  }}
                >
                  {activeSection === 'jewellery' ? '❌ Close' : '✨ Manage'}
                </button>

                {activeSection === 'jewellery' && (
                  <div className="mt-4">
                    <AddJewelForm onSuccess={fetchJewels} />

                    <div className="row mt-4">
                      {jewelleryList.length === 0 ? (
                        <p className="text-muted text-center">No jewellery items found.</p>
                      ) : (
                        jewelleryList.map(item => (
                          <div className="col-6 col-md-4 col-lg-3" key={item._id}>
                            <JewelCard item={item} onDelete={handleDelete} isAdmin={true} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bags Section */}
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #f5f1eb 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(139, 69, 19, 0.1)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3" style={{ fontSize: '2rem' }}>👜</div>
                  <div>
                    <h5 className="card-title mb-1 fw-bold" style={{ color: '#8b4513' }}>Bags</h5>
                    <p className="card-text mb-0 text-muted">Add or manage bag items</p>
                  </div>
                </div>
                <button
                  className="btn btn-outline-secondary btn-lg px-4 py-2 rounded-pill fw-bold"
                  onClick={() => setActiveSection(activeSection === 'bags' ? null : 'bags')}
                  style={{ 
                    borderWidth: '2px',
                    transition: 'all 0.3s ease',
                    color: '#8b4513',
                    borderColor: '#8b4513'
                  }}
                >
                  {activeSection === 'bags' ? '❌ Close' : '✨ Manage'}
                </button>

                {activeSection === 'bags' && (
                  <div className="mt-4">
                    <AddBag onSuccess={fetchBags} />

                    <div className="row mt-4">
                      {bagList.length === 0 ? (
                        <p className="text-muted text-center">No bag items found.</p>
                      ) : (
                        bagList.map(item => (
                          <div className="col-6 col-md-4 col-lg-3" key={item._id}>
                            <BagCard item={item} onDelete={handleBagDelete} isAdmin={true} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lingerie Section */}
          <div className="col-12">
            <div className="card shadow-lg border-0" style={{ 
              background: 'linear-gradient(135deg, #fff 0%, #fff0f5 100%)',
              borderRadius: '20px',
              border: '2px solid rgba(255, 105, 180, 0.1)'
            }}>
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3" style={{ fontSize: '2rem' }}>💕</div>
                  <div>
                    <h5 className="card-title mb-1 fw-bold" style={{ color: '#ff69b4' }}>Lingerie</h5>
                    <p className="card-text mb-0 text-muted">Add or manage lingerie items</p>
                  </div>
                </div>
                <button
                  className="btn btn-outline-info btn-lg px-4 py-2 rounded-pill fw-bold"
                  onClick={() => setActiveSection(activeSection === 'lingerie' ? null : 'lingerie')}
                  style={{ 
                    borderWidth: '2px',
                    transition: 'all 0.3s ease',
                    color: '#ff69b4',
                    borderColor: '#ff69b4'
                  }}
                >
                  {activeSection === 'lingerie' ? '❌ Close' : '✨ Manage'}
                </button>

                {activeSection === 'lingerie' && (
                  <div className="mt-4">
                    <AddLingerie onSuccess={fetchLingerie} />

                    <div className="row mt-4">
                      {lingerieList.length === 0 ? (
                        <p className="text-muted text-center">No lingerie items found.</p>
                      ) : (
                        lingerieList.map(item => (
                          <div className="col-6 col-md-4 col-lg-3" key={item._id}>
                            <InnerCard item={item} onDelete={handleLingerieDelete} isAdmin={true} />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* User List Section */}
<div className="col-12">
  <div className="card shadow-lg border-0" style={{ 
    background: 'linear-gradient(135deg, #fff 0%, #f0f8ff 100%)',
    borderRadius: '20px',
    border: '2px solid rgba(0, 123, 255, 0.1)'
  }}>
    <div className="card-body p-4">
      <div className="d-flex align-items-center mb-3">
        <div className="me-3" style={{ fontSize: '2rem' }}>👥</div>
        <div>
          <h5 className="card-title mb-1 fw-bold" style={{ color: '#007bff' }}>Users</h5>
          <p className="card-text mb-0 text-muted">View registered users and their purchase stats</p>
        </div>
      </div>
      <button
        className="btn btn-outline-primary btn-lg px-4 py-2 rounded-pill fw-bold"
        onClick={() => {
          if (activeSection !== 'users') fetchUsers();
          setActiveSection(activeSection === 'users' ? null : 'users');
        }}
        style={{ 
          borderWidth: '2px',
          transition: 'all 0.3s ease'
        }}
      >
        {activeSection === 'users' ? '❌ Close' : '👥 List Users'}
      </button>

      {activeSection === 'users' && (
        <div className="mt-4">
          {loadingUsers ? (
            <p className="text-muted text-center">Loading users...</p>
          ) : userList.length === 0 ? (
            <p className="text-muted text-center">No users found.</p>
          ) : (
            <>
              {/* Analytics Summary Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Users</h5>
                      <h3>{userList.length}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Revenue</h5>
                      <h3>₹{userList.reduce((sum, user) => sum + (user.totalSpent || 0), 0)}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <h5 className="card-title">Today's Orders</h5>
                      <h3>{userList.reduce((sum, user) => sum + (user.todayOrders || 0), 0)}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <h5 className="card-title">Today's Revenue</h5>
                      <h3>₹{userList.reduce((sum, user) => sum + (user.todaySpent || 0), 0)}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort Instructions */}
              <div className="alert alert-info mb-3">
                <small>
                  <strong>💡 Tip:</strong> Click on column headers to sort users. 
                  <span className="ms-2">
                    <span className="badge bg-primary me-1">
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>↑</span> Ascending
                    </span>
                    <span className="badge bg-secondary">
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>↓</span> Descending
                    </span>
                  </span>
                </small>
              </div>

              {/* Detailed User Table */}
              <div className="table-responsive">
                <table className="table table-bordered table-sm">
                  <thead className="table-light">
                    <tr>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('name')}
                        style={getSortableHeaderStyle('name')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'name')}
                      >
                        Name {sortField === 'name' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('email')}
                        style={getSortableHeaderStyle('email')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'email')}
                      >
                        Contact {sortField === 'email' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Role</th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('orders')}
                        style={getSortableHeaderStyle('orders')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'orders')}
                      >
                        Total Orders {sortField === 'orders' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('totalSpent')}
                        style={getSortableHeaderStyle('totalSpent')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'totalSpent')}
                      >
                        Total Spent {sortField === 'totalSpent' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('totalProductsBought')}
                        style={getSortableHeaderStyle('totalProductsBought')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'totalProductsBought')}
                      >
                        Products Bought {sortField === 'totalProductsBought' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Today's Activity</th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('lastOrderDate')}
                        style={getSortableHeaderStyle('lastOrderDate')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'lastOrderDate')}
                      >
                        Last Order {sortField === 'lastOrderDate' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('createdAt')}
                        style={getSortableHeaderStyle('createdAt')}
                        onMouseEnter={handleHeaderMouseEnter}
                        onMouseLeave={(e) => handleHeaderMouseLeave(e, 'createdAt')}
                      >
                        Joined {sortField === 'createdAt' && (
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedUsers().map(user => (
                      <tr key={user.userId}>
                        <td>
                          <strong>{user.name}</strong>
                          <br />
                          <small className="text-muted">ID: {user.userId.slice(-8)}</small>
                        </td>
                        <td>
                          <div>
                            <strong>📧 {user.email}</strong>
                            <br />
                            <small>📱 {user.phone}</small>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-info">{user.orders || 0}</span>
                        </td>
                        <td>
                          <strong className="text-success">₹{user.totalSpent || 0}</strong>
                        </td>
                        <td>
                          <span className="badge bg-secondary">{user.totalProductsBought || 0}</span>
                        </td>
                        <td>
                          <div className="small">
                            <div>Orders: <span className="badge bg-warning">{user.todayOrders || 0}</span></div>
                            <div>Spent: <span className="text-success">₹{user.todaySpent || 0}</span></div>
                            <div>Products: <span className="badge bg-info">{user.todayProducts || 0}</span></div>
                          </div>
                        </td>
                        <td>
                          {user.lastOrderDate ? (
                            <small>{new Date(user.lastOrderDate).toLocaleDateString()}</small>
                          ) : (
                            <small className="text-muted">No orders</small>
                          )}
                        </td>
                        <td>
                          <small>{new Date(user.createdAt).toLocaleDateString()}</small>
                        </td>
                        <td>
                          <div className="btn-group-vertical btn-group-sm">
                            <button 
                              className="btn btn-outline-primary btn-sm mb-1"
                              onClick={() => showUserDetails(user)}
                              title="View Details"
                            >
                              📊 Details
                            </button>
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteUser(user.userId)}
                              disabled={user.role === 'admin'}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* User Details Modal */}
              {selectedUser && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                  <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">📊 User Details - {selectedUser.name}</h5>
                        <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>👤 Personal Information</h6>
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Role:</strong> <span className={`badge ${selectedUser.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>{selectedUser.role}</span></p>
                            <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="col-md-6">
                            <h6>📈 Purchase Statistics</h6>
                            <p><strong>Total Orders:</strong> {selectedUser.orders || 0}</p>
                            <p><strong>Total Spent:</strong> ₹{selectedUser.totalSpent || 0}</p>
                            <p><strong>Products Bought:</strong> {selectedUser.totalProductsBought || 0}</p>
                            <p><strong>First Order:</strong> {selectedUser.firstOrderDate ? new Date(selectedUser.firstOrderDate).toLocaleDateString() : 'No orders'}</p>
                            <p><strong>Last Order:</strong> {selectedUser.lastOrderDate ? new Date(selectedUser.lastOrderDate).toLocaleDateString() : 'No orders'}</p>
                          </div>
                        </div>
                        
                        {selectedUser.products && selectedUser.products.length > 0 && (
                          <div className="mt-4">
                            <h6>🛍️ Purchase History</h6>
                            <div className="table-responsive">
                              <table className="table table-sm">
                                <thead>
                                  <tr>
                                    <th>Product Type</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Order Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {selectedUser.products.map((product, index) => (
                                    <tr key={index}>
                                      <td><span className="badge bg-info">{product.productType}</span></td>
                                      <td>{product.quantity}</td>
                                      <td>₹{product.price}</td>
                                      <td>{new Date(product.orderDate).toLocaleDateString()}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  </div>
 </div>


      {/* Footer */}
      <div className="text-center py-4 mt-5">
        <div className="d-inline-block p-3 rounded-4" style={{ 
          background: 'linear-gradient(135deg, #ffc0cb, #fffdd0, #ffb6c1)', 
          boxShadow: '0 4px 20px rgba(255, 192, 203, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <p className="mb-0 fw-bold" style={{ color: '#d63384', fontSize: '1.1rem' }}>
            © 2025 Your Brand • Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
