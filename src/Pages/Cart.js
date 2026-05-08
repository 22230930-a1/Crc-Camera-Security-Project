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
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");

    // Valid examples:
    // 71985165
    // 03985165
    // +96171985165
    // 96171985165
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

Note:
Please confirm availability and send Whish Money payment instructions.
`;

      const phoneNumber = "96171985165";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      setSuccess(
        "Order saved successfully! WhatsApp opened with Whish Money payment request."
      );

      setCustomer({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        payment_method: "whish",
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
          Review your products, enter your contact details, and send your order
          request through WhatsApp with Whish Money payment option.
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

        <div className="cartBottom cartBottomPro">
          <div>
            <span className="muted small">Cart total</span>
            <div className="total">Total: ${total.toFixed(2)}</div>
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