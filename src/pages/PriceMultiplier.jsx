import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import Button1 from "../components/Button1";
import SuccessModal from "../components/SuccessModal";
import MultiplierRow from "../components/MultiplierRow";
import SeasonCalendar from "../components/SeasonCalendar";
import { format } from "date-fns";
import "../styles/PriceMultiplier.css";

function PriceMultiplier() {
  const [seasonRates, setSeasonRates] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeasonRates();
  }, []);

  const fetchSeasonRates = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await fetchWithToken("/motor");

      if (!data || !Array.isArray(data)) {
        setSeasonRates([]);
        return;
      }

      const mappedRates = data.map(rate => ({
        since: rate.since ? new Date(rate.since) : null,
        until: rate.until ? new Date(rate.until) : null,
        multiplier: rate.multiplier ? Number(rate.multiplier) : 1
      }));

      setSeasonRates(mappedRates);
    } catch {
      setError("Error al cargar los multiplicadores. Por favor intente nuevamente.");
      setSeasonRates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRate = () => {
    setSeasonRates([...seasonRates, { since: null, until: null, multiplier: 1 }]);
  };

  const handleRemoveRate = index => {
    setSeasonRates(seasonRates.filter((_, i) => i !== index));
  };

  const handleDateRangeChange = (index, dates) => {
    const [start, end] = dates;
    const newRates = [...seasonRates];
    newRates[index].since = start;
    newRates[index].until = end;
    setSeasonRates(newRates);
    setError("");
  };

  const handleMultiplierChange = (index, value) => {
    const newRates = [...seasonRates];
    newRates[index].multiplier = Number(value);
    setSeasonRates(newRates);
    setError("");
  };

  const validateRates = () => {
    if (seasonRates.length === 0) {
      setError("Por favor agregue al menos un período");
      return false;
    }

    for (let i = 0; i < seasonRates.length; i++) {
      const rate = seasonRates[i];
      const isLastRate = i === seasonRates.length - 1;
      const isLastRateEmpty = !rate.since && !rate.until && rate.multiplier === 1;

      if (isLastRate && isLastRateEmpty) {
        continue;
      }

      if (!rate.since || !rate.until) {
        setError("Por favor complete todas las fechas");
        return false;
      }
      if (rate.since > rate.until) {
        setError("La fecha de inicio debe ser anterior a la fecha de fin");
        return false;
      }
      if (!rate.multiplier || rate.multiplier <= 0) {
        setError("El multiplicador debe ser mayor a 0");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!validateRates()) {
        return;
      }

      const ratesToSubmit = seasonRates.filter((rate, index) => {
        const isLastRate = index === seasonRates.length - 1;
        const isLastRateEmpty = !rate.since && !rate.until && rate.multiplier === 1;
        return !(isLastRate && isLastRateEmpty);
      });

      const dataToSend = ratesToSubmit.map(rate => [
        format(rate.since, "yyyy-MM-dd"),
        format(rate.until, "yyyy-MM-dd"),
        rate.multiplier
      ]);

      const response = await fetchWithToken("/motor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      await fetchSeasonRates();
      setShowSuccessModal(true);
      setError("");
    } catch (error) {
      setError(
        error.message || "Error al actualizar los multiplicadores. Por favor intente nuevamente."
      );
      setShowSuccessModal(false);
    }
  };

  const isDateAvailable = (date, currentIndex) => {
    if (!date) return true;

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return !seasonRates.some((rate, index) => {
      if (index === currentIndex || !rate.since || !rate.until) {
        return false;
      }

      const startDate = new Date(rate.since);
      const endDate = new Date(rate.until);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="price-multiplier">
          <div className="loading">Cargando...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="price-multiplier">
        <h1 className="price-multiplier__title">Multiplicadores por Temporada</h1>

        <div className="price-multiplier__content">
          {seasonRates.map((rate, index) => (
            <MultiplierRow
              key={index}
              rate={rate}
              index={index}
              isLast={index === seasonRates.length - 1}
              onDateRangeChange={handleDateRangeChange}
              onMultiplierChange={handleMultiplierChange}
              onRemove={handleRemoveRate}
              onAdd={handleAddRate}
              isDateAvailable={isDateAvailable}
            />
          ))}

          {seasonRates.length === 0 && (
            <div className="price-multiplier__empty-state">
              <button onClick={handleAddRate} className="price-multiplier__add-button">
                Agregar período
              </button>
            </div>
          )}

          <div className="price-multiplier__actions">
            <button onClick={handleAddRate} className="price-multiplier__add-button">
              Agregar período
            </button>
            <Button1 title="Guardar cambios" onClick={handleSubmit} />
          </div>

          <SeasonCalendar rates={seasonRates} />
        </div>

        {showSuccessModal && (
          <SuccessModal
            message="Los multiplicadores han sido actualizados correctamente"
            onClose={() => setShowSuccessModal(false)}
          />
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    </>
  );
}

export default PriceMultiplier;
