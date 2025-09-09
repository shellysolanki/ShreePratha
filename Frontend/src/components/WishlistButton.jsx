import React, { useState } from 'react';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistButton({ productId, productType, size = 'md' }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const inWishlist = isInWishlist(productId, productType);
  
  const handleToggle = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await toggleWishlist(productId, productType);
    } finally {
      setIsProcessing(false);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          fontSize: '1rem',
          padding: '6px 8px',
          borderRadius: '50%',
          width: '32px',
          height: '32px'
        };
      case 'lg':
        return {
          fontSize: '1.5rem',
          padding: '10px 12px',
          borderRadius: '50%',
          width: '48px',
          height: '48px'
        };
      default: // md
        return {
          fontSize: '1.2rem',
          padding: '8px 10px',
          borderRadius: '50%',
          width: '40px',
          height: '40px'
        };
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isProcessing}
      style={{
        ...getSizeStyles(),
        background: inWishlist 
          ? 'linear-gradient(135deg, #e74c3c, #c0392b)' 
          : 'linear-gradient(135deg, #ecf0f1, #bdc3c7)',
        color: inWishlist ? 'white' : '#7f8c8d',
        border: 'none',
        cursor: isProcessing ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        boxShadow: inWishlist 
          ? '0 4px 15px rgba(231, 76, 60, 0.4)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 10,
        opacity: isProcessing ? 0.7 : 1
      }}
      onMouseEnter={(e) => {
        if (isProcessing) return;
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = inWishlist 
          ? '0 6px 20px rgba(231, 76, 60, 0.6)' 
          : '0 4px 15px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        if (isProcessing) return;
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = inWishlist 
          ? '0 4px 15px rgba(231, 76, 60, 0.4)' 
          : '0 2px 8px rgba(0, 0, 0, 0.1)';
      }}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isProcessing ? '⏳' : (inWishlist ? '❤️' : '🤍')}
    </button>
  );
}
