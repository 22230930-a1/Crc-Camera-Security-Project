const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET all quote requests */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM quote_requests ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch quotes error:", error);
    res.status(500).json({
      message: "Error fetching quote requests",
      error: error.message,
    });
  }
});

/* POST new quote request */
router.post("/", async (req, res) => {
  try {
    const {
      full_name,
      phone,
      location,
      property_type,
      camera_count,
      message,
    } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({
        message: "Full name and phone are required",
      });
    }

    const result = await db.query(
      `INSERT INTO quote_requests
      (full_name, phone, location, property_type, camera_count, message)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        full_name,
        phone,
        location || null,
        property_type || null,
        camera_count || null,
        message || null,
      ]
    );

    res.status(201).json({
      message: "Quote request saved successfully",
      quote: result.rows[0],
    });
  } catch (error) {
    console.error("Quote error:", error);
    res.status(500).json({
      message: "Error saving quote request",
      error: error.message,
    });
  }
});

module.exports = router;