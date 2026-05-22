import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

export default function Navbar() {
  const { total, itemsCount } = useContext(CartContext);

  const [showAdminLink, setShowAdminLink] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminNavPass, setAdminNavPass] = useState("");
  const [adminNavError, setAdminNavError] = useState("");

  // This only hides the admin link visually.
  // Real security is still your admin login + backend protection.
  const NAV_ADMIN_PASSWORD = "crc2026";

  const handleAdminUnlock = (e) => {
    e.preventDefault();

    if (adminNavPass === NAV_ADMIN_PASSWORD) {
      setShowAdminLink(true);
      setShowAdminPrompt(false);
      setAdminNavPass("");
      setAdminNavError("");
    } else {
      setAdminNavError("Wrong access code");
    }
  };

  const closeAdminPrompt = () => {
    setShowAdminPrompt(false);
    setAdminNavPass("");
    setAdminNavError("");
  };

  return (
    <header className="topbar">
      <Link to="/" className="logo">
        <div className="logoBox">
          <span className="crc">CRC</span>
          <span className="crc-mid">CAMERA SECURITY</span>
        </div>
      </Link>

      <nav className="navLinks">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/quote">Request Installation</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/ai">AI Assistant</Link>

        {!showAdminLink ? (
          <button
            type="button"
            className="nav-admin-lock"
            onClick={() => setShowAdminPrompt(true)}
          >
            Admin
          </button>
        ) : (
          <Link to="/admin-login" className="nav-admin-btn">
            Admin Login
          </Link>
        )}
      </nav>

      <Link to="/cart" className="cartArea" aria-label="Open cart">
        <div className="cartTotal">${total.toFixed(2)}</div>

        <div className="cartIconWrap">
          <span className="cartIcon">🛒</span>
          <span className="badge">{itemsCount}</span>
        </div>
      </Link>

      {showAdminPrompt && (
        <div className="admin-unlock-overlay">
          <div className="admin-unlock-box">
            <button
              type="button"
              className="admin-unlock-close"
              onClick={closeAdminPrompt}
            >
              ×
            </button>

            <h3>Admin Access</h3>
            <p>Enter the private CRC admin access code.</p>

            <form onSubmit={handleAdminUnlock}>
              <input
                type="password"
                placeholder="Enter access code"
                value={adminNavPass}
                onChange={(e) => setAdminNavPass(e.target.value)}
                autoFocus
              />

              {adminNavError && (
                <span className="admin-unlock-error">{adminNavError}</span>
              )}

              <button type="submit">Unlock</button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}