const express = require("express");
const cors = require("cors");
require("dotenv").config();

const productsRoutes = require("./routes/productsRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const orderRoutes = require("./routes/orderRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

/* ==============================
   CORS
   Allows local frontend + deployed frontend
============================== */

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://crc-camera-security.netlify.app",
  ...envOrigins,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, curl, and direct browser API requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
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
    routes: ["/api/products", "/api/quotes", "/api/orders", "/api/ai"],
  });
});

/* ==============================
   API ROUTES
============================== */

app.use("/api/products", productsRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

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