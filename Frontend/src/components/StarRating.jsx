import React, { useState } from 'react';

export default function StarRating({ rating, onRatingChange, readOnly = false }) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (starRating) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const handleStarHover = (starRating) => {
    if (!readOnly) {
      setHoveredRating(starRating);
    }
  };

  const handleStarLeave = () => {
    if (!readOnly) {
      setHoveredRating(0);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRating || rating);
        return (
          <span
            key={star}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleStarLeave}
            style={{
              fontSize: '2rem',
              color: isActive ? '#ffd700' : '#e0e0e0',
              cursor: readOnly ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              filter: isActive ? 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.6))' : 'none',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseOver={(e) => {
              if (!readOnly) {
                e.target.style.transform = 'scale(1.2)';
              }
            }}
            onMouseOut={(e) => {
              if (!readOnly) {
                e.target.style.transform = isActive ? 'scale(1.1)' : 'scale(1)';
              }
            }}
          >
            ★
          </span>
        );
      })}
      {!readOnly && (
        <span style={{ 
          marginLeft: '10px', 
          color: '#6c757d', 
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}>
          {rating}/5
        </span>
      )}
    </div>
  );
}
