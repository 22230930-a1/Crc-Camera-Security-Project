
const API_URL =
  process.env.REACT_APP_API_URL || "https://crc-camera-security-backend.onrender.com/api";
export async function sendQuoteRequest(data) {
  const response = await fetch(`${API_URL}/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send quote request");
  }

  return result;
}

export async function sendOrderRequest(data) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to send order request");
  }

  return result;
}