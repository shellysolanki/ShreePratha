import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductReviews from '../components/ProductReviews';
import WishlistButton from '../components/WishlistButton';
import { toastError } from '../utils/notify';

export default function ProductDetails() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Map product type to endpoint base
        const base = type === 'jewellery' ? 'jewellery'
          : type === 'bag' ? 'bag'
          : type === 'inner' ? 'inner'
          : type === 'makeup' ? 'makeup'
          : type === 'bodycare' ? 'bodycare'
          : null;
        if (!base) {
          toastError('Unknown product type');
          navigate('/Categories');
          return;
        }
        const res = await fetch(`http://localhost:5000/${base}/${id}`);
        const data = await res.json();
        if (!res.ok || !data) throw new Error('Not found');
        setItem(data || null);
      } catch {
        toastError('Unable to load product');
        navigate('/Categories');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, id, navigate]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status" />
        <p className="mt-3">Loading product…</p>
      </div>
    );
  }

  if (!item) return null;

  const title = item.title || 'Product';
  const price = item.price || 0;
  const images = item.images || [];
  const description = item.description || '';

  return (
    <div className="container py-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>← Back</button>
      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={images[0] || '/image/image.png'}
            onError={(e) => { e.currentTarget.src = '/image/image.png'; }}
            alt={title}
            style={{ width: '100%', maxHeight: '420px', objectFit: 'contain', borderRadius: '8px' }}
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-2" style={{ color: '#d63384' }}>{title}</h2>
          <div className="mb-3 fw-bold">₹{price}</div>
          {description && <p className="text-muted">{description}</p>}
          <div className="d-flex gap-2 mt-3">
            <WishlistButton productId={id} productType={type} />
          </div>
          <div className="mt-4">
            <ProductReviews productId={id} productType={type} />
          </div>
        </div>
      </div>
    </div>
  );
}


