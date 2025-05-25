//utils/fetchWithToken.jsx

const BASE = "https://proyectoppvi.onrender.com";

export async function fetchWithToken(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) throw new Error(`Error ${res.status}`);

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    return res.text(); 
  }
}
