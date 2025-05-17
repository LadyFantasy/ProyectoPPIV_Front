import {useNavigate} from "react-router-dom";
import AdminCard from "../components/AdminCard";
import "../styles/AdminPanel.css";

function AdminPanel() {
    const navigate = useNavigate();

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
        <div className="admin-panel__cards">
            {adminCards.map((card, index) => (<AdminCard
                key={index}
                title={card.title}
                onClick={() => navigate(card.route)}
                className="admin-panel__card"/>))}
        </div>
    );
}

export default AdminPanel;