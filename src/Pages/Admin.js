import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api/api";

export default function Admin() {
  const navigate = useNavigate();

  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("quotes");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");
  const adminToken = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  async function fetchAdminData() {
    try {
      setLoading(true);
      setErrorMessage("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [quotesRes, ordersRes] = await Promise.all([
        fetch(`${API_URL}/quotes`, { headers }),
        fetch(`${API_URL}/orders`, { headers }),
      ]);

      let quotesData = [];
      let ordersData = [];

      try {
        quotesData = await quotesRes.json();
      } catch {
        quotesData = [];
      }

      try {
        ordersData = await ordersRes.json();
      } catch {
        ordersData = [];
      }

      if (quotesRes.status === 401 || quotesRes.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
        return;
      }

      if (ordersRes.status === 401 || ordersRes.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
        return;
      }

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
        error.message ||
          "Failed to load admin data. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin-login");
      return;
    }

    fetchAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="adminPage">
      <div className="adminHeader">
        <div>
          <span className="sectionLabel">CRC Dashboard</span>
          <h1>Admin Panel</h1>
          <p>View installation requests and customer cart orders.</p>
        </div>

        <div className="adminHeaderActions">
          {adminUser && (
            <div className="adminUserBox">
              <span>Logged in as</span>
              <strong>{adminUser.name || adminUser.email || "Admin"}</strong>
            </div>
          )}

          <button className="adminLogout" onClick={handleLogout}>
            Logout
          </button>
        </div>
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
            Check your backend URL in Netlify:{" "}
            <strong>REACT_APP_API_URL</strong>.
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
                  <h3>{quote.full_name || quote.name || "Unknown Customer"}</h3>
                  <span>{quote.status || "new"}</span>
                </div>

                <p>
                  <strong>Phone:</strong>{" "}
                  {quote.phone || quote.customer_phone || "Not specified"}
                </p>

                <p>
                  <strong>Location:</strong>{" "}
                  {quote.location || quote.address || "Not specified"}
                </p>

                <p>
                  <strong>Property:</strong>{" "}
                  {quote.property_type || quote.property || "Not specified"}
                </p>

                <p>
                  <strong>Cameras:</strong>{" "}
                  {quote.camera_count || quote.cameras || "Not specified"}
                </p>

                <p>
                  <strong>Message:</strong>{" "}
                  {quote.message || quote.notes || "No message"}
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
                  {order.customer_phone || order.phone || "Not specified"}
                </p>

                <p>
                  <strong>Email:</strong>{" "}
                  {order.customer_email || order.email || "Not specified"}
                </p>

                <p>
                  <strong>Total:</strong> $
                {Number(order.total_amount || order.total || order.total_price || order.amount || 0).toFixed(2)}
                </p>

                <p>
                  <strong>Payment:</strong>{" "}
                  {order.payment_method || "WhatsApp"}
                </p>

                {order.items && (
                  <p>
                    <strong>Items:</strong>{" "}
                    {typeof order.items === "string"
                      ? order.items
                      : JSON.stringify(order.items)}
                  </p>
                )}

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