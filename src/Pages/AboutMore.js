import React from "react";
import { Link } from "react-router-dom";

function AboutMore() {
  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <p style={styles.label}>CRC Camera Security</p>

        <h1 style={styles.title}>Professional CCTV & Security Solutions</h1>

        <p style={styles.text}>
          CRC Camera Security provides professional camera systems for homes,
          shops, offices, warehouses, and businesses. We help customers choose
          the right cameras, NVR recorders, storage, and installation setup
          depending on their location and security needs.
        </p>

        <p style={styles.text}>
          Our services include indoor cameras, outdoor cameras, PoE camera
          systems, NVR setup, mobile phone viewing, night vision cameras,
          recording storage, and complete installation support.
        </p>

        <div style={styles.grid}>
          <div style={styles.box}>
            <h3>Home Security</h3>
            <p>Main entrance, parking, garden, balcony, and indoor coverage.</p>
          </div>

          <div style={styles.box}>
            <h3>Business Security</h3>
            <p>Shops, cashier areas, offices, storage rooms, and warehouses.</p>
          </div>

          <div style={styles.box}>
            <h3>Smart Monitoring</h3>
            <p>Mobile view, playback, NVR recording, and night vision support.</p>
          </div>
        </div>

        <Link to="/products" style={styles.button}>
          View Products
        </Link>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f7fb",
    padding: "60px 20px",
  },

  card: {
    maxWidth: "1050px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "45px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
  },

  label: {
    color: "#0b4ea2",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "42px",
    color: "#071b3a",
    margin: "10px 0 20px",
  },

  text: {
    fontSize: "17px",
    color: "#5f6b7a",
    lineHeight: "1.8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "18px",
    marginTop: "30px",
  },

  box: {
    background: "#f4f7fb",
    padding: "22px",
    borderRadius: "18px",
    border: "1px solid #e1e8f2",
  },

  button: {
    display: "inline-block",
    marginTop: "30px",
    background: "#071b3a",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: "800",
  },
};

export default AboutMore;