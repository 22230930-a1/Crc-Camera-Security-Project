import React from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <section className="contactPage">
      <div className="contactContainer">
        <div className="contactInfoCard">
          <span className="contactBadge">Contact CRC</span>

          <h1>Contact Us</h1>

          <p>
            Request a camera installation, ask about products, or get a quote
            for your home, shop, office, or business.
          </p>

          <div className="contactList">
            <div className="contactItem">
              <span>☎</span>
              <div>
                <strong>Phone</strong>
                <p>+961 71 985 165</p>
              </div>
            </div>

            <div className="contactItem">
              <span>💬</span>
              <div>
                <strong>WhatsApp</strong>
                <p>+961 71 985 165</p>
              </div>
            </div>

            <div className="contactItem">
              <span>✉</span>
              <div>
                <strong>Email</strong>
                <p>crccamera2@gmail.com</p>
              </div>
            </div>

            <div className="contactItem">
              <span>📍</span>
              <div>
                <strong>Location</strong>
                <p>Lebanon, Mansourah</p>
              </div>
            </div>
          </div>

          <div className="contactActions">
            <a
              href="https://wa.me/96171985165"
              target="_blank"
              rel="noopener noreferrer"
              className="contactWhatsapp"
            >
              WhatsApp Us →
            </a>

            <Link to="/quote" className="contactQuoteBtn">
              Request Installation
            </Link>
          </div>
        </div>

        <div className="contactSideCard">
          <h2>Need a security system?</h2>
          <p>
            We help you choose the right cameras, NVR recorder, and mobile
            viewing setup based on your place and budget.
          </p>

          <div className="sideFeature">
            <strong>✓</strong>
            <span>Home camera installation</span>
          </div>

          <div className="sideFeature">
            <strong>✓</strong>
            <span>Shop and business security</span>
          </div>

          <div className="sideFeature">
            <strong>✓</strong>
            <span>NVR setup and mobile viewing</span>
          </div>

          <div className="mapBox">
            <span>📍</span>
            <p>Serving customers in Lebanon</p>
          </div>
        </div>
      </div>
    </section>
  );
}