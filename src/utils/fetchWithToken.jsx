const BASE = "https://proyectoppvi.onrender.com";

export async function fetchWithToken(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {})
  };

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}
