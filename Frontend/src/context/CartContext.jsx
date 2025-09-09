import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const token = localStorage.getItem('token');
  const userId = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('userData') || 'null');
      return u?._id || u?.id || null;
    } catch { return null; }
  })();
  const isAdmin = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('userData') || 'null');
      return u?.role === 'admin';
    } catch { return false; }
  })();

  const loadCart = useCallback(async () => {
    if (!token || !userId || isAdmin) { setItems([]); setCount(0); return; }
    try {
      const res = await fetch(`http://localhost:5000/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      const list = (data && data.items) || [];
      setItems(list);
      const totalQty = list.reduce((s, it) => s + (it.quantity || 0), 0);
      setCount(totalQty);
    } catch {
      // ignore
    }
  }, [token, userId, isAdmin]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!token || !userId || isAdmin) return false;
    try {
      const res = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user: userId, product: productId, quantity })
      });
      const data = await res.json();
      if (!res.ok) return false;
      // optimistic: update count from response
      const list = (data && data.items) || [];
      setItems(list);
      const totalQty = list.reduce((s, it) => s + (it.quantity || 0), 0);
      setCount(totalQty);
      return true;
    } catch {
      return false;
    }
  }, [token, userId, isAdmin]);

  const value = useMemo(() => ({ count, items, loadCart, addToCart }), [count, items, loadCart, addToCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


