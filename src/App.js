import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "./styles.css";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Admin from "./Pages/Admin";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Contact from "./Pages/Contact";
import FAQ from "./Pages/FAQ";
import QuotePage from "./Pages/QuotePage";
import AIAssistant from "./Pages/AIAssistant";

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
          <Route path="/admin" element={<Admin />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/ai" element={<AIAssistant />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
