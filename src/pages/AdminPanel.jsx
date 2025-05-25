import { useNavigate } from "react-router-dom";
import AdminCard from "../components/AdminCard";
import "../styles/AdminPanel.css";
import Navbar from "../components/Navbar";

function AdminPanel() {
  const navigate = useNavigate();

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
      route: "#"
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
              onClick={() => navigate(card.route)}
              className="admin-panel__card"
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminPanel;
