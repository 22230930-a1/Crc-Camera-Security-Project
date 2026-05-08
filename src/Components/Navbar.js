import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

export default function Navbar() {
  const { total, itemsCount } = useContext(CartContext);

  return (
    <header className="topbar">
      <Link to="/" className="logo">
       <Link to="/" className="logo">
  <div className="logoBox">
    <span className="crc">CRC</span>
    <span className="crc-mid">CAMERA SECURITY</span>
  </div>
</Link>
      </Link>

      <nav className="navLinks">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/quote">Request Installation</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/ai">AI Assistant</Link>
      </nav>

      <Link to="/cart" className="cartArea" aria-label="Open cart">
        <div className="cartTotal">${total.toFixed(2)}</div>

        <div className="cartIconWrap">
          <span className="cartIcon">🛒</span>
          <span className="badge">{itemsCount}</span>
        </div>
      </Link>
    </header>
  );
}