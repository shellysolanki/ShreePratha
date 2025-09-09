import React, { useEffect, useState } from 'react';

export default function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    fetch('https://shreepratha.onrender.com/about/')
      .then(r => r.json())
      .then(setAbout)
      .catch(() => setAbout(null));
  }, []);

  const lines = about?.lines || [
    'We curate quality fashion and lifestyle products at fair prices.',
    'Our team handpicks every item to ensure comfort, style, and durability.',
    'Fast delivery, easy returns, and friendly support are our promises.',
    'Thanks for shopping with us and being part of our journey.'
  ];

  return (
    <div className="about-section" style={{
      background: 'linear-gradient(135deg, #ffb6c1 0%, #f5deb3 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3" style={{ color: '#8b4513' }}>About ShreePratha</h2>
            {lines.map((l, i) => (
              <p className="mb-2" key={i} style={{ color: '#654321', fontSize: '1.1rem' }}>{l}</p>
            ))}
          </div>
          <div className="col-md-6 text-center">
            <video 
              src="/image/WhatsApp Video 2025-09-05 at 20.05.13_f15597a9.mp4" 
              controls 
              className="w-100 rounded shadow" 
              style={{ maxHeight: '400px' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}


