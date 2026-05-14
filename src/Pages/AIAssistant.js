import React, { useState } from "react";

function AIAssistant() {
  const [propertyType, setPropertyType] = useState("");
  const [areaType, setAreaType] = useState("");
  const [cameraCount, setCameraCount] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const getCameraNumber = () => {
    if (cameraCount === "1-2") return 2;
    if (cameraCount === "3-4") return 4;
    if (cameraCount === "5-8") return 8;
    if (cameraCount === "9+") return 12;
    return 0;
  };

  const getNvrType = (count) => {
    if (count <= 4) return "4CH PoE NVR";
    if (count <= 8) return "8CH PoE NVR";
    if (count <= 16) return "16CH PoE NVR";
    return "32CH PoE NVR";
  };

  const getStorage = (count) => {
    if (count <= 4) {
      return "1TB HDD minimum. Choose 2TB if you want more recording days.";
    }

    if (count <= 8) {
      return "2TB HDD minimum. Choose 4TB for longer recording history.";
    }

    return "4TB HDD or more, depending on how many days you want to keep recordings.";
  };

  const getCameraType = () => {
    if (areaType === "Indoor") {
      return "Indoor dome cameras, preferably 5MP, because they look clean and cover rooms, shops, and offices nicely.";
    }

    if (areaType === "Outdoor") {
      return "Outdoor bullet cameras, preferably 5MP or 8MP, because they are stronger for entrances, parking, gates, and outside areas.";
    }

    if (areaType === "Indoor and Outdoor") {
      return "Indoor dome cameras for inside areas and outdoor bullet cameras for outside areas.";
    }

    return "Dome cameras are recommended for indoor areas, and bullet cameras are recommended for outdoor areas.";
  };

  const getPlacementAdvice = () => {
    if (propertyType === "Home" || propertyType === "Apartment") {
      return `
Recommended Camera Placement:
- Main entrance
- Living room or hallway
- Parking or gate
- Balcony, back door, or garden area`;
    }

    if (propertyType === "Shop") {
      return `
Recommended Camera Placement:
- Cashier area
- Shop entrance
- Product shelves
- Storage room
- Outdoor front view if needed`;
    }

    if (propertyType === "Office") {
      return `
Recommended Camera Placement:
- Reception area
- Office entrance
- Main hallway
- Storage/server room
- Parking or outside entrance`;
    }

    if (propertyType === "Warehouse") {
      return `
Recommended Camera Placement:
- Main gate
- Loading/unloading area
- Storage aisles
- High indoor corners
- Back entrance
- Parking area`;
    }

    return `
Recommended Camera Placement:
- Main entrance
- Important indoor area
- Outdoor entrance or parking
- Storage or back door if available`;
  };

  const getBudgetAdvice = () => {
    const value = Number(budget);

    if (!budget) {
      return "Budget was not entered, so the recommendation is based on a standard professional setup.";
    }

    if (value < 200) {
      return "Your budget is low. Choose a basic 2MP or 5MP setup with essential recording.";
    }

    if (value <= 500) {
      return "Your budget is medium. I recommend 5MP cameras with good night vision and a reliable PoE NVR.";
    }

    return "Your budget is strong. I recommend 8MP/4K cameras, PoE connection, Full Color night vision, and a stronger NVR.";
  };

  const getNotesAnswer = () => {
    const cleanNotes = notes.trim();

    if (!cleanNotes) return "";

    const lowerNotes = cleanNotes.toLowerCase();
    let answer = "";

    if (lowerNotes.includes("clear") || lowerNotes.includes("quality")) {
      answer +=
        "- You asked for clear quality, so choose at least 5MP cameras. For sharper details, choose 8MP/4K cameras.\n";
    }

    if (lowerNotes.includes("night") || lowerNotes.includes("dark")) {
      answer +=
        "- You mentioned night or dark areas, so Full Color or strong IR night vision cameras are recommended.\n";
    }

    if (lowerNotes.includes("record") || lowerNotes.includes("recording")) {
      answer +=
        "- You mentioned recording, so you need an NVR with HDD storage. Bigger HDD means more recording days.\n";
    }

    if (lowerNotes.includes("wifi") || lowerNotes.includes("wireless")) {
      answer +=
        "- You mentioned Wi-Fi/wireless. Wi-Fi cameras are easier, but wired PoE cameras are more stable for professional security.\n";
    }

    if (lowerNotes.includes("outside") || lowerNotes.includes("outdoor")) {
      answer +=
        "- You mentioned outdoor areas, so use waterproof bullet cameras with strong night vision.\n";
    }

    if (lowerNotes.includes("inside") || lowerNotes.includes("indoor")) {
      answer +=
        "- You mentioned indoor areas, so dome cameras are better because they look clean and cover rooms nicely.\n";
    }

    if (
      lowerNotes.includes("price") ||
      lowerNotes.includes("cost") ||
      lowerNotes.includes("cheap")
    ) {
      answer +=
        "- You mentioned price/cost. The final price depends on camera quantity, NVR type, HDD size, cable length, and installation place.\n";
    }

    if (lowerNotes.includes("phone") || lowerNotes.includes("mobile")) {
      answer +=
        "- You mentioned phone/mobile view, so the NVR should be configured with mobile app viewing after installation.\n";
    }

    if (
      lowerNotes.includes("entrance") ||
      lowerNotes.includes("door") ||
      lowerNotes.includes("gate")
    ) {
      answer +=
        "- You mentioned entrance/door/gate, so place one camera facing the entrance clearly to capture faces and movement.\n";
    }

    if (lowerNotes.includes("parking") || lowerNotes.includes("garage")) {
      answer +=
        "- You mentioned parking/garage, so place an outdoor bullet camera covering the full parking view.\n";
    }

    if (lowerNotes.includes("cashier")) {
      answer +=
        "- You mentioned cashier, so place one indoor dome camera directly covering the cashier area.\n";
    }

    if (answer === "") {
      answer =
        "- Based on your notes, the setup should be chosen according to the place, lighting, recording needs, and important camera positions.\n";
    }

    return `\nBased on Your Notes:\n${answer}`;
  };

  const handleRecommend = (e) => {
    e.preventDefault();

    if (!propertyType || !cameraCount) {
      alert("Please select property type and camera count.");
      return;
    }

    setLoading(true);
    setRecommendation("");

    setTimeout(() => {
      const count = getCameraNumber();
      const nvr = getNvrType(count);
      const storage = getStorage(count);
      const cameraType = getCameraType();
      const placement = getPlacementAdvice();
      const budgetAdvice = getBudgetAdvice();
      const notesAnswer = getNotesAnswer();

      const finalRecommendation = `
CRC AI Professional Recommendation

Property Type:
${propertyType}

Area Type:
${areaType || "Not selected"}

Camera Count:
${cameraCount}

Best Camera Type:
${cameraType}

Best NVR Type:
${nvr}

Storage Recommendation:
${storage}
${placement}

Budget Advice:
${budgetAdvice}

Professional Advice:
For ${propertyType}, this setup is suitable because it gives good coverage, clear recording, mobile viewing support, and future upgrade options.${notesAnswer}
`;

      setRecommendation(finalRecommendation);
      setLoading(false);
    }, 700);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.aiCard}>
          <div style={styles.robotWrap}>
            <div style={styles.robotGlow}></div>

            <div style={styles.robotAntenna}>
              <span style={styles.antennaDot}></span>
            </div>

            <div style={styles.robotHead}>
              <div style={styles.robotFace}>
                <span style={styles.robotEye}></span>
                <span style={styles.robotEye}></span>
              </div>
            </div>

            <div style={{ ...styles.robotArm, ...styles.leftArm }}>
              <span style={styles.robotHand}></span>
            </div>

            <div style={{ ...styles.robotArm, ...styles.rightArm }}>
              <span style={styles.robotHand}></span>
            </div>

            <div style={styles.robotBody}>
              <div style={styles.robotChestLine}></div>
              <div style={styles.robotButton}></div>
            </div>

            <div style={{ ...styles.robotLeg, ...styles.leftLeg }}>
              <span style={styles.robotFoot}></span>
            </div>

            <div style={{ ...styles.robotLeg, ...styles.rightLeg }}>
              <span style={styles.robotFoot}></span>
            </div>
          </div>

          <h2 style={styles.aiName}>CRC AI Assistant</h2>
          <p style={styles.aiRole}>Smart CCTV Consultant</p>

          <div style={styles.chatBubble}>
            Hi 👋 I help you choose the right camera type, NVR, storage, and
            best camera placement.
          </div>

          <div style={styles.statusBox}>
            <span style={styles.statusDot}></span>
            Online and ready
          </div>
        </div>

        <div style={styles.mainColumn}>
          <div style={styles.card}>
            <div style={styles.header}>
              <p style={styles.label}>Smart CCTV Planning</p>
              <h1 style={styles.title}>AI Assistant</h1>
              <p style={styles.subtitle}>
                Select your project details and get a professional camera setup
                recommendation.
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
                    <option value="Indoor and Outdoor">
                      Indoor and Outdoor
                    </option>
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
                  placeholder="Example: I need clear cameras for entrance, parking, recording, and night vision..."
                  style={styles.textarea}
                />
              </div>

              <button type="submit" style={styles.button} disabled={loading}>
                {loading
                  ? "Preparing Recommendation..."
                  : "Get Professional Recommendation"}
              </button>
            </form>

            {loading && (
              <div style={styles.thinkingBox}>
                <span style={styles.typingDot}></span>
                <span style={styles.typingDot}></span>
                <span style={styles.typingDot}></span>
                CRC AI is preparing your CCTV setup...
              </div>
            )}

            {recommendation && (
              <div style={styles.resultBox}>
                <div style={styles.resultHeader}>
                  <div style={styles.smallAvatar}>AI</div>

                  <div>
                    <h2 style={styles.resultTitle}>CRC AI Recommendation</h2>
                    <p style={styles.resultSub}>Professional suggested setup</p>
                  </div>
                </div>

                <pre style={styles.resultText}>{recommendation}</pre>
              </div>
            )}
          </div>
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
    gridTemplateColumns: "390px 1fr",
    gap: "28px",
    alignItems: "start",
  },

  mainColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  aiCard: {
    background:
      "radial-gradient(circle at top, rgba(77,166,255,0.3), transparent 36%), linear-gradient(180deg, #071b3a 0%, #06172f 100%)",
    color: "#ffffff",
    borderRadius: "32px",
    padding: "36px 30px",
    textAlign: "center",
    boxShadow: "0 24px 60px rgba(7, 27, 58, 0.28)",
    position: "sticky",
    top: "25px",
    overflow: "hidden",
  },

  robotWrap: {
    width: "230px",
    height: "300px",
    margin: "0 auto 22px",
    position: "relative",
  },

  robotGlow: {
    width: "210px",
    height: "210px",
    background: "rgba(72, 175, 255, 0.22)",
    borderRadius: "50%",
    filter: "blur(22px)",
    position: "absolute",
    top: "45px",
    left: "50%",
    transform: "translateX(-50%)",
  },

  robotAntenna: {
    width: "8px",
    height: "34px",
    background: "linear-gradient(#8deeff, #2d8cff)",
    borderRadius: "20px",
    position: "absolute",
    top: "4px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 5,
  },

  antennaDot: {
    width: "20px",
    height: "20px",
    background: "#57e7ff",
    borderRadius: "50%",
    position: "absolute",
    top: "-14px",
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 0 20px rgba(87,231,255,0.9)",
  },

  robotHead: {
    width: "145px",
    height: "105px",
    background: "linear-gradient(145deg, #5aaeff, #d9efff)",
    borderRadius: "42px",
    position: "absolute",
    top: "36px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 18px 38px rgba(72,162,255,0.32)",
    zIndex: 4,
  },

  robotFace: {
    width: "108px",
    height: "64px",
    background: "#06172f",
    borderRadius: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },

  robotEye: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#55eaff",
    display: "inline-block",
    boxShadow: "0 0 18px #55eaff",
  },

  robotBody: {
    width: "128px",
    height: "112px",
    background: "linear-gradient(160deg, #ffffff, #9dccff)",
    borderRadius: "34px 34px 42px 42px",
    position: "absolute",
    top: "138px",
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 18px 38px rgba(75,165,255,0.22)",
    zIndex: 3,
  },

  robotChestLine: {
    width: "52px",
    height: "9px",
    background: "#06172f",
    borderRadius: "20px",
    position: "absolute",
    top: "34px",
    left: "50%",
    transform: "translateX(-50%)",
    opacity: 0.9,
  },

  robotButton: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#4ee7ff",
    position: "absolute",
    top: "60px",
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 0 18px rgba(78,231,255,0.95)",
  },

  robotArm: {
    width: "26px",
    height: "92px",
    background: "linear-gradient(180deg, #91d4ff, #ffffff)",
    borderRadius: "30px",
    position: "absolute",
    top: "142px",
    zIndex: 2,
    boxShadow: "0 12px 25px rgba(51,145,255,0.22)",
  },

  leftArm: {
    left: "18px",
    transform: "rotate(22deg)",
  },

  rightArm: {
    right: "18px",
    transform: "rotate(-22deg)",
  },

  robotHand: {
    width: "34px",
    height: "34px",
    background: "#58e6ff",
    borderRadius: "50%",
    position: "absolute",
    bottom: "-18px",
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 0 18px rgba(88,230,255,0.8)",
  },

  robotLeg: {
    width: "26px",
    height: "55px",
    background: "linear-gradient(180deg, #ffffff, #7dbdff)",
    borderRadius: "20px",
    position: "absolute",
    top: "238px",
    zIndex: 2,
  },

  leftLeg: {
    left: "78px",
  },

  rightLeg: {
    right: "78px",
  },

  robotFoot: {
    width: "46px",
    height: "18px",
    background: "#5aaeff",
    borderRadius: "22px",
    position: "absolute",
    bottom: "-9px",
    left: "50%",
    transform: "translateX(-50%)",
    boxShadow: "0 10px 18px rgba(51,145,255,0.25)",
  },

  aiName: {
    margin: "10px 0 5px",
    fontSize: "27px",
    fontWeight: "900",
    letterSpacing: "-0.4px",
  },

  aiRole: {
    margin: "0 0 20px",
    color: "#b8c7dc",
    fontSize: "15px",
  },

  chatBubble: {
    background: "rgba(255,255,255,0.96)",
    color: "#172033",
    padding: "20px",
    borderRadius: "22px",
    textAlign: "left",
    lineHeight: "1.65",
    fontSize: "15.5px",
    marginTop: "18px",
    boxShadow: "0 16px 35px rgba(0,0,0,0.13)",
  },

  statusBox: {
    width: "100%",
    marginTop: "18px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "13px 14px",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "700",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#30e07a",
    display: "inline-block",
    boxShadow: "0 0 12px rgba(48,224,122,0.8)",
  },

  card: {
    background: "#ffffff",
    borderRadius: "26px",
    padding: "35px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
  },

  header: {
    marginBottom: "25px",
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