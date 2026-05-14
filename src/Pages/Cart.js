import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { sendOrderRequest } from "../api/api";

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
  const [showWhishCheckout, setShowWhishCheckout] = useState(false);

  const itemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }, [cart]);

  const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;

  const isValidPhone = (phone) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^(\+?961|0)?[3-9][0-9]{6,7}$/.test(cleaned);
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "customer_phone") {
      setPhoneError("");
    }
  };

  const getPaymentLabel = (method) => {
    if (method === "whish") return "Whish Money";
    if (method === "cash") return "Cash on Delivery / Installation";
    return "Not specified";
  };

  const productsText = cart
    .map(
      (item, index) =>
        `${index + 1}. ${item.name}
Quantity: ${item.qty}
Unit Price: ${formatMoney(item.price)}
Subtotal: ${formatMoney(Number(item.price || 0) * Number(item.qty || 1))}`
    )
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
    if (!customer.customer_name.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!isValidPhone(customer.customer_phone)) {
      setPhoneError("Please enter a valid Lebanese phone number.");
      return false;
    }

    return true;
  };

  const openWhishCheckout = () => {
    if (!validateCustomer()) return;
    setShowWhishCheckout(true);
  };

  const handleOrderRequest = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateCustomer()) return;

    if (customer.payment_method === "whish") {
      setShowWhishCheckout(true);
      return;
    }

    setLoading(true);

    try {
      await sendOrderRequest({
        ...customer,
        cart,
        total,
      });

      window.open(whatsappUrl, "_blank");

      setSuccess("Order saved successfully! WhatsApp opened to confirm your order.");

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

  const confirmWhishOrder = async () => {
    if (!validateCustomer()) return;

    setLoading(true);

    try {
      await sendOrderRequest({
        ...customer,
        cart,
        total,
        payment_method: "whish",
      });

      window.open(whatsappUrl, "_blank");

      setSuccess(
        "Order saved successfully! Please send your Whish payment proof on WhatsApp."
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
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <section className="crcCartEmptyPage">
        <div className="crcEmptyCartCard">
          <div className="crcEmptyCartIcon">🛒</div>
          <span>Your cart is empty</span>
          <h1>Shopping Cart</h1>
          <p>
            You have not added any cameras, NVR recorders, or accessories yet.
          </p>
          <Link to="/products">Explore Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="crcCartPage">
      <div className="crcCartShell">
        <header className="crcCartHero">
          <div>
            <span className="crcCartBadge">Secure Checkout</span>
            <h1>Shopping Cart</h1>
            <p>
              Review your CCTV products, enter your details, choose payment
              method, and confirm your order through WhatsApp.
            </p>
          </div>

          <div className="crcCartHeroBox">
            <span>{itemsCount}</span>
            <strong>Items</strong>
            <small>{formatMoney(total)}</small>
          </div>
        </header>

        {success && <div className="crcCartSuccess">{success}</div>}

        <div className="crcCheckoutSteps">
          <div className="active">
            <span>1</span>
            <p>Products</p>
          </div>
          <div className="active">
            <span>2</span>
            <p>Details</p>
          </div>
          <div className="active">
            <span>3</span>
            <p>Payment</p>
          </div>
          <div>
            <span>4</span>
            <p>Proof</p>
          </div>
        </div>

        <div className="crcCartLayout">
          <main className="crcCartMain">
            <section className="crcCartPanel">
              <div className="crcPanelHeader">
                <div>
                  <span>Step 1</span>
                  <h2>Your Products</h2>
                  <p>Check quantity, price, and subtotal before checkout.</p>
                </div>

                <button type="button" onClick={clearCart} className="crcClearBtn">
                  Clear Cart
                </button>
              </div>

              <div className="crcProductList">
                {cart.map((item) => {
                  const lineTotal = Number(item.price || 0) * Number(item.qty || 1);

                  return (
                    <article className="crcProductCard" key={item.id}>
                      <div className="crcProductImage">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <span>CRC</span>
                        )}
                      </div>

                      <div className="crcProductBody">
                        <div className="crcProductTop">
                          <div>
                            <span className="crcProductTag">Security Product</span>
                            <h3>{item.name}</h3>
                          </div>

                          <button
                            type="button"
                            className="crcRemoveBtn"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="crcProductMeta">
                          <div>
                            <span>Unit Price</span>
                            <strong>{formatMoney(item.price)}</strong>
                          </div>

                          <div>
                            <span>Subtotal</span>
                            <strong>{formatMoney(lineTotal)}</strong>
                          </div>

                          <div className="crcQtyBox">
                            <button
                              type="button"
                              onClick={() => decrementQty(item.id)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>

                            <div>
                              <span>Qty</span>
                              <strong>{item.qty}</strong>
                            </div>

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

            <form className="crcCartPanel" onSubmit={handleOrderRequest}>
              <div className="crcPanelHeader">
                <div>
                  <span>Step 2</span>
                  <h2>Customer Details</h2>
                  <p>We use this information to confirm your order.</p>
                </div>
              </div>

              <div className="crcFormGrid">
                <div className="crcFormGroup">
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

                <div className="crcFormGroup">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={customer.customer_phone}
                    onChange={handleCustomerChange}
                    placeholder="+961 71 985 165"
                    required
                  />
                  {phoneError && <p className="crcFormWarning">{phoneError}</p>}
                </div>

                <div className="crcFormGroup">
                  <label>Email Optional</label>
                  <input
                    type="email"
                    name="customer_email"
                    value={customer.customer_email}
                    onChange={handleCustomerChange}
                    placeholder="example@email.com"
                  />
                </div>

                <div className="crcFormGroup">
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

              <div className="crcPaymentChoices">
                <button
                  type="button"
                  className={
                    customer.payment_method === "whish"
                      ? "crcPaymentCard selected whish"
                      : "crcPaymentCard"
                  }
                  onClick={() =>
                    setCustomer((prev) => ({ ...prev, payment_method: "whish" }))
                  }
                >
                  <span className="crcPayIcon whish">W</span>
                  <div>
                    <strong>Whish Money</strong>
                    <small>Open Whish page, pay, then send proof.</small>
                  </div>
                </button>

                <button
                  type="button"
                  className={
                    customer.payment_method === "cash"
                      ? "crcPaymentCard selected cash"
                      : "crcPaymentCard"
                  }
                  onClick={() =>
                    setCustomer((prev) => ({ ...prev, payment_method: "cash" }))
                  }
                >
                  <span className="crcPayIcon cash">$</span>
                  <div>
                    <strong>Cash / Installation</strong>
                    <small>Confirm now and pay on delivery or installation.</small>
                  </div>
                </button>
              </div>

              {customer.payment_method === "whish" && (
                <div className="crcWhishPreview">
                  <div className="crcWhishHeader">
                    <div className="crcWhishLogo">W</div>
                    <div>
                      <span>Step 3: Whish Money</span>
                      <h3>Continue to Whish payment page</h3>
                      <p>
                        A payment page will appear with receiver name, Whish
                        number, total amount, and WhatsApp proof steps.
                      </p>
                    </div>
                  </div>

                  <div className="crcWhishInfo">
                    <div>
                      <span>Receiver</span>
                      <strong>{WHISH_RECEIVER}</strong>
                    </div>
                    <div>
                      <span>Whish Number</span>
                      <strong>{WHISH_NUMBER}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{formatMoney(total)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="crcOpenWhishBtn"
                    onClick={openWhishCheckout}
                  >
                    Continue to Whish Payment
                  </button>
                </div>
              )}

              {customer.payment_method === "cash" && (
                <div className="crcCashBox">
                  <strong>Cash on Delivery / Installation</strong>
                  <p>
                    You can pay when the products are delivered or during camera
                    installation confirmation.
                  </p>
                </div>
              )}

              <div className="crcCartActionBar">
                <div>
                  <span>Cart Total</span>
                  <strong>{formatMoney(total)}</strong>
                </div>

                <div className="crcCartActions">
                  <Link to="/products">Continue Shopping</Link>

                  <button type="submit" disabled={loading}>
                    {loading
                      ? "Sending..."
                      : customer.payment_method === "whish"
                      ? "Continue to Payment"
                      : "Send Order Request"}
                  </button>
                </div>
              </div>
            </form>
          </main>

          <aside className="crcCartSidebar">
            <div className="crcSummaryCard">
              <h2>Order Summary</h2>

              <div className="crcSummaryLine">
                <span>Products</span>
                <strong>{itemsCount}</strong>
              </div>

              <div className="crcSummaryLine">
                <span>Subtotal</span>
                <strong>{formatMoney(total)}</strong>
              </div>

              <div className="crcSummaryLine">
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
                  className="crcSummaryWhish"
                  onClick={openWhishCheckout}
                >
                  Continue to Whish
                </button>
              ) : (
                <button
                  type="button"
                  className="crcSummaryDark"
                  onClick={handleOrderRequest}
                >
                  Confirm Cash Order
                </button>
              )}

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp Proof
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
              className="crcWhishClose"
              onClick={() => setShowWhishCheckout(false)}
            >
              ×
            </button>

            <div className="crcWhishModalHero">
              <div className="crcWhishModalLogo">W</div>
              <span>Whish Money Checkout</span>
              <h2>Pay Your Order</h2>
              <p>
                Review the details, open Whish Money, pay the amount, then send
                the proof on WhatsApp.
              </p>
            </div>

            <div className="crcWhishReceipt">
              <div>
                <span>Customer Name</span>
                <strong>{customer.customer_name || "Customer"}</strong>
              </div>

              <div>
                <span>Customer Phone</span>
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

              <div className="crcReceiptTotal">
                <span>Total Amount</span>
                <strong>{formatMoney(total)}</strong>
              </div>
            </div>

            <div className="crcWhishSteps">
              <div>
                <span>1</span>
                <p>Click “Open Whish Money”.</p>
              </div>

              <div>
                <span>2</span>
                <p>Transfer {formatMoney(total)} to {WHISH_NUMBER}.</p>
              </div>

              <div>
                <span>3</span>
                <p>Take a screenshot or copy the transaction number.</p>
              </div>

              <div>
                <span>4</span>
                <p>Send proof on WhatsApp to confirm your order.</p>
              </div>
            </div>

            <div className="crcFormGroup crcModalProof">
              <label>Payment Reference / Note Optional</label>
              <input
                type="text"
                name="payment_proof"
                value={customer.payment_proof}
                onChange={handleCustomerChange}
                placeholder="Example: Transaction number or screenshot sent"
              />
            </div>

            <div className="crcWhishModalBtns">
              <a href={WHISH_LINK} target="_blank" rel="noopener noreferrer">
                Open Whish Money
              </a>

              <button type="button" onClick={confirmWhishOrder} disabled={loading}>
                {loading ? "Saving..." : "Save Order & Open WhatsApp"}
              </button>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="crcProofWhatsapp"
            >
              Send Payment Proof on WhatsApp
            </a>
          </div>
        </div>
      )}
    </section>
  );
}