import React, { useState } from 'react';
import { toastError, toastSuccess } from '../utils/notify';
import StarRating from './StarRating';

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  const submit = async () => {
    if (!token) return toastError('Please login to send feedback');
    try {
      const res = await fetch('https://shreepratha.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment })
      });
      const data = await res.json();
      if (res.ok) {
        toastSuccess('Thanks! Feedback submitted for approval.');
        setComment(''); setRating(5);
      } else {
        toastError(data?.message || 'Failed to submit feedback');
      }
    } catch { toastError('Network error'); }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label" style={{ 
          color: '#6c757d', 
          fontWeight: 'bold', 
          marginBottom: '10px',
          display: 'block'
        }}>
          Rating:
        </label>
        <StarRating 
          rating={rating} 
          onRatingChange={setRating}
        />
      </div>
      <textarea 
        className="form-control mb-3" 
        rows="4" 
        placeholder="Share your experience with the app" 
        value={comment} 
        onChange={e => setComment(e.target.value)}
        style={{
          borderRadius: '10px',
          border: '2px solid #ff69b4',
          padding: '12px 15px',
          fontSize: '1rem',
          resize: 'vertical'
        }}
      />
      <button 
        className="btn btn-primary" 
        onClick={submit}
        style={{
          background: 'linear-gradient(135deg, #007bff, #0056b3)',
          border: 'none',
          borderRadius: '25px',
          padding: '10px 25px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(0, 123, 255, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
        }}
      >
        Submit
      </button>
    </div>
  );
}


