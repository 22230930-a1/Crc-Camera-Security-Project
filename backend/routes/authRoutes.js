const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// TEMP memory admin storage if you don't have DB yet
// Better later: save admins in SQL database
let admins = [];

// Admin Sign Up
router.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;

    if (!name || !email || !password || !adminCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (adminCode !== process.env.ADMIN_SIGNUP_CODE) {
      return res.status(403).json({ message: "Invalid admin code" });
    }

    const existingAdmin = admins.find((admin) => admin.email === email);
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: "admin",
    };

    admins.push(newAdmin);

    res.status(201).json({ message: "Admin account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = admins.find((admin) => admin.email === email);

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;