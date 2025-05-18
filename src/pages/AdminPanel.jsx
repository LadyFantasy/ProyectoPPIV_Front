import {useNavigate} from "react-router-dom";
import AdminCard from "../components/AdminCard";
import "../styles/AdminPanel.css";
import { useAuth } from "../context/AuthContext"; 

function AdminPanel() {
    const navigate = useNavigate();
    const { logout, isAuthenticated } = useAuth();
    console.log('Usuario autenticado:', isAuthenticated);

    const adminCards = [
        {
            title: "Administrar unidades",
            route: "/admin/units"
        }, {
            title: "Administrar admins",
            route: "#"
        }, {
            title: "Ver reservas",
            route: "#"
        }, {
            title: "Generar informes",
            route: "#"
        }
    ];

    return (
    <>
        <div className="admin-panel__cards">
            {adminCards.map((card, index) => (<AdminCard
                key={index}
                title={card.title}
                onClick={() => navigate(card.route)}
                className="admin-panel__card"/>))}
        </div>
        
      <button onClick={logout} className="admin-panel__btn">Cerrar sesión</button>
    
    </>
    );
}

export default AdminPanel;