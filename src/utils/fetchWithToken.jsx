export async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
