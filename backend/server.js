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
   MIDDLEWARE
============================== */

app.use(express.json());

/* ==============================
   CORS FIX
============================== */

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
  : [];

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://crc-camera-security-project.vercel.app",
  "https://crc-camera-security-project-o38zo30ap-crc-camera.vercel.app",
  ...envOrigins,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

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