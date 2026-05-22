import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Contact from "./Pages/Contact";
import FAQ from "./Pages/FAQ";
import QuotePage from "./Pages/QuotePage";
import AIAssistant from "./Pages/AIAssistant";
import AboutMore from "./Pages/AboutMore";
import Admin from "./Pages/Admin";
import AdminLogin from "./Pages/AdminLogin";
import AdminSignup from "./Pages/AdminSignup";

import ProtectedAdminRoute from "./Components/ProtectedAdminRoute";

export default function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/about-more" element={<AboutMore />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-signup" element={<AdminSignup />} />

          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <Admin />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}