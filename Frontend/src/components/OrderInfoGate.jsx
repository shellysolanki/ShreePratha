import React, { useEffect, useState } from 'react';
import OrderInfoModal from './OrderInfoModal';

export default function OrderInfoGate() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    // If address not present, open once
    try {
      const info = JSON.parse(localStorage.getItem('orderInfo') || 'null');
      if (!info) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  if (!open) return null;
  return (
    <OrderInfoModal
      open={open}
      onClose={() => setOpen(false)}
      onComplete={() => setOpen(false)}
    />
  );
}


