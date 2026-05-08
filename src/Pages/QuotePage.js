import React, { useState } from "react";
import { sendQuoteRequest } from "../api/api";

export default function QuotePage() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    property_type: "",
    camera_count: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");

    /*
      Valid examples:
      71985165
      03985165
      03 985 165
      +96171985165
      96171985165
    */
    return /^(\+?961|0)?[3-9][0-9]{6,7}$/.test(cleaned);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "phone") {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    if (!isValidPhone(formData.phone)) {
      setPhoneError("Please enter a valid Lebanese phone number.");
      setLoading(false);
      return;
    }

    try {
      await sendQuoteRequest(formData);

      const whatsappMessage = `
New Installation Request - CRC Camera Security

Name: ${formData.full_name}
Phone: ${formData.phone}
Location: ${formData.location || "Not specified"}
Property Type: ${formData.property_type || "Not specified"}
Camera Count: ${formData.camera_count || "Not specified"}
Message: ${formData.message || "No message"}
`;

      const phoneNumber = "96171985165";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      setSuccess(
        "Request saved successfully! WhatsApp opened with your request message."
      );

      setFormData({
        full_name: "",
        phone: "",
        location: "",
        property_type: "",
        camera_count: "",
        message: "",
      });
    } catch (error) {
      alert(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="quotePage">
      <div className="quoteContainer">
        <div className="quoteInfo">
          <span className="quoteBadge">Installation Request</span>

          <h1>Request a Camera Installation Quote</h1>

          <p>
            Send your details and CRC Camera Security will contact you with the
            best CCTV installation solution for your home, shop, office, or
            business.
          </p>

          <div className="quoteHighlights">
            <div>
              <strong>1</strong>
              <span>Tell us your location and property type</span>
            </div>

            <div>
              <strong>2</strong>
              <span>Choose how many cameras you need</span>
            </div>

            <div>
              <strong>3</strong>
              <span>We contact you with the best solution</span>
            </div>
          </div>
        </div>

        <form className="quoteForm" onSubmit={handleSubmit}>
          <h2>Send Request</h2>

          {success && <div className="quoteSuccessMessage">{success}</div>}

          <div className="formGroup">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="formGroup">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+961 71 985 165"
              required
            />
            {phoneError && <p className="formWarning">{phoneError}</p>}
          </div>

          <div className="formGroup">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Mansourah, Bekaa..."
            />
          </div>

          <div className="formGroup">
            <label>Property Type</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
            >
              <option value="">Select type</option>
              <option value="Home">Home</option>
              <option value="Shop">Shop</option>
              <option value="Office">Office</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Camera Count</label>
            <select
              name="camera_count"
              value={formData.camera_count}
              onChange={handleChange}
            >
              <option value="">Select cameras</option>
              <option value="1-2">1-2 Cameras</option>
              <option value="3-4">3-4 Cameras</option>
              <option value="5-8">5-8 Cameras</option>
              <option value="9+">9+ Cameras</option>
            </select>
          </div>

          <div className="formGroup full">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us what you need..."
            />
          </div>

          <button type="submit" className="quoteSubmit" disabled={loading}>
            {loading ? "Sending..." : "Send Installation Request"}
          </button>
        </form>
      </div>
    </section>
  );
}