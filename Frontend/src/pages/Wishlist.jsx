import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { toastError } from '../utils/notify';
import OrderInfoModal from '../components/OrderInfoModal';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, loading, removeFromWishlist, loadWishlist } = useWishlist();
  const token = localStorage.getItem('token');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!token) {
      toastError('Please login to view your wishlist');
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [token, navigate, loadWishlist]);

  const handleRemoveItem = async (productId, productType) => {
    await removeFromWishlist(productId, productType);
  };

  const getProductImage = (item) => {
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0];
    }
    return '/image/splogo.png';
  };

  const getProductPrice = (item) => {
    return item.product.price || 0;
  };

  const getProductTitle = (item) => {
    return item.product.title || 'Product';
  };

  const startPayment = async (item) => {
    try {
      if (!item?.product?.price) return toastError('Invalid amount');
      const amount = Math.max(1, Math.floor(Number(item.product.price) || 0));

      // Get key
      const keyResp = await fetch('http://localhost:5000/payment/razorpay/key');
      const keyData = await keyResp.json();
      if (!keyData?.key) return toastError('Payment key not configured');

      // Create order
      const safeReceipt = (`wish_${item.productType}_${item.product._id}_${Date.now()}`)
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, 40);
      const res = await fetch('http://localhost:5000/payment/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR', receipt: safeReceipt })
      });
      if (!res.ok) {
        return toastError('Failed to create order');
      }
      const data = await res.json();
      if (!data?.order?.id) return toastError('Failed to create order');

      const options = {
        key: keyData.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'ShreePratha',
        description: `Wishlist quick buy - ${getProductTitle(item)}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await fetch('http://localhost:5000/payment/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                userId: (() => { try { const u = JSON.parse(localStorage.getItem('userData')||'null'); return u?._id||u?.id||null; } catch { return null; } })(),
                paymentMethod: 'card',
              }),
            });
          } catch {}
        },
        theme: { color: '#d63384' },
      };
      if (!window.Razorpay) return toastError('Razorpay not loaded');
      new window.Razorpay(options).open();
    } catch {
      toastError('Unable to start payment');
    }
  };

  const handlePriceClick = (item) => {
    setSelectedItem(item);
    setShowAddressForm(true);
  };

  const handleAddressDone = () => {
    setShowAddressForm(false);
    if (selectedItem) startPayment(selectedItem);
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #ffc0cb 0%, #fffdd0 50%, #ffb6c1 100%)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      <div className="container py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 style={{ 
            color: '#d63384', 
            fontWeight: 'bold', 
            fontSize: '2.5rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '10px'
          }}>
            ❤️ My Wishlist
          </h1>
          <p style={{ color: '#6c757d', fontSize: '1.2rem' }}>
            Your favorite items saved for later
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>💔</div>
            <h3 style={{ color: '#6c757d', marginBottom: '15px' }}>Your wishlist is empty</h3>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>
              Start adding items you love to your wishlist!
            </p>
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/Categories')}
              style={{
                background: 'linear-gradient(135deg, #ff69b4, #ff1493)',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 30px',
                fontWeight: 'bold'
              }}
            >
              🛍️ Start Shopping
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((item, index) => (
              <div key={`${item.product._id}-${item.productType}-${index}`} className="col-12 col-md-6 col-lg-4">
                <div style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255, 192, 203, 0.3)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Product Image */}
                  <div className="text-center mb-3">
                    <img
                      src={getProductImage(item)}
                      alt={getProductTitle(item)}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '15px',
                        border: '2px solid #ff69b4'
                      }}
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-grow-1">
                    <h5 style={{ 
                      color: '#d63384', 
                      fontWeight: 'bold', 
                      marginBottom: '10px',
                      fontSize: '1.1rem'
                    }}>
                      {getProductTitle(item)}
                    </h5>
                    
                    <p style={{ 
                      color: '#6c757d', 
                      marginBottom: '15px',
                      fontSize: '0.9rem'
                    }}>
                      Category: {item.productType}
                    </p>

                    <div
                      onClick={() => handlePriceClick(item)}
                      style={{
                      background: 'linear-gradient(135deg, #27ae60, #2ecc71)',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      marginBottom: '15px',
                      cursor: 'pointer'
                    }}
                    role="button"
                    tabIndex={0}
                  >
                      ₹{getProductPrice(item)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary flex-grow-1"
                      onClick={() => navigate(`/product/${item.productType}/${item.product._id}`)}
                      style={{
                        background: 'linear-gradient(135deg, #007bff, #0056b3)',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '8px 15px',
                        fontWeight: 'bold'
                      }}
                    >
                      View Product
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(item.product._id, item.productType)}
                      style={{
                        background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                        border: 'none',
                        borderRadius: '15px',
                        padding: '8px 15px',
                        fontWeight: 'bold'
                      }}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {wishlistItems.length > 0 && (
          <div className="text-center mt-5">
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              borderRadius: '20px',
              padding: '30px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255, 192, 203, 0.3)',
              display: 'inline-block'
            }}>
              <h4 style={{ color: '#d63384', fontWeight: 'bold', marginBottom: '10px' }}>
                📊 Wishlist Summary
              </h4>
              <p style={{ color: '#6c757d', margin: '0', fontSize: '1.1rem' }}>
                You have <strong>{wishlistItems.length}</strong> item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Address modal for quick buy */}
      <OrderInfoModal open={showAddressForm} onClose={() => setShowAddressForm(false)} onComplete={handleAddressDone} />
    </div>
  );
}
