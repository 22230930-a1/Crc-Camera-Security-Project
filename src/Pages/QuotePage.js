import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function QuotePage() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    location: "",
    property_type: "",
    camera_count: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^(\+?961|0)?[3-9][0-9]{6,7}$/.test(cleaned);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccess("");
    setErrorMsg("");

    if (e.target.name === "phone") {
      setPhoneError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double click duplicate save
    if (loading) return;

    setLoading(true);
    setSuccess("");
    setErrorMsg("");
    setPhoneError("");

    if (!isValidPhone(formData.phone)) {
      setPhoneError("Please enter a valid Lebanese phone number.");
      setLoading(false);
      return;
    }

    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
          "Supabase keys are missing. Check Netlify environment variables."
        );
      }

      const cleanName = formData.full_name.trim();
      const cleanPhone = formData.phone.trim();
      const cleanEmail =
        formData.email && formData.email.trim() !== ""
          ? formData.email.trim()
          : null;

      // ONE SAVE ONLY: save request in Supabase quote_requests
      const { error: quoteError } = await supabase.from("quote_requests").insert([
        {
          full_name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          location: formData.location || null,
          service_type: "Installation",
          property_type: formData.property_type || null,
          camera_count: formData.camera_count || null,
          message: formData.message || null,
          status: "pending",
        },
      ]);

      if (quoteError) throw quoteError;

      // WhatsApp message after successful save
      const whatsappMessage = `
New Installation Request - CRC Camera Security

Name: ${cleanName}
Phone: ${cleanPhone}
Email: ${cleanEmail || "Not specified"}
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
        "Your installation request was saved successfully. WhatsApp opened to send your request."
      );

      setFormData({
        full_name: "",
        phone: "",
        email: "",
        location: "",
        property_type: "",
        camera_count: "",
        message: "",
      });
    } catch (error) {
      console.log("Quote request error:", error);
      setErrorMsg(error.message || "Error saving quote request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="quotePagePro">
      <div className="quoteHeroPro">
        <span>CRC Camera Security</span>
        <h1>Request Installation</h1>
        <p>
          Fill this form and CRC Camera Security will contact you with the best
          CCTV solution for your home, shop, office, or business.
        </p>
      </div>

      <div className="quoteContainerPro">
        <div className="quoteInfoPro">
          <span className="quoteBadgePro">Installation Request</span>

          <h2>Professional CCTV Installation</h2>

          <p>
            Tell us your location, property type, and camera count. We will
            review your request and contact you with the best solution.
          </p>

          <div className="quoteStepsPro">
            <div>
              <strong>1</strong>
              <span>Enter your details</span>
            </div>

            <div>
              <strong>2</strong>
              <span>Choose cameras needed</span>
            </div>

            <div>
              <strong>3</strong>
              <span>We contact you on WhatsApp</span>
            </div>
          </div>
        </div>

        <form className="quoteFormPro" onSubmit={handleSubmit}>
          <h2>Send Request</h2>

          {success && <div className="quoteMessage success">{success}</div>}
          {errorMsg && <div className="quoteMessage error">{errorMsg}</div>}

          <div className="quoteFormGrid">
            <div className="formGroupPro">
              <label>Full Name</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="formGroupPro">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+961 71 985 165"
                required
              />
              {phoneError && <p className="formWarningPro">{phoneError}</p>}
            </div>

            <div className="formGroupPro">
              <label>Email Optional</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
            </div>

            <div className="formGroupPro">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Mansourah, West Bekaa..."
              />
            </div>

            <div className="formGroupPro">
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

            <div className="formGroupPro">
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

            <div className="formGroupPro full">
              <label>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us where you want cameras, indoor/outdoor, cable distance..."
                rows="5"
              />
            </div>
          </div>

          <button type="submit" className="quoteSubmitPro" disabled={loading}>
            {loading ? "Sending..." : "Send Installation Request"}
          </button>
        </form>
      </div>
    </section>
  );
}