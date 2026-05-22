import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAuth.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  // CHANGE THESE TO YOUR PRIVATE ADMIN LOGIN
  const ADMIN_EMAIL = "admin@crc.com";
  const ADMIN_PASSWORD = "chris123";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");

    if (
      form.email.trim() === ADMIN_EMAIL &&
      form.password.trim() === ADMIN_PASSWORD
    ) {
      const fakeToken = "crc-admin-local-token";

      localStorage.setItem("adminToken", fakeToken);
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          name: "CRC Admin",
          email: ADMIN_EMAIL,
          role: "admin",
        })
      );

      navigate("/admin");
    } else {
      setMessage("Wrong email or password");
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <h1>Admin Login</h1>
        <p>Login to manage CRC Camera Security orders, quotes, and products.</p>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="admin@crc.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="auth-switch">Authorized CRC administrators only.</p>
      </div>
    </div>
  );
}