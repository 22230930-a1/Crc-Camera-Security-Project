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

  const speakAssistant = () => {
    if (!window.speechSynthesis) {
      alert("Voice is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const text =
      "Hello, I am CRC AI Assistant. I can help you choose the best camera setup for your home, shop, office, or warehouse.";

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

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

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(
          "Your CCTV recommendation is ready. Please check the suggested setup below."
        );

        speech.lang = "en-US";
        speech.rate = 0.95;
        speech.pitch = 1;

        window.speechSynthesis.speak(speech);
      }
    } catch (error) {
      console.error("AI Assistant Error:", error);
      alert(error.message || "Failed to get AI recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* LEFT AI PERSON CARD */}
        <div style={styles.aiCard}>
          <div style={styles.avatarCircle}>
            <div style={styles.face}>
              <span style={styles.eye}></span>
              <span style={styles.eye}></span>
            </div>
          </div>

          <h2 style={styles.aiName}>CRC AI Assistant</h2>
          <p style={styles.aiRole}>Smart CCTV Consultant</p>

          <div style={styles.chatBubble}>
            Hi 👋 I can help you choose the best camera setup for your home,
            shop, office, or warehouse.
          </div>

          <button
            type="button"
            style={styles.statusBox}
            onClick={speakAssistant}
          >
            <span style={styles.statusDot}></span>
            Online and ready - click to hear me
          </button>
        </div>

        {/* RIGHT FORM CARD */}
        <div style={styles.card}>
          <div style={styles.header}>
            <p style={styles.label}>Smart CCTV Planning</p>
            <h1 style={styles.title}>AI Assistant</h1>
            <p style={styles.subtitle}>
              Fill the details below and I will recommend the best CCTV setup.
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
              {loading ? "Thinking..." : "Ask CRC AI"}
            </button>
          </form>

          {loading && (
            <div style={styles.thinkingBox}>
              <span style={styles.typingDot}></span>
              <span style={styles.typingDot}></span>
              <span style={styles.typingDot}></span>
              CRC AI is preparing your setup...
            </div>
          )}

          {recommendation && (
            <div style={styles.resultBox}>
              <div style={styles.resultHeader}>
                <div style={styles.smallAvatar}>AI</div>

                <div>
                  <h2 style={styles.resultTitle}>CRC AI Recommendation</h2>
                  <p style={styles.resultSub}>Suggested security setup</p>
                </div>
              </div>

              <pre style={styles.resultText}>{recommendation}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #eef4ff 0%, #f8fbff 45%, #ffffff 100%)",
    padding: "50px 20px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "330px 1fr",
    gap: "28px",
    alignItems: "start",
  },

  aiCard: {
    background: "#071b3a",
    color: "#ffffff",
    borderRadius: "26px",
    padding: "30px",
    textAlign: "center",
    boxShadow: "0 18px 45px rgba(7, 27, 58, 0.22)",
    position: "sticky",
    top: "25px",
  },

  avatarCircle: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    margin: "0 auto 20px",
    background:
      "linear-gradient(135deg, #1d7cff 0%, #77b6ff 45%, #ffffff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 12px 30px rgba(29,124,255,0.35)",
  },

  face: {
    width: "82px",
    height: "60px",
    borderRadius: "22px",
    background: "#071b3a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "14px",
  },

  eye: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    background: "#4ee7ff",
    display: "inline-block",
    boxShadow: "0 0 12px #4ee7ff",
  },

  aiName: {
    margin: "10px 0 5px",
    fontSize: "26px",
  },

  aiRole: {
    margin: "0 0 20px",
    color: "#b8c7dc",
    fontSize: "15px",
  },

  chatBubble: {
    background: "#ffffff",
    color: "#172033",
    padding: "18px",
    borderRadius: "18px",
    textAlign: "left",
    lineHeight: "1.6",
    fontSize: "15px",
    marginTop: "18px",
  },

  statusBox: {
    width: "100%",
    marginTop: "18px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "12px 14px",
    borderRadius: "14px",
    fontSize: "14px",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    cursor: "pointer",
  },

  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#30e07a",
    display: "inline-block",
  },

  card: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "35px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  },

  header: {
    marginBottom: "30px",
  },

  label: {
    color: "#0b4ea2",
    fontWeight: "800",
    marginBottom: "8px",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontSize: "13px",
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
    marginTop: "12px",
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
    height: "50px",
    borderRadius: "14px",
    border: "1px solid #d6dce5",
    padding: "0 14px",
    fontSize: "15px",
    outline: "none",
    background: "#ffffff",
  },

  textarea: {
    minHeight: "120px",
    borderRadius: "14px",
    border: "1px solid #d6dce5",
    padding: "14px",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  button: {
    width: "100%",
    height: "54px",
    background: "#0b4ea2",
    color: "#ffffff",
    border: "none",
    borderRadius: "16px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    marginTop: "5px",
    boxShadow: "0 10px 22px rgba(11,78,162,0.22)",
  },

  thinkingBox: {
    marginTop: "22px",
    background: "#eef5ff",
    color: "#0b4ea2",
    padding: "16px",
    borderRadius: "16px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  typingDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#0b4ea2",
    display: "inline-block",
  },

  resultBox: {
    marginTop: "30px",
    background: "#071b3a",
    color: "#ffffff",
    borderRadius: "22px",
    padding: "25px",
  },

  resultHeader: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    marginBottom: "18px",
  },

  smallAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#ffffff",
    color: "#0b4ea2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  resultTitle: {
    margin: "0",
    fontSize: "22px",
  },

  resultSub: {
    margin: "3px 0 0",
    color: "#b8c7dc",
    fontSize: "14px",
  },

  resultText: {
    whiteSpace: "pre-wrap",
    lineHeight: "1.7",
    fontFamily: "inherit",
    fontSize: "15px",
  },
};

export default AIAssistant;