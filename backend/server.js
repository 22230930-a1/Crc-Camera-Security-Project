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
   Allows local frontend + Netlify frontend
============================== */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "http://localhost:5174",
  "https://crc-camera-security.netlify.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / direct browser requests
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
   TEST ROUTE
============================== */

app.get("/", (req, res) => {
  res.json({ message: "CRC Camera Security backend is running" });
});

/* ==============================
   API ROUTES
============================== */

app.use("/api/products", productsRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ai", aiRoutes);

/* ==============================
   START SERVER
============================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});