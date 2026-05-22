import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminAuth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    adminCode: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/auth/admin/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      setMessage("Admin account created successfully");
      setTimeout(() => {
        navigate("/admin-login");
      }, 1000);
    } catch (error) {
      setMessage("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card">
        <h1>Admin Sign Up</h1>
        <p>Create an admin account using the private CRC admin code.</p>

        {message && <div className="auth-message">{message}</div>}

        <form onSubmit={handleSignup}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Admin name"
            value={form.name}
            onChange={handleChange}
            required
          />

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
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>Admin Secret Code</label>
          <input
            type="password"
            name="adminCode"
            placeholder="Enter admin code"
            value={form.adminCode}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Admin Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have account? <Link to="/admin-login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default AdminSignup;