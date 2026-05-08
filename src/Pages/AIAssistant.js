import React, { useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function AIAssistant() {
  const [formData, setFormData] = useState({
    propertyType: "",
    areaType: "",
    cameraCount: "",
    budget: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAskAI = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation("");

    try {
      const response = await fetch(`${API_URL}/ai/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "AI request failed");
      }

      setRecommendation(result.recommendation);
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="aiPage">
      <div className="aiContainer">
        <div className="aiInfo">
          <span className="sectionLabel">AI Assistant</span>
          <h1>Find the Best Camera Setup</h1>
          <p>
            Answer a few questions and the AI assistant will suggest a suitable
            CCTV system for your place.
          </p>
        </div>

        <form className="aiForm" onSubmit={handleAskAI}>
          <h2>Ask CRC AI</h2>

          <div className="formGroup">
            <label>Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
            >
              <option value="">Select type</option>
              <option value="Home">Home</option>
              <option value="Shop">Shop</option>
              <option value="Office">Office</option>
              <option value="Warehouse">Warehouse</option>
              <option value="Business">Business</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Area Type</label>
            <select
              name="areaType"
              value={formData.areaType}
              onChange={handleChange}
            >
              <option value="">Select area</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
              <option value="Indoor and Outdoor">Indoor and Outdoor</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Camera Count</label>
            <select
              name="cameraCount"
              value={formData.cameraCount}
              onChange={handleChange}
              required
            >
              <option value="">Select cameras</option>
              <option value="1-2">1-2 Cameras</option>
              <option value="3-4">3-4 Cameras</option>
              <option value="5-8">5-8 Cameras</option>
              <option value="9+">9+ Cameras</option>
            </select>
          </div>

          <div className="formGroup">
            <label>Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Example: $200 - $500"
            />
          </div>

          <div className="formGroup full">
            <label>Extra Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Example: I need cameras for entrance and parking..."
            />
          </div>

          <button className="aiSubmit" type="submit" disabled={loading}>
            {loading ? "Thinking..." : "Get AI Recommendation"}
          </button>

          {recommendation && (
            <div className="aiResult">
              <h3>AI Recommendation</h3>
              <p>{recommendation}</p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}