import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Categories from './pages/Categories';
import LoginPage from './pages/LoginPage';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import AddJewel from './pages/AddJewel';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import UserOnlyRoute from './components/UserOnlyRoute';
import GlobalToast from './components/GlobalToast';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import OrderInfoGate from './components/OrderInfoGate';
import AiStylist from './components/AiStylist';

function NavigationButton() {
  const navigate = useNavigate();
  return (
    <div className="text-center my-4">
      <button className="btn btn-success" onClick={() => navigate('/admin/add-jewel')}>
         Add Jewellery
      </button>
    </div>
  );
}

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
      <Header />
      <GlobalToast />
      <OrderInfoGate />

      {/* Optional button for quick access */}

      <div className="section-gap">
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/Categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/register/user" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/account" element={<UserOnlyRoute><UserDashboard /></UserOnlyRoute>} />
          <Route path="/wishlist" element={<UserOnlyRoute><Wishlist /></UserOnlyRoute>} />
          <Route path="/cart" element={<UserOnlyRoute><Cart /></UserOnlyRoute>} />
          <Route path="/product/:type/:id" element={<ProductDetails />} />

          {/* <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/admin/add-jewel"
            element={
              <ProtectedRoute>
                <AddJewel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <div className="footer-gap">
        <Footer />
      </div>
      <AiStylist />
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;