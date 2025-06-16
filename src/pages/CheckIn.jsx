import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import SuccessModal from "../components/SuccessModal";
import "../styles/CheckIn.css";

function CheckIn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [unitTitle, setUnitTitle] = useState("");

  useEffect(() => {
    const performCheckIn = async () => {
      try {
        setLoading(true);
        const response = await fetchWithToken(`/checkin?id=${id}`);
        if (response.message === "Check-in realizado con éxito") {
          setUnitTitle(response.unit);
          setShowSuccessModal(true);
        } else {
          setError("No se pudo realizar el check-in");
        }
      } catch (error) {
        setError("Error al realizar el check-in");
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

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="checkin-container">
        <div className="checkin-content">
          {loading ? (
            <div className="loading">Procesando check-in...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : null}
        </div>

        {showSuccessModal && (
          <SuccessModal
            message={`¡Check-in realizado con éxito! Bienvenido a ${unitTitle}`}
            onClose={handleSuccessClose}
          />
        )}
      </div>
    </>
  );
}

export default CheckIn;
