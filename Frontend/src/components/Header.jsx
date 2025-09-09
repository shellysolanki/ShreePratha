// import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { FaSearch, FaCartPlus, FaHeart, FaUser } from 'react-icons/fa';

// const Header = () => {
//   return (
//     <header className="sticky-top">
//       <div className="mt-0 pt-0" />
//       <nav
//         className="navbar navbar-expand-md navbar-light shadow-sm"
//         style={{ background: 'linear-gradient(to right, #ffc0cb, #fffdd0)' }}
//       >
//         <div className="container-fluid px-4">
//           {/* Logo */}
//           <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
//             <img
//               src="/logo192.png"
//               alt="MyShop"
//               className="rounded-circle border border-danger"
//               width="40"
//               height="40"
//             />
//             <span className="fw-bold fs-4 text-danger">
//               SHREE<span className="text-dark">PRATHA</span>
//             </span>
//           </Link>

//           {/* Toggle Button */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#mainNavbar"
//             aria-controls="mainNavbar"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon"></span>
//           </button>

//           {/* Menu */}
//           <div className="collapse navbar-collapse" id="mainNavbar">
//             <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-3">
//               <li className="nav-item">
//                 <Link
//                   to="/"
//                   className="nav-link fw-semibold"
//                   onClick={() => {
//                     if (window.location.pathname === '/') {
//                       window.location.reload(); // force reload if already on home
//                     }
//                   }}
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link to="/categories" className="nav-link fw-semibold">
//                   Categories
//                 </Link>
//               </li>
//               <li className="nav-item dropdown">
//                 <a
//                   className="nav-link dropdown-toggle fw-semibold"
//                   href="#"
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   Deals
//                 </a>
//                 <ul className="dropdown-menu">
//                   <li>
//                     <Link to="/deals/today" className="dropdown-item">
//                       Today's Deals
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/deals/week" className="dropdown-item">
//                       Weekly Offers
//                     </Link>
//                   </li>
//                 </ul>
//               </li>
//             </ul>

//             {/* Search + Icons */}
//             <div className="d-flex align-items-center gap-3">
//               <div className="input-group">
//                 <span className="input-group-text bg-white border-end-0">
//                   <FaSearch className="text-muted" />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control border-start-0"
//                   placeholder="Search products..."
//                 />
//               </div>
//               <Link to="/wishlist" className="text-danger fs-5" title="Wishlist">
//                 <FaHeart />
//               </Link>
//               <Link to="/cart" className="text-danger fs-5" title="Cart">
//                 <FaCartPlus />
//               </Link>
//               <Link to="/login" className="text-danger fs-5" title="Login">
//                 <FaUser />
//               </Link>

//               {/* 🆕 Registration Button with 50px left spacing */}
//               <Link
//                 to="/register/user"
//                 className="btn btn-outline-danger fw-semibold"
//                 style={{ marginLeft: '50px' }}
//               >
//                 Register
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
// // ✅ Correct


import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaSearch, FaCartPlus, FaHeart, FaUser } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getValidToken } from '../utils/auth';

const Header = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const token = getValidToken();
  const { wishlistCount } = useWishlist();
  const { count: cartCount } = useCart();

  let isAdmin = false;
  try {
    if (token) {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === 'admin';
    }
  } catch {}

  return (
    <header className="sticky-top">
      <div className="mt-0 pt-0" />
      <nav
        className="navbar navbar-expand-md navbar-light shadow-sm"
        style={{ background: 'linear-gradient(to right, #ffc0cb, #fffdd0)' }}
      >
        <div className="container-fluid px-4">
          {/* Logo */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
            <img
              src="/image/splogo.png"
              // alt="MyShop"
              className="rounded-circle border border-danger"
              width="40"
              height="40"
            />
            <span className="fw-bold fs-4 text-danger">
              SHREE<span className="text-dark">PRATHA</span>
            </span>
          </Link>

          {/* Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-3">
              <li className="nav-item">
                <Link
                  to="/"
                  className="nav-link fw-semibold"
                  onClick={() => {
                    if (window.location.pathname === '/') {
                      window.location.reload();
                    }
                  }}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/categories" className="nav-link fw-semibold">
                  Categories
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link fw-semibold">
                  About
                </Link>
              </li>
            </ul>

            {/* Search + Icons */}
            <div className="d-flex align-items-center gap-3">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search categories: jewellery, cosmetics, bags, lingerie"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = searchText.trim().toLowerCase();
                      navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
                    }
                  }}
                />
              </div>
              <Link to="/wishlist" className="text-danger fs-5 position-relative" title="Wishlist">
                <FaHeart />
                {wishlistCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.6rem', minWidth: '18px', height: '18px' }}
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" className="text-danger fs-5 position-relative" title="Cart">
                <FaCartPlus />
                {cartCount > 0 && (
                  <span 
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: '0.6rem', minWidth: '18px', height: '18px' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
              {token && (
                <Link to="/account" className="btn btn-outline-danger fw-semibold" style={{ marginLeft: '10px' }} title="Dashboard">
                  Dashboard
                </Link>
              )}
              {!token && (
                <Link to="/login" className="text-danger fs-5" title="Login">
                  <FaUser />
                </Link>
              )}

              {/* 🆕 Registration Button */}
              {!token && (
                <Link
                  to="/register/user"
                  className="btn btn-outline-danger fw-semibold"
                  style={{ marginLeft: '50px' }}
                >
                  Register
                </Link>
              )}
              {/* ✅ Admin Panel Button (only for admin) */}
              {isAdmin && (
                <button
                  className="btn btn-outline-danger fw-semibold"
                  style={{ marginLeft: '50px' }}
                  onClick={() => navigate('/admin/dashboard')}
                >
                  Admin
                </button>
              )}

              {token && (
                <button
                  className="btn btn-danger fw-semibold ms-2"
                  onClick={async () => {
                    const res = await Swal.fire({
                      title: 'Logout?',
                      text: 'Are you sure you want to logout?',
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonText: 'Yes, logout',
                      cancelButtonText: 'Cancel'
                    });
                    if (res.isConfirmed) {
                      localStorage.removeItem('token');
                      localStorage.removeItem('userData');
                      navigate('/Categories');
                    }
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;