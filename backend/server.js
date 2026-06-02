const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRoutes = require("./routes/productsRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* ==============================
   CORS FIX
============================== */

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==============================
   MIDDLEWARE
============================== */

app.use(express.json());

/* ==============================
   TEST ROUTES
============================== */

app.get("/", (req, res) => {
  res.json({ message: "CRC Camera Security backend is running" });
});

app.get("/api", (req, res) => {
  res.json({
    message: "CRC Camera Security API is running",
    routes: ["/api/products", "/api/quotes", "/api/orders", "/api/ai", "/api/auth"],
  });
});

/* ==============================
   API ROUTES
============================== */

app.use("/api/products", productsRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);

/* ==============================
   404 HANDLER
============================== */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});