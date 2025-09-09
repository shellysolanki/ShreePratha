// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp, FaFacebook } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="text-dark pt-4 pb-2 mt-auto"
      style={{ background: 'linear-gradient(to right, #fffdd0, #ffc0cb)' }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* Brand Info */}
          <div className="col-md-4">
            <h5 className="fw-bold text-danger">SHREEPRATHA</h5>
            <p className="small">
              Your one-stop destination for cosmetics, jewellery & lingerie. Trusted by thousands.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-dark text-decoration-none">Home</Link></li>
              <li><Link to="/categories" className="text-dark text-decoration-none">Categories</Link></li>
              <li><Link to="/account" className="text-dark text-decoration-none">My Account</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h6 className="fw-semibold">Contact Us</h6>
            <p className="small mb-1">Email: shreeprathacosmetics@gmail.com</p>
            <p className="small mb-1">Phone: +91 9981021204</p>
            <p className="small">Address: Indore, MP, India</p>
          </div>
        </div>

        <hr className="mt-4" />
        <div className="d-flex justify-content-center gap-3 mb-2">
          <a href="https://www.instagram.com/shreeprathacosmetics?igsh=MWxtdG1vY29xZXNmOQ==" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-danger fs-4">
            <FaInstagram />
          </a>
          <a href="https://wa.me/919981021204" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="text-success fs-4">
            <FaWhatsapp />
          </a>
          <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-primary fs-4">
            <FaFacebook />
          </a>
        </div>
        <div className="text-center small">
          &copy; {new Date().getFullYear()} SHREEPRATHA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;