const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env");
}

try {
  const url = new URL(process.env.DATABASE_URL);
  console.log("Database host:", url.hostname);
  console.log("Database port:", url.port);
  console.log("Database name:", url.pathname);
} catch (error) {
  console.error("Invalid DATABASE_URL format:", error.message);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;