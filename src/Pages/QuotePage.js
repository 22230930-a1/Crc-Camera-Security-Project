import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function RequestInstallation() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    location: "",
    camera_count: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase keys missing. Check Netlify environment variables.");
      }

      if (!form.full_name.trim()) {
        throw new Error("Please enter your full name.");
      }

      if (!form.phone.trim()) {
        throw new Error("Please enter your phone number.");
      }

      if (!form.location.trim()) {
        throw new Error("Please enter your location.");
      }

      // 1. Save customer request in quote_requests
      const { data: requestData, error: requestError } = await supabase
        .from("quote_requests")
        .insert([
          {
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim() || null,
            location: form.location.trim(),
            service_type: "Installation",
            camera_count: form.camera_count || null,
            message: form.message.trim() || null,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (requestError) throw requestError;

      // 2. Also save in installations table for admin follow-up
      const { error: installationError } = await supabase
        .from("installations")
        .insert([
          {
            request_id: requestData.request_id,
            customer_id: null,
            install_date: null,
            technician_name: null,
            installation_status: "pending",
            note: form.message.trim() || null,
          },
        ]);

      if (installationError) throw installationError;

      alert("Installation request saved successfully!");

      setForm({
        full_name: "",
        phone: "",
        email: "",
        location: "",
        camera_count: "",
        message: "",
      });
    } catch (error) {
      console.log("Installation request error:", error);
      alert(error.message || "Error saving quote request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="request-installation-page">
      <div className="request-installation-container">
        <div className="request-installation-left">
          <span>CRC Camera Security</span>
          <h1>Request Installation</h1>
          <p>
            Fill this form and CRC Camera Security will contact you with the best
            solution for your place.
          </p>
        </div>

        <form className="request-installation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+961 71 985 165"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Optional</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Mansourah, West Bekaa..."
              required
            />
          </div>

          <div className="form-group">
            <label>Camera Count</label>
            <select
              name="camera_count"
              value={form.camera_count}
              onChange={handleChange}
            >
              <option value="">Select cameras</option>
              <option value="1-2 cameras">1 - 2 cameras</option>
              <option value="3-4 cameras">3 - 4 cameras</option>
              <option value="5-8 cameras">5 - 8 cameras</option>
              <option value="More than 8 cameras">More than 8 cameras</option>
            </select>
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us where you want cameras, indoor/outdoor, cable distance..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Send Installation Request"}
          </button>
        </form>
      </div>
    </section>
  );
}