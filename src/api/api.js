const API_URL = "https://crc-camera-security-project.onrender.com/api";

console.log("Frontend API URL:", API_URL);

/* ==============================
   PRODUCTS
============================== */

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("Products response is not JSON:", text);
    throw new Error("Server returned invalid products response");
  }

  if (!response.ok) {
    throw new Error(result.message || "Failed to load products");
  }

  return result;
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

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("Quote response is not JSON:", text);
    throw new Error("Server returned invalid response for quote request");
  }

  if (!response.ok) {
    throw new Error(result.message || "Failed to send quote request");
  }

  return result;
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

  const text = await response.text();

  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("Order response is not JSON:", text);
    throw new Error("Server returned invalid response for order request");
  }

  if (!response.ok) {
    throw new Error(result.message || "Failed to send order request");
  }

  return result;
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

  const text = await response.text();
  console.log("AI RAW RESPONSE:", text);

  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    console.error("AI response is not JSON:", text);
    throw new Error("AI server returned invalid response");
  }

  if (!response.ok) {
    throw new Error(result.message || "AI recommendation failed");
  }

  return result;
}