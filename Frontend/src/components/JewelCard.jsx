import React, { useState } from 'react';
import { confirm, toastSuccess, toastError } from '../utils/notify';
import { getValidToken } from '../utils/auth';
import Swal from 'sweetalert2';
import ProductReviews from './ProductReviews';
import WishlistButton from './WishlistButton';
import OrderInfoModal from './OrderInfoModal';
import { addToCartApi } from '../utils/cart';
import { useCart } from '../context/CartContext';

export default function JewelCard({ item, onDelete, isAdmin = false }) {
  const { _id, title, price, images, material, type, stock, description } = item;
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const { loadCart } = useCart();
  const [updateForm, setUpdateForm] = useState({
    title: title,
    price: price,
    material: material,
    type: type,
    stock: stock,
    description: description || ''
  });

  const handleDelete = async () => {
    const ok = await confirm({ title: 'Delete item?', text: `Are you sure you want to delete "${title}"?` });
    if (!ok) return;
    setDeleting(true);
    try {
      const res = await fetch(`https://shreepratha.onrender.com/jewellery/${_id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      toastSuccess(data.message || 'Item deleted');
      if (onDelete) onDelete(_id);
      window.dispatchEvent(new CustomEvent('product:deleted', { detail: { id: _id } }));
      setIsDeleted(true);
    } catch (err) {
      console.error('Delete failed:', err);
      toastError('Failed to delete item');
    } finally {
      setDeleting(false);
    }
  };

  // wishlist handled by WishlistButton

  const handleUpdate = async () => {
    try {
      const res = await fetch(`https://shreepratha.onrender.com/jewellery/${_id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updateForm) });
      const data = await res.json();
      if (res.ok) {
        toastSuccess('Product updated successfully');
        setShowUpdateModal(false);
        window.location.reload();
      } else {
        toastError(data.error || 'Update failed');
      }
    } catch (err) {
      console.error('Update failed:', err);
      toastError('Failed to update product');
    }
  };

  const startPayment = async () => {
    try {
      const token = getValidToken();
      if (!token) {
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Please login to buy this product.', variant: 'danger', redirect: '/login', duration: 1500 } }));
        Swal.fire({ toast: true, icon: 'warning', title: 'Please login to buy this product.', position: 'top-end', timer: 1500, showConfirmButton: false });
        return;
      }
      const amount = Number(price);
      const keyResp = await fetch('https://shreepratha.onrender.com/payment/razorpay/key');
      const keyData = await keyResp.json();
      if (!keyData?.key) return toastError(keyData?.error || 'Razorpay key not configured');
      const res = await fetch('https://shreepratha.onrender.com/payment/razorpay/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, currency: 'INR', receipt: `${_id}_${Date.now()}` }),
      });
      const data = await res.json();
      if (!data?.order?.id) return toastError(data?.error || 'Failed to create order');

      const options = {
        key: keyData.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'ShreePratha',
        description: title,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('https://shreepratha.onrender.com/payment/razorpay/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: token ? `Bearer ${token}` : undefined,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount,
                userId: null,
                paymentMethod: 'card',
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData?.success) {
              toastSuccess('Payment successful');
            } else {
              toastError(verifyData?.error || 'Payment verification failed');
            }
          } catch (e) {
            toastError('Verification error');
          }
        },
        prefill: {},
        notes: { productId: _id },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toastError('Unable to start payment');
    }
  };

  const handleBuy = async () => {
    // Always show the address modal first; it will prefill if saved
    setShowOrderInfo(true);
  };

  if (isDeleted) return null;

  return (
    <>
      <div className="card mb-4 shadow-lg h-100" style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #f8f9fa',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(255, 215, 0, 0.15)'
      }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={images && images[0] ? images[0] : '/image/image.png'}
            onError={(e) => { e.currentTarget.src = '/image/image.png'; }}
            className="card-img-top"
            alt={title}
            style={{ 
              height: '300px', 
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          {!isAdmin && (
            <div style={{
              position: 'absolute',
              top: '15px',
              left: '15px'
            }}>
              <WishlistButton 
                productId={_id} 
                productType="jewellery" 
                size="sm"
              />
            </div>
          )}
          <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            color: '#d4af37',
            padding: '8px 15px',
            borderRadius: '25px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)'
          }}>
            💎 JEWELLERY
          </div>
        </div>
        <div className="card-body text-center" style={{ backgroundColor: '#ffffff', color: '#333333' }}>
          <h5 className="card-title" style={{ color: '#d4af37', fontWeight: 'bold', marginBottom: '15px', fontSize: '1.3rem' }}>{title}</h5>
          <p className="card-text mb-2" style={{ color: '#666666' }}>
            <strong style={{ color: '#d4af37' }}>Material:</strong> {material}
          </p>
          <p className="card-text mb-2" style={{ color: '#666666' }}>
            <strong style={{ color: '#d4af37' }}>Type:</strong> {type}
          </p>
          <p className="card-text mb-2" style={{ color: '#2c3e50', fontSize: '1.4rem', fontWeight: 'bold' }}>
            <strong>Price:</strong> ₹{price}
          </p>
          <p className="card-text mb-3" style={{ color: stock === 0 ? '#e74c3c' : stock < 5 ? '#f39c12' : '#27ae60' }}>
            <strong>Stock:</strong>{' '}
            {stock === 0 ? 'Out of stock' : stock < 5 ? `Only ${stock} left!` : stock}
          </p>

          <div className="d-grid gap-2">
            {/* View Details button */}
            <button 
              className="btn" 
              onClick={() => setShowModal(true)}
              style={{
                backgroundColor: 'transparent',
                color: '#d4af37',
                border: '2px solid #d4af37',
                borderRadius: '25px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                padding: '10px 20px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d4af37';
                e.target.style.color = '#ffffff';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#d4af37';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              View Details
            </button>

            {/* Wishlist heart button */}
            {!isAdmin && (
              <div style={{ position: 'relative' }}>
                <WishlistButton 
                  productId={_id} 
                  productType="jewellery" 
                  size="lg"
                />
              </div>
            )}

            {/* Add to Cart (users only) */}
            {!isAdmin && (
              <button
                className="btn"
                onClick={async () => {
                  try {
                    await addToCartApi(_id, 1, 'jewellery');
                    loadCart();
                    toastSuccess('Added to cart');
                  } catch (e) {
                    toastError(e.message || 'Failed to add to cart');
                  }
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#0d6efd',
                  border: '2px solid #0d6efd',
                  borderRadius: '25px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  padding: '10px 20px'
                }}
              >
                ➕ Add to Cart
              </button>
            )}

            {isAdmin && (
              <>
                <button 
                  className="btn" 
                  onClick={() => setShowUpdateModal(true)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#27ae60',
                    border: '2px solid #27ae60',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    padding: '10px 20px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#27ae60';
                    e.target.style.color = '#ffffff';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#27ae60';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Update
                </button>
                <button
                  className="btn"
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#e74c3c',
                    border: '2px solid #e74c3c',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    opacity: deleting ? 0.6 : 1,
                    padding: '10px 20px'
                  }}
                  onMouseEnter={(e) => {
                    if (!deleting) {
                      e.target.style.backgroundColor = '#e74c3c';
                      e.target.style.color = '#ffffff';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!deleting) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#e74c3c';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
          
          {!isAdmin && (
            <button 
              type="button" 
              className="btn w-100 py-3 fs-6 mt-2" 
              onClick={handleBuy}
              style={{
                background: 'linear-gradient(135deg, #d4af37, #ffd700)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '25px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
              }}
            >
              💎 Buy Now
            </button>
          )}
        </div>
      </div>

  

      {/* Modal Section */}
      {showModal && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '600px',
              width: '90%',
              position: 'relative',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()} // prevent modal close on clicking inside content
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2>{title}</h2>
            <img
              src={images && images[0] ? images[0] : '/image/image.png'}
              onError={(e) => { e.currentTarget.src = '/image/image.png'; }}
              alt={title}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }}
            />
            <p><strong>Material:</strong> {material}</p>
            <p><strong>Type:</strong> {type}</p>
            <p><strong>Price:</strong> ₹{price}</p>
            <p><strong>Stock:</strong> {stock}</p>
            <p><strong>Description:</strong> {description || 'No description available.'}</p>
            <ProductReviews productId={_id} productType="jewellery" />
          </div>
        </div>
      )}

      {showOrderInfo && (
        <OrderInfoModal open={showOrderInfo} onClose={() => setShowOrderInfo(false)} onComplete={() => { setShowOrderInfo(false); startPayment(); }} />
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050,
          }}
          onClick={() => setShowUpdateModal(false)}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUpdateModal(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>

            <h3>Update Product</h3>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={updateForm.title}
                onChange={(e) => setUpdateForm({...updateForm, title: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input
                type="number"
                className="form-control"
                value={updateForm.price}
                onChange={(e) => setUpdateForm({...updateForm, price: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Material</label>
              <input
                type="text"
                className="form-control"
                value={updateForm.material}
                onChange={(e) => setUpdateForm({...updateForm, material: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Type</label>
              <input
                type="text"
                className="form-control"
                value={updateForm.type}
                onChange={(e) => setUpdateForm({...updateForm, type: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Stock</label>
              <input
                type="number"
                className="form-control"
                value={updateForm.stock}
                onChange={(e) => setUpdateForm({...updateForm, stock: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={updateForm.description}
                onChange={(e) => setUpdateForm({...updateForm, description: e.target.value})}
              />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
              <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// import React, { useState } from 'react';

// export default function JewelCard({ item, onDelete, isAdmin = false }) {
//   const { _id, title, price, images, material, type, stock, description } = item;
//   const [deleting, setDeleting] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [inWishlist, setInWishlist] = useState(false); // track wishlist status

//   const handleDelete = async () => {
//     const confirm = window.confirm(`Are you sure you want to delete "${title}"?`);
//     if (!confirm) return;

//     setDeleting(true);
//     try {
//       const res = await fetch(`https://shreepratha.onrender.com/jewellery/${_id}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const data = await res.json();
//       alert(data.message || 'Item deleted');
//       if (onDelete) onDelete(_id);
//     } catch (err) {
//       console.error('Delete failed:', err);
//       alert('Failed to delete item');
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const toggleWishlist = () => {
//     setInWishlist(!inWishlist);
//     // You can also add logic here to save wishlist status to backend or localStorage
//   };

//   return (
//     <>
//       <div className="card mb-4 shadow-sm h-100">
//         <img
//           src={images?.[0] || '/default.jpg'}
//           className="card-img-top"
//           alt={title}
//           style={{ height: '300px', objectFit: 'cover' }}
//         />
//         <div className="card-body text-center">
//           <h5 className="card-title">{title}</h5>
//           <p className="card-text mb-1"><strong>Material:</strong> {material}</p>
//           <p className="card-text mb-1"><strong>Type:</strong> {type}</p>
//           <p className="card-text mb-1"><strong>Price:</strong> ₹{price}</p>
//           <p className="card-text mb-3">
//             <strong>Stock:</strong>{' '}
//             {stock === 0 ? 'Out of stock' : stock < 5 ? `Only ${stock} left!` : stock}
//           </p>

//           <div className="d-grid gap-2">
//             {/* View Details button */}
//             <button className="btn btn-outline-primary" onClick={() => setShowModal(true)}>
//               View Details
//             </button>

//             {/* Wishlist button in red */}
//             <button
//               onClick={toggleWishlist}
//               className="btn"
//               style={{
//                 backgroundColor: inWishlist ? '#9b1c02ff' : '#0c7effff',
//                 color: 'white',
//                 border: 'none',
//                 fontWeight: 'bold',
//               }}
//             >
//               {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
//             </button>

//             {isAdmin && (
//               <>
//                 <button className="btn btn-outline-success">Update</button>
//                 <button
//                   className="btn btn-outline-danger"
//                   onClick={handleDelete}
//                   disabled={deleting}
//                 >
//                   {deleting ? 'Deleting...' : 'Delete'}
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modal Section */}
//       {showModal && (
//         <div
//           className="modal-backdrop"
//           style={{
//             position: 'fixed',
//             top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(0,0,0,0.6)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 1050,
//           }}
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             className="modal-content"
//             style={{
//               backgroundColor: '#fff',
//               padding: '20px',
//               borderRadius: '8px',
//               maxWidth: '600px',
//               width: '90%',
//               position: 'relative',
//               boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
//             }}
//             onClick={e => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setShowModal(false)}
//               style={{
//                 position: 'absolute',
//                 top: '10px',
//                 right: '10px',
//                 background: 'transparent',
//                 border: 'none',
//                 fontSize: '1.5rem',
//                 cursor: 'pointer',
//               }}
//               aria-label="Close modal"
//             >
//               &times;
//             </button>

//             <h2>{title}</h2>
//             <img
//               src={images?.[0] || '/default.jpg'}
//               alt={title}
//               style={{ width: '100%', maxHeight: '300px', objectFit: 'contain', marginBottom: '20px' }}
//             />
//             <p><strong>Material:</strong> {material}</p>
//             <p><strong>Type:</strong> {type}</p>
//             <p><strong>Price:</strong> ₹{price}</p>
//             <p><strong>Stock:</strong> {stock}</p>
//             <p><strong>Description:</strong> {description || 'No description available.'}</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
