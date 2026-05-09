import React, { useState } from "react";
import { sendAIRecommendation } from "../api/api";

function AIAssistant() {
  const [propertyType, setPropertyType] = useState("");
  const [areaType, setAreaType] = useState("");
  const [cameraCount, setCameraCount] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecommend = async (e) => {
    e.preventDefault();

    if (!propertyType || !cameraCount) {
      alert("Please select property type and camera count.");
      return;
    }

    try {
      setLoading(true);
      setRecommendation("");

      const data = await sendAIRecommendation({
        propertyType,
        areaType,
        cameraCount,
        budget,
        notes,
      });

      setRecommendation(data.recommendation);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      alert(error.message || "Failed to get AI recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <p style={styles.label}>Smart CCTV Planning</p>
          <h1 style={styles.title}>AI Assistant</h1>
          <p style={styles.subtitle}>
            Get a quick camera setup recommendation for your home, shop, office,
            or warehouse.
          </p>
        </div>

        <form onSubmit={handleRecommend} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.inputLabel}>Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                style={styles.input}
              >
                <option value="">Select property</option>
                <option value="Home">Home</option>
                <option value="Apartment">Apartment</option>
                <option value="Shop">Shop</option>
                <option value="Office">Office</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.inputLabel}>Area Type</label>
              <select
                value={areaType}
                onChange={(e) => setAreaType(e.target.value)}
                style={styles.input}
              >
                <option value="">Select area</option>
                <option value="Indoor">Indoor</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor and Outdoor">Indoor and Outdoor</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.inputLabel}>Camera Count</label>
              <select
                value={cameraCount}
                onChange={(e) => setCameraCount(e.target.value)}
                style={styles.input}
              >
                <option value="">Select count</option>
                <option value="1-2">1-2 cameras</option>
                <option value="3-4">3-4 cameras</option>
                <option value="5-8">5-8 cameras</option>
                <option value="9+">9+ cameras</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.inputLabel}>Budget</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Example: 300"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.inputLabel}>Extra Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: I need cameras for entrance, parking, and cashier area..."
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Thinking..." : "Get Recommendation"}
          </button>
        </form>

        {recommendation && (
          <div style={styles.resultBox}>
            <h2 style={styles.resultTitle}>Recommended Setup</h2>
            <pre style={styles.resultText}>{recommendation}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "50px 20px",
  },
  card: {
    maxWidth: "950px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "22px",
    padding: "35px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  label: {
    color: "#0b4ea2",
    fontWeight: "700",
    marginBottom: "8px",
    letterSpacing: "0.5px",
  },
  title: {
    fontSize: "42px",
    margin: "0",
    color: "#071b3a",
  },
  subtitle: {
    color: "#5f6b7a",
    fontSize: "16px",
    maxWidth: "650px",
    margin: "12px auto 0",
    lineHeight: "1.6",
  },
  form: {
    marginTop: "25px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },
  inputLabel: {
    fontWeight: "700",
    color: "#172033",
    marginBottom: "8px",
  },
  input: {
    height: "48px",
    borderRadius: "12px",
    border: "1px solid #d6dce5",
    padding: "0 14px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
  },
  textarea: {
    minHeight: "120px",
    borderRadius: "12px",
    border: "1px solid #d6dce5",
    padding: "14px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    height: "52px",
    background: "#0b4ea2",
    color: "#ffffff",
    border: "none",
    borderRadius: "14px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "5px",
  },
  resultBox: {
    marginTop: "30px",
    background: "#071b3a",
    color: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
  },
  resultTitle: {
    marginTop: "0",
    fontSize: "24px",
  },
  resultText: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.7",
    fontFamily: "inherit",
    fontSize: "15px",
  },
};

export default AIAssistant;