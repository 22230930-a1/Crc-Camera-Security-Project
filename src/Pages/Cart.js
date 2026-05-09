import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { sendOrderRequest } from "../api/api";

export default function Cart() {
  const {
    cart,
    total,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const [customer, setCustomer] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    payment_method: "whish",
    payment_proof: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^(\+?961|0)?[3-9][0-9]{6,7}$/.test(cleaned);
  };

  const handleCustomerChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "customer_phone") {
      setPhoneError("");
    }
  };

  const getPaymentLabel = (method) => {
    if (method === "whish") return "Whish Money";
    if (method === "cash") return "Cash on Delivery / Installation";
    return "Not specified";
  };

  const handleOrderRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    if (!isValidPhone(customer.customer_phone)) {
      setPhoneError("Please enter a valid Lebanese phone number.");
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        ...customer,
        cart,
        total,
      };

      await sendOrderRequest(orderData);

      const productsText = cart
        .map(
          (item) =>
            `- ${item.name}
  Quantity: ${item.qty}
  Unit Price: $${Number(item.price || 0).toFixed(2)}
  Subtotal: $${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}`
        )
        .join("\n\n");

      const whatsappMessage = `
New Product Order Request - CRC Camera Security

Customer Details:
Name: ${customer.customer_name}
Phone: ${customer.customer_phone}
Email: ${customer.customer_email || "Not specified"}

Products:
${productsText}

Total: $${Number(total || 0).toFixed(2)}

Payment Method: ${getPaymentLabel(customer.payment_method)}
Payment Status: Pending
Payment Reference / Note: ${
        customer.payment_proof ||
        "No proof written. Customer may send screenshot manually."
      }

Whish Money Payment Details:
Receiver: CRC Camera Security
Whish Number: +961 71 985 165
Amount: $${Number(total || 0).toFixed(2)}

Note:
Please confirm product availability and payment confirmation.
`;

      const phoneNumber = "96171985165";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      setSuccess(
        "Order saved successfully! WhatsApp opened to confirm your payment/order."
      );

      setCustomer({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        payment_method: "whish",
        payment_proof: "",
      });

      clearCart();
    } catch (error) {
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <section className="cartEmptyPage">
        <div className="emptyCartCard">
          <div className="emptyCartIcon">🛒</div>

          <span className="emptyCartBadge">Your cart is empty</span>

          <h1>Shopping Cart</h1>

          <p>
            You have not added any security cameras, NVR recorders, or
            accessories yet.
          </p>

          <Link to="/products" className="emptyCartBtn">
            Explore Products →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="container section">
      <div className="cartHeaderPro">
        <span className="sectionLabel">Order Request</span>

        <h2 className="h2">Shopping Cart</h2>

        <p className="muted">
          Review your products, choose Whish Money or cash, and confirm your
          order through WhatsApp.
        </p>
      </div>

      {success && <div className="cartSuccessBox">{success}</div>}

      <div className="cartList">
        {cart.map((item) => (
          <div className="cartRow" key={item.id}>
            <div className="cartLeft">
              <div className="cartName">{item.name}</div>

              <div className="muted">
                ${Number(item.price || 0).toFixed(2)}
              </div>
            </div>

            <div className="cartRight">
              <div className="qtyControl">
                <button
                  className="qtyBtn"
                  onClick={() => decrementQty(item.id)}
                  aria-label="Decrease quantity"
                  type="button"
                >
                  −
                </button>

                <span className="qtyNumber">{item.qty}</span>

                <button
                  className="qtyBtn"
                  onClick={() => incrementQty(item.id)}
                  aria-label="Increase quantity"
                  type="button"
                >
                  +
                </button>
              </div>

              <button
                className="btnSmall btnSmallDanger"
                onClick={() => removeFromCart(item.id)}
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <form className="cartOrderForm" onSubmit={handleOrderRequest}>
        <h3>Customer Details</h3>

        <div className="cartFormGrid">
          <div className="formGroup">
            <label>Full Name</label>
            <input
              type="text"
              name="customer_name"
              value={customer.customer_name}
              onChange={handleCustomerChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="formGroup">
            <label>Phone Number</label>
            <input
              type="tel"
              name="customer_phone"
              value={customer.customer_phone}
              onChange={handleCustomerChange}
              placeholder="+961 71 985 165"
              required
            />

            {phoneError && <p className="formWarning">{phoneError}</p>}
          </div>

          <div className="formGroup">
            <label>Email optional</label>
            <input
              type="email"
              name="customer_email"
              value={customer.customer_email}
              onChange={handleCustomerChange}
              placeholder="example@email.com"
            />
          </div>

          <div className="formGroup">
            <label>Payment Method</label>
            <select
              name="payment_method"
              value={customer.payment_method}
              onChange={handleCustomerChange}
            >
              <option value="whish">Whish Money</option>
              <option value="cash">Cash on Delivery / Installation</option>
            </select>
          </div>
        </div>

        {customer.payment_method === "whish" && (
          <div className="whishPaymentCard">
            <div className="whishTop">
              <div className="whishLogo">W</div>

              <div>
                <h3>Pay by Whish Money</h3>
                <p>
                  Transfer the total amount to our Whish number, then send the
                  payment proof through WhatsApp.
                </p>
              </div>
            </div>

            <div className="whishGrid">
              <div className="whishBox">
                <span>Receiver Name</span>
                <strong>CRC Camera Security</strong>
              </div>

              <div className="whishBox">
                <span>Whish Number</span>
                <strong>+961 71 985 165</strong>
              </div>

              <div className="whishBox">
                <span>Amount to Pay</span>
                <strong>${Number(total || 0).toFixed(2)}</strong>
              </div>
            </div>

            <div className="whishNotice">
              Step 1: Pay using Whish Money. <br />
              Step 2: Copy the transaction number or take a screenshot. <br />
              Step 3: Click WhatsApp and send the proof.
            </div>

            <div className="formGroup whishProofField">
              <label>Payment Reference / Note optional</label>
              <input
                type="text"
                name="payment_proof"
                value={customer.payment_proof}
                onChange={handleCustomerChange}
                placeholder="Example: Transaction number or write: screenshot sent"
              />
            </div>

            <a
              className="whishPayBtn"
              href="https://www.whish.money/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pay with Whish Money
            </a>

            <a
              className="whishWhatsappBtn"
              href={`https://wa.me/96171985165?text=${encodeURIComponent(
                `Hello CRC Camera Security,

I want to confirm my order payment by Whish Money.

Customer Name: ${customer.customer_name || "Not written yet"}
Phone: ${customer.customer_phone || "Not written yet"}
Order Total: $${Number(total || 0).toFixed(2)}

Whish Payment Details:
Receiver: CRC Camera Security
Whish Number: +961 71 985 165
Amount: $${Number(total || 0).toFixed(2)}

Payment Reference / Note:
${customer.payment_proof || "I will attach the payment screenshot here."}

Please confirm my order.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send Payment Proof on WhatsApp
            </a>
          </div>
        )}

        {customer.payment_method === "cash" && (
          <div className="cashPaymentCard">
            <strong>Cash on Delivery / Installation</strong>
            <p>
              You can pay when the products are delivered or during the camera
              installation.
            </p>
          </div>
        )}

        <div className="cartBottom cartBottomPro">
          <div>
            <span className="muted small">Cart total</span>
            <div className="total">Total: ${Number(total || 0).toFixed(2)}</div>
          </div>

          <div className="cartButtons">
            <button
              type="button"
              className="btnSmall btnSmallOutline"
              onClick={clearCart}
            >
              Clear Cart
            </button>

            <Link className="btnSmall btnSmallOutline" to="/products">
              Continue Shopping
            </Link>

            <button
              className="btnSmall btnSmallDark"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Order Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}