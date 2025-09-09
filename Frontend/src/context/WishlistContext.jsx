import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toastSuccess, toastError } from '../utils/notify';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const u = JSON.parse(localStorage.getItem('userData') || 'null');
      return u?.role === 'admin';
    } catch { return false; }
  });

  // Listen for changes in localStorage (for Google login)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      const newUserData = localStorage.getItem('userData');
      
      setToken(newToken);
      
      if (newUserData) {
        try {
          const u = JSON.parse(newUserData);
          setIsAdmin(u?.role === 'admin');
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom login event (same tab)
    window.addEventListener('userLogin', handleStorageChange);
    
    // Also check on mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleStorageChange);
    };
  }, []);

  const loadWishlist = useCallback(async () => {
    if (!token) return;
    if (isAdmin) {
      setWishlistItems([]);
      setWishlistCount(0);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('https://shreepratha.onrender.com/wishlist/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        const items = data.wishlist.items || [];
        setWishlistItems(items);
        setWishlistCount(items.length);
      }
    } catch (err) {
      console.error('Error loading wishlist:', err);
    } finally {
      setLoading(false);
    }
  }, [token, isAdmin]);

  // Load wishlist when token changes
  useEffect(() => {
    if (token) {
      loadWishlist();
    } else {
      // Clear wishlist when no token
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [token, loadWishlist]);

  const addToWishlist = async (productId, productType) => {
    if (!token) {
      toastError('Please login to add items to wishlist');
      return false;
    }
    if (isAdmin) {
      toastError('Admins cannot use wishlist');
      return false;
    }

    // Check if already in wishlist to prevent duplicates
    if (isInWishlist(productId, productType)) {
      return true;
    }

    try {
      const response = await fetch('https://shreepratha.onrender.com/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, productType })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toastSuccess('Item added to wishlist!');
        // Update count immediately
        setWishlistCount(prev => prev + 1);
        // Reflect in local items to keep isInWishlist accurate
        setWishlistItems(prev => [
          ...prev,
          { product: { _id: productId }, productType, addedAt: new Date().toISOString() }
        ]);
        return true;
      } else {
        toastError(data.message || 'Failed to add to wishlist');
        return false;
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      toastError('Failed to add to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId, productType) => {
    if (!token) return false;
    if (isAdmin) return false;

    // Check if not in wishlist to prevent unnecessary calls
    if (!isInWishlist(productId, productType)) {
      return true;
    }

    try {
      const response = await fetch('https://shreepratha.onrender.com/wishlist/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, productType })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toastSuccess('Item removed from wishlist!');
        // Update count immediately
        setWishlistCount(prev => Math.max(0, prev - 1));
        // Remove from local items to keep isInWishlist accurate
        setWishlistItems(prev => prev.filter(item => {
          const itemId = (item.product && item.product._id) ? item.product._id : item.product;
          return !(itemId === productId && item.productType === productType);
        }));
        return true;
      } else {
        toastError(data.message || 'Failed to remove from wishlist');
        return false;
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      toastError('Failed to remove from wishlist');
      return false;
    }
  };

  const toggleWishlist = async (productId, productType) => {
    const inWishlist = isInWishlist(productId, productType);

    if (inWishlist) {
      return await removeFromWishlist(productId, productType);
    } else {
      return await addToWishlist(productId, productType);
    }
  };

  const isInWishlist = (productId, productType) => {
    return wishlistItems.some(item => {
      const itemId = (item.product && item.product._id) ? item.product._id : item.product;
      return itemId === productId && item.productType === productType;
    });
  };

  const getWishlistCount = async () => {
    if (!token) return 0;

    try {
      const response = await fetch('https://shreepratha.onrender.com/wishlist/count', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setWishlistCount(data.count);
        return data.count;
      }
    } catch (err) {
      console.error('Error getting wishlist count:', err);
    }
    return 0;
  };

  const value = useMemo(() => ({
    wishlistItems,
    wishlistCount,
    loading,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    loadWishlist
  }), [wishlistItems, wishlistCount, loading, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, getWishlistCount, loadWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
