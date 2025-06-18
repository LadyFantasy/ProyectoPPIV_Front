//utils/fetchWithToken.jsx
import config from "../config";

export async function fetchWithToken(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };

  try {
    console.log(`Making request to ${endpoint} with headers:`, headers);
    const res = await fetch(`${config.baseUrl}${endpoint}`, { ...options, headers });

    if (!res.ok) {
      let errorMessage = `Error ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        console.error("Error response data:", errorData);
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        console.error("Error parsing error response:", e);
      }
      throw new Error(errorMessage);
    }

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      console.log(`Response from ${endpoint}:`, data);
      return data;
    }
    return await res.text();
  } catch (error) {
    console.error(`Error in fetchWithToken for ${endpoint}:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Error en la petición al servidor");
  }
}
