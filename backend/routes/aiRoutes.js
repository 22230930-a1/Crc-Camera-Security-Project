const express = require("express");
const router = express.Router();

/* Test route */
router.get("/", (req, res) => {
  res.json({ message: "AI route working - smart recommendation mode" });
});

/* Smart CCTV recommendation without paid OpenAI quota */
router.post("/recommend", (req, res) => {
  try {
    const { propertyType, areaType, cameraCount, budget, notes } = req.body;

    if (!propertyType || !cameraCount) {
      return res.status(400).json({
        message: "Property type and camera count are required",
      });
    }

    let nvr = "4CH NVR";
    let cameraType = "PoE IP cameras";
    let advice = "Install cameras at entrances and main indoor areas.";
    let estimate = "A basic setup is suitable.";

    if (cameraCount === "1-2") {
      nvr = "4CH NVR";
      estimate = "Small setup suitable for apartments, small homes, or small shops.";
    } else if (cameraCount === "3-4") {
      nvr = "4CH NVR";
      estimate = "Good setup for a home, shop, or small office.";
    } else if (cameraCount === "5-8") {
      nvr = "8CH NVR";
      estimate = "Medium setup suitable for larger homes, shops, or offices.";
    } else if (cameraCount === "9+") {
      nvr = "16CH NVR";
      estimate = "Large setup suitable for warehouses, businesses, or wide areas.";
    }

    if (areaType === "Outdoor") {
      cameraType = "Outdoor waterproof PoE IP cameras with night vision";
      advice = "Focus on entrances, parking, outdoor walls, and blind spots.";
    } else if (areaType === "Indoor") {
      cameraType = "Indoor PoE/IP cameras with clear image quality";
      advice = "Place cameras in reception areas, hallways, cash points, and main rooms.";
    } else if (areaType === "Indoor and Outdoor") {
      cameraType = "Mixed indoor and outdoor PoE IP cameras";
      advice = "Use outdoor cameras for entrances and indoor cameras for rooms or shop areas.";
    }

    if (propertyType === "Shop") {
      advice += " Add one camera facing the cashier area.";
    }

    if (propertyType === "Warehouse") {
      advice += " Use wide-angle coverage and consider more cameras for corners.";
    }

    const recommendation = `
Recommended setup for your ${propertyType}:

Camera type:
${cameraType}

Suggested recorder:
${nvr}

Camera count:
${cameraCount}

Budget:
${budget ? `$${budget}` : "Not specified"}

Installation advice:
${advice}

Summary:
${estimate}

Extra notes:
${notes || "No extra notes provided."}
`;

    res.json({ recommendation });
  } catch (error) {
    console.error("AI route error:", error);
    res.status(500).json({
      message: "AI recommendation failed",
      error: error.message,
    });
  }
});

module.exports = router;