import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AdminCard from "../components/AdminCard";
import SuccessModal from "../components/SuccessModal";
import { fetchWithToken } from "../utils/fetchWithToken";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminPanel.css";
import Navbar from "../components/Navbar";

function AdminPanel() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [isGeneratingReports, setIsGeneratingReports] = useState(false);

  const handleGenerateReports = async () => {
    try {
      setIsGeneratingReports(true);
      await fetchWithToken("/informes");
      setShowSuccessModal(true);
      setError("");
    } catch (error) {
      console.error("Error generating reports:", error);
      setError("Error al generar los informes");
      setShowSuccessModal(false);
    } finally {
      setIsGeneratingReports(false);
    }
  };

  const adminCards = [
    {
      title: "Administrar unidades",
      route: "/units"
    },
    ...(isSuperAdmin
      ? [
          {
            title: "Administrar admins",
            route: "/admins"
          }
        ]
      : []),
    {
      title: "Ver reservas",
      route: "#"
    },
    {
      title: "Multiplicador de precio",
      route: "/price-multiplier"
    },
    {
      title: isGeneratingReports ? "Generando informes..." : "Generar informes",
      onClick: handleGenerateReports,
      disabled: isGeneratingReports
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
              disabled={card.disabled}
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
