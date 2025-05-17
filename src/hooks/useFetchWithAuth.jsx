
import { useState, useEffect } from "react";

export function useFetchWithAuth(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Serializamos las opciones para evitar problemas de referencia en useEffect
  const optionsKey = JSON.stringify(options);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          throw new Error("No autorizado. Inicia sesión nuevamente.");
        }

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, optionsKey]); // 👈 se vuelve estable al usar options serializado

  return { data, error, loading };
}
