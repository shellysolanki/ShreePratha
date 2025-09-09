import React, { useEffect, useState } from 'react';
import { Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function GlobalToast() {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('primary');
  const [redirect, setRedirect] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      const { message: msg, variant: vr = 'primary', redirect: rd = null, duration = 1500 } = e.detail || {};
      setMessage(msg || '');
      setVariant(vr);
      setRedirect(rd);
      setShow(true);
      if (rd) {
        setTimeout(() => navigate(rd), duration);
      }
    };
    window.addEventListener('toast:show', handler);
    return () => window.removeEventListener('toast:show', handler);
  }, [navigate]);

  return (
    <Toast
      onClose={() => setShow(false)}
      show={show}
      delay={1500}
      autohide
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        minWidth: '220px',
        zIndex: 3000,
        backgroundColor: 'var(--bs-' + variant + ')',
        color: '#fff',
        fontWeight: 'bold',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)'
      }}
    >
      <Toast.Header closeButton={false}>
        <strong className="me-auto">Notice</strong>
      </Toast.Header>
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
}


