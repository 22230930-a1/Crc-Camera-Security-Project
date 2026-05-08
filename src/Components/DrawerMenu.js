import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function DrawerMenu({ open, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className={`drawerOverlay ${open ? "show" : ""}`} onClick={onClose} />
      <aside className={`drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawerHeader">
          <div className="drawerTitle">Menu</div>
          <button className="iconBtn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav className="drawerNav">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/products" onClick={onClose}>Products</Link>
          <Link to="/cart" onClick={onClose}>Cart</Link>
          <Link to="/contact" onClick={onClose}>Contact </Link>
          <Link to="/faq" onClick={onClose}>FAQ</Link>
        </nav>
      </aside>
    </>
  );
}
