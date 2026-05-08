import React, { useEffect, useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export default function Admin() {
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("quotes");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchAdminData() {
    try {
      setLoading(true);
      setErrorMessage("");

      console.log("Admin API URL:", API_URL);

      const quotesRes = await fetch(`${API_URL}/quotes`);
      const ordersRes = await fetch(`${API_URL}/orders`);

      console.log("Quotes status:", quotesRes.status);
      console.log("Orders status:", ordersRes.status);

      const quotesData = await quotesRes.json();
      const ordersData = await ordersRes.json();

      console.log("Quotes data:", quotesData);
      console.log("Orders data:", ordersData);

      if (!quotesRes.ok) {
        throw new Error(
          quotesData.message || quotesData.error || "Failed to load quotes"
        );
      }

      if (!ordersRes.ok) {
        throw new Error(
          ordersData.message || ordersData.error || "Failed to load orders"
        );
      }

      setQuotes(Array.isArray(quotesData) ? quotesData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error("Admin fetch error:", error);
      setErrorMessage(
        error.message || "Failed to load admin data. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <section className="adminPage">
      <div className="adminHeader">
        <span className="sectionLabel">CRC Dashboard</span>
        <h1>Admin Panel</h1>
        <p>View installation requests and customer cart orders.</p>
      </div>

      <div className="adminTabs">
        <button
          className={activeTab === "quotes" ? "adminTab active" : "adminTab"}
          onClick={() => setActiveTab("quotes")}
        >
          Installation Requests ({quotes.length})
        </button>

        <button
          className={activeTab === "orders" ? "adminTab active" : "adminTab"}
          onClick={() => setActiveTab("orders")}
        >
          Orders ({orders.length})
        </button>

        <button className="adminRefresh" onClick={fetchAdminData}>
          Refresh
        </button>
      </div>

      {loading && <div className="adminEmpty">Loading admin data...</div>}

      {!loading && errorMessage && (
        <div className="adminEmpty">
          <h3>Admin data failed to load</h3>
          <p>{errorMessage}</p>
          <p>
            Make sure backend is running on <strong>http://localhost:5000</strong>.
          </p>
          <button className="adminRefresh" onClick={fetchAdminData}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !errorMessage && activeTab === "quotes" && (
        <div className="adminGrid">
          {quotes.length === 0 ? (
            <div className="adminEmpty">No installation requests yet.</div>
          ) : (
            quotes.map((quote) => (
              <div className="adminCard" key={quote.id}>
                <div className="adminCardTop">
                  <h3>{quote.full_name || "Unknown Customer"}</h3>
                  <span>{quote.status || "new"}</span>
                </div>

                <p>
                  <strong>Phone:</strong> {quote.phone || "Not specified"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {quote.location || "Not specified"}
                </p>

                <p>
                  <strong>Property:</strong>{" "}
                  {quote.property_type || "Not specified"}
                </p>

                <p>
                  <strong>Cameras:</strong>{" "}
                  {quote.camera_count || "Not specified"}
                </p>

                <p>
                  <strong>Message:</strong>{" "}
                  {quote.message || "No message"}
                </p>

                <div className="adminDate">
                  {quote.created_at
                    ? new Date(quote.created_at).toLocaleString()
                    : ""}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!loading && !errorMessage && activeTab === "orders" && (
        <div className="adminGrid">
          {orders.length === 0 ? (
            <div className="adminEmpty">No orders yet.</div>
          ) : (
            orders.map((order) => (
              <div className="adminCard" key={order.id}>
                <div className="adminCardTop">
                  <h3>{order.customer_name || "Unknown Customer"}</h3>
                  <span>{order.payment_status || "pending"}</span>
                </div>

                <p>
                  <strong>Phone:</strong>{" "}
                  {order.customer_phone || "Not specified"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.customer_email || "Not specified"}
                </p>

                <p>
                  <strong>Total:</strong> $
                  {Number(order.total || 0).toFixed(2)}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.payment_method || "whatsapp"}
                </p>

                <div className="adminDate">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleString()
                    : ""}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}