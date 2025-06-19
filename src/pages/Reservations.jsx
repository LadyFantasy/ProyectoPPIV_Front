import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import ReservationCard from "../components/ReservationCard";
import "../styles/Reservations.css";

function Reservations() {
  const [reservations, setReservations] = useState({ current: [], future: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const data = await fetchWithToken("/verReservas");
        console.log("Respuesta del backend:", data);
        console.log(
          "Ejemplo de reserva con check-in:",
          data.current.find(r => r.checked_in)
        );
        setReservations(data);
      } catch (err) {
        setError(err.message || "Error al cargar las reservas");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Nueva función para refrescar reservas tras cancelar
  const refreshReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchWithToken("/verReservas");
      setReservations(data);
    } catch (err) {
      setError(err.message || "Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  // Depuración: mostrar reservas en consola
  console.log("reservations.current", reservations.current);
  console.log("reservations.future", reservations.future);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="reservations-page">
          <p className="loading">Cargando reservas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="reservations-page">
          <p className="error-message">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="reservations-page">
        <h1 className="reservations-title">Reservas</h1>

        {reservations.current.length === 0 && reservations.future.length === 0 ? (
          <p className="no-reservations">No hay reservas activas</p>
        ) : (
          <>
            {reservations.current.length > 0 && (
              <div className="reservations-section">
                <h3 className="reservations-section__title">Ocupadas</h3>
                <div className="reservations-grid">
                  {reservations.current.map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancelSuccess={refreshReservations}
                    />
                  ))}
                </div>
              </div>
            )}

            {reservations.future.length > 0 && (
              <div className="reservations-section">
                <h3 className="reservations-section__title">Futuras</h3>
                <div className="reservations-grid">
                  {reservations.future.map(reservation => (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      onCancelSuccess={refreshReservations}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Reservations;
