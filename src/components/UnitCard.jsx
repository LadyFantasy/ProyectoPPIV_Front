import "../styles/UnitCard.css";
import placeholder from "../assets/casita.jpg"; // imagen genérica

const UnitCard = ({ unit }) => {
  const foto = unit.urls_fotos?.split(",")[0] || placeholder;

  return (
    <div className="unit-card">
      <img src={foto} alt="Foto alojamiento" className="unit-card__img" />
      <div className="unit-card__info">
        <h3 className="unit-card__title">Unidad {unit.id}</h3>
        <p className="unit-card__price">${parseFloat(unit.price).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default UnitCard;