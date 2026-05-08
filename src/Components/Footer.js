import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer footerPro">
      <div className="container footerGrid">
        <div className="footerBrandBox">
          <h3>CRC Camera Security</h3>
          <p>
            Professional CCTV installation, NVR setup, mobile viewing, and
            security accessories for homes and businesses in Lebanon.
          </p>

          <div className="footerBadges">
            <span>CCTV</span>
            <span>NVR</span>
            <span>Installation</span>
          </div>
        </div>

        <div className="footerColumn">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div className="footerColumn">
          <h4>Products</h4>
          <Link to="/products?category=Cameras">Security Cameras</Link>
          <Link to="/products?category=NVRs">NVR Recorders</Link>
          <Link to="/products?category=Accessories">Accessories</Link>
          <Link to="/contact">Installation Request</Link>
        </div>

        <div className="footerColumn footerContact">
          <h4>Contact</h4>
          <p>Need a camera system or installation?</p>

       <a
  href="https://wa.me/96171985165"
  target="_blank"
  rel="noopener noreferrer"
  className="footerWhatsapp"
>
  <span className="waIcon">☎</span>
  <span className="waText">WhatsApp Us</span>
  <span className="waArrow">→</span>
</a>
        </div>
      </div>

      <div className="container footerBottom">
        <span>© {year} CRC Camera Security. All rights reserved.</span>
        <span>Security solutions for homes and businesses.</span>
      </div>
    </footer>
  );
}