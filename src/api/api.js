export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function readJsonResponse(response, fallbackMessage) {
  const text = await response.text();

  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch (error) {
    console.error("Server response is not JSON:", text);
    throw new Error("Server returned an invalid response. Please check the backend API URL.");
  }

  if (!response.ok) {
    throw new Error(result.message || result.error || fallbackMessage);
  }

  return result;
}

/* ==============================
   PRODUCTS
============================== */

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return readJsonResponse(response, "Failed to load products");
}

/* ==============================
   QUOTE REQUEST
============================== */

export async function sendQuoteRequest(data) {
  const response = await fetch(`${API_URL}/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return readJsonResponse(response, "Failed to send quote request");
}

/* ==============================
   ORDER REQUEST
============================== */

export async function sendOrderRequest(data) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return readJsonResponse(response, "Failed to send order request");
}

/* ==============================
   AI RECOMMENDATION
============================== */

export async function sendAIRecommendation(data) {
  const response = await fetch(`${API_URL}/ai/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return readJsonResponse(response, "AI recommendation failed");
}