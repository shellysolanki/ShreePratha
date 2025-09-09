import React, { useEffect, useMemo, useState } from 'react';

export default function ProductReviews({ productId, productType }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  const stars = useMemo(() => [1,2,3,4,5], []);

  useEffect(() => {
    if (!productId || !productType) return;
    fetch(`http://localhost:5000/review/product/${productId}?productType=${encodeURIComponent(productType)}`)
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => {});
  }, [productId, productType]);

  const avg = reviews.length ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1) : null;

  const submit = async () => {
    if (!token) {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Please login to write a review.', variant: 'danger', redirect: '/login', duration: 1200 } }));
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/review/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment, productId, productType }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setRating(5);
        // Refresh reviews to show the new one immediately
        fetch(`http://localhost:5000/review/product/${productId}?productType=${encodeURIComponent(productType)}`)
          .then((r) => r.json())
          .then((data) => setReviews(data.reviews || []))
          .catch(() => {});
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Review submitted successfully!', variant: 'success' } }));
      } else {
        window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: data?.message || 'Unable to submit review', variant: 'danger' } }));
      }
    } catch {
      window.dispatchEvent(new CustomEvent('toast:show', { detail: { message: 'Network error submitting review', variant: 'danger' } }));
    }
  };

  return (
    <div className="mt-3 text-start">
      <div className="d-flex align-items-center justify-content-between">
        <h5 className="mb-2">Reviews</h5>
        {avg && <span className="badge bg-success">Avg {avg}★</span>}
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet.</p>
      ) : (
        <div className="mb-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
          {reviews.map(r => (
            <div key={r._id} className="border rounded p-2 mb-2">
              <div className="d-flex align-items-center gap-2">
                <strong>{r.user?.name || 'User'}</strong>
                <span className="text-warning">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {r.comment && <div style={{ whiteSpace: 'pre-wrap' }}>{r.comment}</div>}
              <small className="text-muted">{new Date(r.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
      )}

      <div className="border-top pt-2">
        <div className="mb-2">Your rating:</div>
        <div className="mb-2">
          {stars.map(s => (
            <button
              key={s}
              type="button"
              className="btn btn-sm"
              onClick={() => setRating(s)}
              style={{ color: s <= rating ? '#f5a623' : '#ccc' }}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="form-control mb-2"
          rows="2"
          placeholder="Write your review (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
        />
        <button type="button" className="btn btn-primary" onClick={submit}>Submit Review</button>
      </div>
    </div>
  );
}




