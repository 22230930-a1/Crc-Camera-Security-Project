const express = require("express");
const router = express.Router();
const db = require("../db");

/* GET all orders */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch orders error:", error);

    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

/* POST new order */
router.post("/", async (req, res) => {
  const client = await db.connect();

  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      payment_method,
      cart,
      total,
    } = req.body;

    if (!customer_name || !customer_phone) {
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const validPaymentMethod =
      payment_method === "whish" || payment_method === "cash"
        ? payment_method
        : "whish";

    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders
      (customer_name, customer_phone, customer_email, total, payment_method, payment_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        customer_name,
        customer_phone,
        customer_email || null,
        Number(total || 0),
        validPaymentMethod,
        "pending",
      ]
    );

    const order = orderResult.rows[0];

    for (const item of cart) {
      await client.query(
        `INSERT INTO order_items
        (order_id, product_id, product_name, quantity, price)
        VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          String(item.id),
          item.name,
          Number(item.qty || 1),
          Number(item.price || 0),
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Order request saved successfully",
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("Order error:", error);

    res.status(500).json({
      message: "Error saving order request",
      error: error.message,
    });
  } finally {
    client.release();
  }
});

module.exports = router;