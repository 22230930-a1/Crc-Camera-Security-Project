import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { sendOrderRequest } from "../api/api";
import whishLogo from "../assets/whish-logo.png";

const WHISH_LINK = "https://www.whish.money/";
const WHATSAPP_NUMBER = "96171985165";
const WHISH_RECEIVER = "CRC Camera Security";
const WHISH_NUMBER = "+961 71 985 165";

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
  const [formError, setFormError] = useState("");
  const [showWhishCheckout, setShowWhishCheckout] = useState(false);

  const itemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }, [cart]);

  const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/[\s-]/g, "");

    if (!cleaned) return false;

    const lebanonRegex =
      /^(?:03\d{6}|7[01689]\d{6}|81\d{6}|\+9613\d{6}|\+9617[01689]\d{6}|\+96181\d{6})$/;

    const syriaRegex = /^(?:09\d{8}|\+9639\d{8})$/;

    const internationalRegex = /^\+[1-9]\d{7,14}$/;

    return (
      lebanonRegex.test(cleaned) ||
      syriaRegex.test(cleaned) ||
      internationalRegex.test(cleaned)
    );
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormError("");
    setSuccess("");

    if (name === "customer_phone") {
      setPhoneError("");
    }
  };

  const selectPaymentMethod = (method) => {
    setCustomer((prev) => ({
      ...prev,
      payment_method: method,
    }));

    setFormError("");
  };

  const getPaymentLabel = (method) => {
    if (method === "whish") return "Whish Money";
    if (method === "cash") return "Cash on Delivery / Installation";
    return "Not specified";
  };

  const productsText = cart
    .map((item, index) => {
      const lineTotal = Number(item.price || 0) * Number(item.qty || 1);

      return `${index + 1}. ${item.name}
Quantity: ${item.qty}
Unit Price: ${formatMoney(item.price)}
Subtotal: ${formatMoney(lineTotal)}`;
    })
    .join("\n\n");

  const whatsappMessage = `
New Product Order Request - CRC Camera Security

Customer Details:
Name: ${customer.customer_name || "Not written yet"}
Phone: ${customer.customer_phone || "Not written yet"}
Email: ${customer.customer_email || "Not specified"}

Products:
${productsText}

Total Items: ${itemsCount}
Total: ${formatMoney(total)}

Payment Method: ${getPaymentLabel(customer.payment_method)}
Payment Status: Pending

Payment Reference / Note:
${customer.payment_proof || "Customer will send screenshot manually."}

Whish Money Details:
Receiver: ${WHISH_RECEIVER}
Whish Number: ${WHISH_NUMBER}
Amount: ${formatMoney(total)}

Please confirm product availability and payment confirmation.
`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const validateCustomer = () => {
    setFormError("");
    setPhoneError("");

    if (!customer.customer_name.trim()) {
      setFormError("Please enter your full name.");
      return false;
    }

    if (!isValidPhone(customer.customer_phone)) {
      setPhoneError(
        "Invalid phone number. Use a valid number like +961 71 985 165, 03 123 456, or +963 99 123 4567."
      );
      return false;
    }

    return true;
  };

  const openWhishCheckout = () => {
    if (!validateCustomer()) return;
    setShowWhishCheckout(true);
  };

  const saveOrder = async (paymentMethod) => {
    setLoading(true);

    try {
      await sendOrderRequest({
        ...customer,
        cart,
        total,
        payment_method: paymentMethod,
      });

      window.open(whatsappUrl, "_blank");

      setSuccess(
        paymentMethod === "whish"
          ? "Order saved successfully. Please send your Whish payment proof on WhatsApp."
          : "Order saved successfully. WhatsApp opened to confirm your order."
      );

      setShowWhishCheckout(false);

      setCustomer({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        payment_method: "whish",
        payment_proof: "",
      });

      clearCart();
    } catch (error) {
      setFormError(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderRequest = async (e) => {
    e.preventDefault();

    if (!validateCustomer()) return;

    if (customer.payment_method === "whish") {
      setShowWhishCheckout(true);
      return;
    }

    await saveOrder("cash");
  };

  const confirmWhishOrder = async () => {
    if (!validateCustomer()) return;
    await saveOrder("whish");
  };

  if (cart.length === 0) {
    return (
      <section className="crcCartEmptyPage">
        <div className="crcEmptyCartCard">
          <div className="crcEmptyCartIcon">🛒</div>
          <span>Shopping Cart</span>
          <h1>Your cart is empty</h1>
          <p>
            Add cameras, NVR recorders, or accessories to continue your order.
          </p>
          <Link to="/products">Explore Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="crcCartPage">
      <div className="crcCartContainer">
        <header className="crcCartHeader">
          <div>
            <span className="crcCartBadge">Secure Checkout</span>
            <h1>Complete Your Order</h1>
            <p>
              Review your products, add your details, choose payment method, and
              confirm through WhatsApp.
            </p>
          </div>

          <div className="crcCartHeaderSummary">
            <span>{itemsCount}</span>
            <p>Items</p>
            <strong>{formatMoney(total)}</strong>
          </div>
        </header>

        {success && <div className="crcCartAlert success">{success}</div>}
        {formError && <div className="crcCartAlert error">{formError}</div>}

        <div className="crcCartGrid">
          <main className="crcCartLeft">
            <section className="crcCartCard">
              <div className="crcCartSectionTitle">
                <div>
                  <span>Step 1</span>
                  <h2>Order Products</h2>
                </div>

                <button
                  type="button"
                  className="crcTextDanger"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              <div className="crcCartProducts">
                {cart.map((item) => {
                  const lineTotal =
                    Number(item.price || 0) * Number(item.qty || 1);

                  return (
                    <article className="crcCartProduct" key={item.id}>
                      <div className="crcCartProductImage">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>CRC</span>
                        )}
                      </div>

                      <div className="crcCartProductInfo">
                        <div className="crcCartProductTop">
                          <div>
                            <span>Security Product</span>
                            <h3>{item.name}</h3>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="crcCartProductBottom">
                          <div>
                            <small>Unit Price</small>
                            <strong>{formatMoney(item.price)}</strong>
                          </div>

                          <div>
                            <small>Subtotal</small>
                            <strong>{formatMoney(lineTotal)}</strong>
                          </div>

                          <div className="crcCartQty">
                            <button
                              type="button"
                              onClick={() => decrementQty(item.id)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <span>{item.qty}</span>

                            <button
                              type="button"
                              onClick={() => incrementQty(item.id)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <form className="crcCartCard" onSubmit={handleOrderRequest}>
              <div className="crcCartSectionTitle">
                <div>
                  <span>Step 2</span>
                  <h2>Customer Details</h2>
                </div>
              </div>

              <div className="crcCheckoutForm">
                <div className="crcInputGroup">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="customer_name"
                    value={customer.customer_name}
                    onChange={handleCustomerChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="crcInputGroup">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={customer.customer_phone}
                    onChange={handleCustomerChange}
                    placeholder="+961 71 985 165"
                    required
                  />
                  {phoneError && (
                    <p className="crcInputWarning">{phoneError}</p>
                  )}
                </div>

                <div className="crcInputGroup">
                  <label>Email Optional</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={customer.customer_email}
                    onChange={handleCustomerChange}
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="crcCartSectionTitle payment">
                <div>
                  <span>Step 3</span>
                  <h2>Payment Method</h2>
                </div>
              </div>

              <div className="crcPaymentGrid">
                <button
                  type="button"
                  className={
                    customer.payment_method === "whish"
                      ? "crcPaymentOption active"
                      : "crcPaymentOption"
                  }
                  onClick={() => selectPaymentMethod("whish")}
                >
                  <div className="crcPaymentIcon">
                    <img src={whishLogo} alt="Whish Money" />
                  </div>

                  <div>
                    <strong>Whish Money</strong>
                    <p>Pay using Whish, then send proof on WhatsApp.</p>
                  </div>
                </button>

                <button
                  type="button"
                  className={
                    customer.payment_method === "cash"
                      ? "crcPaymentOption active"
                      : "crcPaymentOption"
                  }
                  onClick={() => selectPaymentMethod("cash")}
                >
                  <div className="crcPaymentIcon cash">$</div>

                  <div>
                    <strong>Cash</strong>
                    <p>Pay on delivery or during installation.</p>
                  </div>
                </button>
              </div>

              {customer.payment_method === "whish" && (
                <div className="crcWhishBox">
                  <div>
                    <img src={whishLogo} alt="Whish Money" />
                  </div>

                  <div>
                    <span>Whish Money Payment</span>
                    <h3>{WHISH_RECEIVER}</h3>
                    <p>
                      Send <strong>{formatMoney(total)}</strong> to{" "}
                      <strong>{WHISH_NUMBER}</strong>, then send your proof on
                      WhatsApp.
                    </p>
                  </div>
                </div>
              )}

              {customer.payment_method === "cash" && (
                <div className="crcCashNotice">
                  <strong>Cash order selected</strong>
                  <p>
                    We will confirm your order through WhatsApp before delivery
                    or installation.
                  </p>
                </div>
              )}

              <div className="crcCartSubmitBar">
                <Link to="/products">Continue Shopping</Link>

                <button type="submit" disabled={loading}>
                  {loading
                    ? "Processing..."
                    : customer.payment_method === "whish"
                    ? "Continue to Whish Payment"
                    : "Send Cash Order"}
                </button>
              </div>
            </form>
          </main>

          <aside className="crcCartRight">
            <div className="crcOrderSummary">
              <h2>Order Summary</h2>

              <div className="crcSummaryRow">
                <span>Products</span>
                <strong>{itemsCount}</strong>
              </div>

              <div className="crcSummaryRow">
                <span>Subtotal</span>
                <strong>{formatMoney(total)}</strong>
              </div>

              <div className="crcSummaryRow">
                <span>Installation</span>
                <strong>Quote</strong>
              </div>

              <div className="crcSummaryTotal">
                <span>Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>

              {customer.payment_method === "whish" ? (
                <button
                  type="button"
                  className="crcSummaryMainBtn"
                  onClick={openWhishCheckout}
                  disabled={loading}
                >
                  Continue to Whish
                </button>
              ) : (
                <button
                  type="button"
                  className="crcSummaryMainBtn dark"
                  onClick={handleOrderRequest}
                  disabled={loading}
                >
                  Confirm Cash Order
                </button>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="crcWhatsAppLink"
              >
                Open WhatsApp Confirmation
              </a>

              <p>
                Final installation cost may change depending on cable length,
                location, and setup details.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {showWhishCheckout && (
        <div className="crcWhishOverlay">
          <div className="crcWhishModal">
            <button
              type="button"
              className="crcModalClose"
              onClick={() => setShowWhishCheckout(false)}
            >
              ×
            </button>

            <div className="crcModalHeader">
              <img src={whishLogo} alt="Whish Money" />
              <span>Whish Money Checkout</span>
              <h2>Confirm Your Payment</h2>
              <p>
                Open Whish Money, transfer the amount, then save your order and
                send proof through WhatsApp.
              </p>
            </div>

            <div className="crcReceiptBox">
              <div>
                <span>Customer</span>
                <strong>{customer.customer_name || "Customer"}</strong>
              </div>

              <div>
                <span>Phone</span>
                <strong>{customer.customer_phone || "Not entered"}</strong>
              </div>

              <div>
                <span>Pay To</span>
                <strong>{WHISH_RECEIVER}</strong>
              </div>

              <div>
                <span>Whish Number</span>
                <strong>{WHISH_NUMBER}</strong>
              </div>

              <div className="total">
                <span>Total Amount</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </div>

            <div className="crcInputGroup">
              <label>Payment Reference Optional</label>
              <input
                type="text"
                name="payment_proof"
                value={customer.payment_proof}
                onChange={handleCustomerChange}
                placeholder="Transaction number or note"
              />
            </div>

            <div className="crcModalActions">
              <a href={WHISH_LINK} target="_blank" rel="noopener noreferrer">
                Open Whish Money
              </a>

              <button
                type="button"
                onClick={confirmWhishOrder}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Order & Open WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}