import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import "../styles/CheckIn.css";

function CheckIn() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [unitTitle, setUnitTitle] = useState("");

  useEffect(() => {
    const performCheckIn = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.baseUrl}/checkin?id=${id}`);

        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }

        const data = await response.json();

        if (!data || typeof data !== "object") {
          throw new Error("Formato de respuesta inválido");
        }

        if (data.message === "Check-in realizado con éxito" && data.unit) {
          setUnitTitle(data.unit);
          setSuccess(true);
        } else {
          setError(data.message || "No se pudo realizar el check-in");
        }
      } catch (err) {
        setError(err.message || "Error al realizar el check-in");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      performCheckIn();
    } else {
      setError("ID de reserva no válido");
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="checkin-container">
      <div className="checkin-content">
        {loading ? (
          <div className="loading">Procesando check-in...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : success ? (
          <div className="success-message">
            <h1>¡Check-in realizado con éxito!</h1>
            <p>Bienvenido a {unitTitle}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CheckIn;
