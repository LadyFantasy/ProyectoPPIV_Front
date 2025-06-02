import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminCard from "../components/AdminCard";
import SuccessModal from "../components/SuccessModal";
import { fetchWithToken } from "../utils/fetchWithToken";
import "../styles/AdminPanel.css";
import Navbar from "../components/Navbar";

function AdminPanel() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateReports = async () => {
    try {
      await fetchWithToken("/informes");
      
      setShowSuccessModal(true);
      setError("");
    } catch (error) {
      console.error("Error generating reports:", error);
      setError("Error al generar los informes");
      setShowSuccessModal(false);
    }
  };

  const adminCards = [
    {
      title: "Administrar unidades",
      route: "/units"
    },
    {
      title: "Administrar admins",
      route: "#"
    },
    {
      title: "Ver reservas",
      route: "#"
    },
    {
      title: "Generar informes",
      onClick: handleGenerateReports
    }
  ];

  return (
    <>
      <Navbar />
      <div className="admin-panel__background">
        <h1 className="admin-panel__title">Panel principal</h1>
        <div className="admin-panel__wrapper">
          {adminCards.map((card, index) => (
            <AdminCard
              key={index}
              title={card.title}
              onClick={card.onClick || (() => navigate(card.route))}
              className="admin-panel__card"
            />
          ))}
        </div>
      </div>
      {showSuccessModal && (
        <SuccessModal
          message="Los informes fueron enviados a su correo electrónico"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
      {error && <div className="error-message">{error}</div>}
    </>
  );
}

export default AdminPanel;
