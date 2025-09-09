
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import JewelCard from '../components/JewelCard';
import MakeupCard from '../components/MakeupCard';
import BagCard from '../components/BagCard';
import InnerCard from '../components/InnerCard';

function Categories() {
  const [jewels, setJewels] = useState([]);
  const [makeup, setMakeup] = useState([]);
  const [bags, setBags] = useState([]);
  const [lingerie, setLingerie] = useState([]);
  const location = useLocation();

  const queryCategory = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q')?.trim().toLowerCase() || '';
    // normalize synonyms
    if (q === 'jewel' || q === 'jewellery' || q === 'jewelry') return 'jewellery';
    if (q === 'cosmetic' || q === 'cosmetics' || q === 'makeup' || q === 'make up') return 'cosmetics';
    if (q === 'bag' || q === 'bags') return 'bags';
    if (q === 'inner' || q === 'lingerie' || q === 'innerwear' || q === 'inner wear') return 'lingerie';
    return '';
  }, [location.search]);

  // Remove items from state when a card deletes them (admin view)
  const handleJewelDelete = (id) => setJewels((prev) => prev.filter((p) => p._id !== id));
  const handleMakeupDelete = (id) => setMakeup((prev) => prev.filter((p) => p._id !== id));
  const handleBagDelete = (id) => setBags((prev) => prev.filter((p) => p._id !== id));
  const handleLingerieDelete = (id) => setLingerie((prev) => prev.filter((p) => p._id !== id));

  useEffect(() => {
    fetch('http://localhost:5000/jewellery/all')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
        setJewels(items.filter(Boolean));
      })
      .catch((err) => console.error('Failed to fetch jewellery:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/makeup/all')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
        setMakeup(items.filter(Boolean));
      })
      .catch((err) => console.error('Failed to fetch makeup:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/bag/')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
        setBags(items.filter(Boolean));
      })
      .catch((err) => console.error('Failed to fetch bags:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/inner/')
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : (data ? [data] : []));
        setLingerie(items.filter(Boolean));
      })
      .catch((err) => console.error('Failed to fetch lingerie:', err));
  }, []);

  // Listen for deletion events triggered from admin pages/cards and update lists
  useEffect(() => {
    const onDeleted = (e) => {
      const id = e?.detail?.id;
      if (!id) return;
      setJewels((prev) => prev.filter((p) => p._id !== id));
      setMakeup((prev) => prev.filter((p) => p._id !== id));
      setBags((prev) => prev.filter((p) => p._id !== id));
      setLingerie((prev) => prev.filter((p) => p._id !== id));
    };
    window.addEventListener('product:deleted', onDeleted);
    return () => window.removeEventListener('product:deleted', onDeleted);
  }, []);

  return (
    <div className="w-100 m-0 p-0" style={{ overflowX: 'hidden' }}>
      {/* 🔄 Carousel Section */}
      <div
        id="mainCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="3000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/image/image1.png" className="d-block w-100" alt="Slide 1" />
          </div>
          <div className="carousel-item">
            <img src="/image/image.png" className="d-block w-100" alt="Slide 2" />
          </div>
          <div className="carousel-item">
            <img src="/image/image2.png" className="d-block w-100" alt="Slide 3" />
          </div>
          <div className="carousel-item">
            <img src="/image/image3.png" className="d-block w-100" alt="Slide 4" />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* 🎥 AI Suggestions Video Slider */}


      {/* 💎 Jewellery Section */}
      {(queryCategory === '' || queryCategory === 'jewellery') && (
        <div className="container py-5">
          <h3 className="text-center fw-bold mb-4" style={{ background: 'linear-gradient(90deg, #ff4d4f, #fa8c16, #fadb14, #52c41a, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jewellery</h3>
          <div className="row">
            {jewels.map((item, index) => (
              <div className="col-md-4 mb-4" key={item._id || item.id || index}>
                <JewelCard item={item} onDelete={handleJewelDelete} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* cosmetics section */}
      {(queryCategory === '' || queryCategory === 'cosmetics') && (
        <div className="container py-5">
          <h3 className="text-center fw-bold mb-4" style={{ background: 'linear-gradient(90deg, #ff4d4f, #fa8c16, #fadb14, #52c41a, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cosmetics</h3>
          <div className="row">
            {makeup.map((item, index) => (
              <div className="col-md-4 mb-4" key={item._id || item.id || index}>
                <MakeupCard item={item} onDelete={handleMakeupDelete} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bags section */}
      {(queryCategory === '' || queryCategory === 'bags') && (
        <div className="container py-5">
          <h3 className="text-center fw-bold mb-4" style={{ background: 'linear-gradient(90deg, #ff4d4f, #fa8c16, #fadb14, #52c41a, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Bags</h3>
          <div className="row">
            {bags.map((item, index) => (
              <div className="col-md-4 mb-4" key={item._id || item.id || index}>
                <BagCard item={item} onDelete={handleBagDelete} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lingerie section */}
      {(queryCategory === '' || queryCategory === 'lingerie') && (
        <div className="container py-5">
          <h3 className="text-center fw-bold mb-4" style={{ background: 'linear-gradient(90deg, #ff4d4f, #fa8c16, #fadb14, #52c41a, #1890ff, #722ed1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Lingerie</h3>
          <div className="row">
            {lingerie.map((item, index) => (
              <div className="col-md-4 mb-4" key={item._id || item.id || index}>
                <InnerCard item={item} onDelete={handleLingerieDelete} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <h3 className="text-center mb-4" style={{ color: '#8b4513' }}>Find Us</h3>
            <div className="map-container" style={{ height: '400px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689999999!2d75.8572758!3d22.7195687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b4101b5%3A0x384bce50e0e5b672!2sIT%20Park%2C%20Khandwa%20Road%2C%20Indore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1640000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ShreePratha Location - IT Park, Khandwa Road, Indore"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;