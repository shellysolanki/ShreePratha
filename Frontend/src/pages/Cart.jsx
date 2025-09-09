import React, { useEffect, useState } from 'react';
import { toastError, toastSuccess } from '../utils/notify';
import { getValidToken } from '../utils/auth';
import OrderInfoModal from '../components/OrderInfoModal';
export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const token = localStorage.getItem('token');
  const userId = (() => {
    try {
      const user = JSON.parse(localStorage.getItem('userData') || 'null');
      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const load = async () => {
      if (!token || !userId) {
        setLoading(false);
        return toastError('Please login to view your cart');
      }
      try {
        const res = await fetch(`https://shreepratha.onrender.com/cart/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setItems((data && data.items) || []);
      } catch (e) {
        toastError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, userId]);

  const total = items.reduce((sum, it) => sum + (it.product?.price || 0) * it.quantity, 0);

  const changeQty = async (productId, quantity) => {
    try {
      const res = await fetch(`https://shreepratha.onrender.com/cart/${userId}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setItems(data.items || []);
    } catch (e) {
      toastError('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`https://shreepratha.onrender.com/cart/${userId}/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Remove failed');
      setItems(data.items || []);
      toastSuccess('Removed from cart');
    } catch (e) {
      toastError('Failed to remove');
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
    loadRazorpayScript();
  }, []);

  const handleBuyNow = async () => {
    console.log('Buy button clicked!');
    console.log('Items in cart:', items.length);
    console.log('Total amount:', total);
    
    if (items.length === 0) {
      toastError('Your cart is empty');
      return;
    }

    const validToken = getValidToken();
    if (!validToken) {
      toastError('Please login to proceed with payment');
      return;
    }

    // Always open address form first; proceed after Save & Continue
    setShowAddressForm(true);
    return;
  };

  const proceedWithPayment = async () => {
    const validToken = getValidToken();
    
    try {
      const amount = total;
      console.log('Creating order for amount:', amount);
      console.log('User ID:', userId);
      console.log('Token:', validToken ? 'Present' : 'Missing');
      
      const keyResp = await fetch('https://shreepratha.onrender.com/payment/razorpay/key');
      const keyData = await keyResp.json();
      console.log('Razorpay key response:', keyData);
      if (!keyData?.key) return toastError(keyData?.error || 'Razorpay key not configured');

      const safeReceipt = (`cart_${userId}_${Date.now()}`)
        .replace(/[^a-zA-Z0-9_]/g, '')
        .slice(0, 40);

      const res = await fetch('https://shreepratha.onrender.com/payment/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          amount, 
          currency: 'INR', 
          receipt: safeReceipt
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        console.error('Order creation failed status:', res.status, errText);
        return toastError('Failed to create order');
      }
      const data = await res.json();
      console.log('Order creation response:', data);
      if (!data?.order?.id) {
        console.error('Order creation failed:', data);
        return toastError(data?.error || 'Failed to create order');
      }

      const options = {
        key: keyData.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'ShreePratha',
        description: `Cart checkout - ${items.length} items`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('https://shreepratha.onrender.com/payment/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${validToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                userId: userId,
                paymentMethod: 'card',
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData?.success) {
              toastSuccess('Payment successful! Your order has been placed.');
              // Clear cart after successful payment
              setItems([]);
            } else {
              toastError(verifyData?.error || 'Payment verification failed');
            }
          } catch (e) {
            toastError('Payment verification error');
          }
        },
        prefill: {},
        notes: { 
          cartItems: items.length,
          userId: userId 
        },
        theme: { color: '#d63384' },
      };

      if (!window.Razorpay) {
        toastError('Razorpay is not loaded. Please refresh the page and try again.');
        return;
      }
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toastError('Unable to start payment');
    }
  };

  const handleAddressComplete = (addressData) => {
    console.log('Address completed:', addressData);
    setShowAddressForm(false);
    // Proceed with payment after address is saved
    proceedWithPayment();
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4" style={{ color: '#d63384', fontWeight: '800' }}>🛒 My Cart</h2>
      
      {/* Address Form Modal */}
      <OrderInfoModal
        open={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onComplete={handleAddressComplete}
      />
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" />
          <p className="mt-3">Loading your cart...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛍️</div>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>Your cart is empty</h3>
          <p style={{ color: '#6c757d' }}>Add items you love and come back here.</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="list-group">
              {items.map((it) => (
                <div key={`${it.product?._id || it.product}`} className="list-group-item">
                  <div className="d-flex align-items-center">
                    <img src={it.product?.images?.[0] || '/image/splogo.png'} alt={it.product?.title} width="72" height="72" className="rounded me-3" style={{ objectFit: 'cover' }} />
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.product?.title || 'Product'}</div>
                      <div className="text-muted">₹{it.product?.price || 0}</div>
                      <div className="mt-2 d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => changeQty(it.product?._id || it.product, Math.max(1, it.quantity - 1))}>-</button>
                        <span className="px-2">{it.quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => changeQty(it.product?._id || it.product, it.quantity + 1)}>+</button>
                        <button className="btn btn-sm btn-outline-danger ms-3" onClick={() => removeItem(it.product?._id || it.product)}>Remove</button>
                      </div>
                    </div>
                    <div className="fw-bold">₹{(it.product?.price || 0) * it.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <strong>₹{total}</strong>
                </div>
                <button 
                  className="btn w-100 mt-3" 
                  style={{ background: 'linear-gradient(135deg, #d63384, #ff6b6b)', color: '#fff' }}
                  onClick={() => {
                    console.log('Button clicked!');
                    handleBuyNow();
                  }}
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


