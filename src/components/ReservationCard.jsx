import "../styles/Reservations.css";

function ReservationCard({ reservation }) {
  // TODO: Implementar funcionalidad de cancelación cuando esté disponible en el backend
  const handleCancel = () => {
    console.log("Cancelar reserva:", reservation.id);
  };

  return (
    <div className="reservation-card">
      <div className="reservation-card__image">
        <img src={reservation.Foto} alt={reservation.Unidad} />
      </div>
      <div className="reservation-card__content">
        <div className="reservation-card__header">
          <h3 className="reservation-card__title">{reservation.Unidad}</h3>
        </div>
        <div className="reservation-card__dates">
          <p className="reservation-card__label">Período de estadía</p>
          <p>
            Del {reservation.Ingreso} al {reservation.Salida}
          </p>
        </div>
        <div className="reservation-card__guest">
          <p className="reservation-card__label">Datos del huésped</p>
          <p>{reservation.name}</p>
          <p>{reservation.email}</p>
        </div>
        <div className="reservation-card__payment">
          <p className="reservation-card__label">Información de pago</p>
          <p>Total: ${reservation.Total}</p>
          <p>Pagado: ${reservation.Pagado}</p>
        </div>
        <div className="reservation-card__footer">
          <button className="reservation-card__cancel-btn" onClick={handleCancel}>
            Cancelar reserva
          </button>
          <span className="reservation-card__id">ID: {reservation.unit_id}</span>
        </div>
        {reservation.checked_in === 1 && (
          <div className="reservation-card__status">
            <span className="status-badge">Check-in realizado</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;
