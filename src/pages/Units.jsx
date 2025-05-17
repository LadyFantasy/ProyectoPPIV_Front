import "../styles/Units.css";

function Units() {
  return (
    <div>
      <h1>Funcó el login</h1>
    </div>
  );
}

/* para desarrollo, usar defaultprops para pasar valores por defecto a los props de las unidades  */
/* Si estás usando desestructuración con valores por defecto directamente en los parámetros, podés evitar defaultProps así: */

/* function AdminCard({ title, onClick, className = "" }) {
  // ...
} */

Units.defaultProps = {
  title: "Unidades",
  description: "Descripción de la unidad",
  imageUrl: "https://via.placeholder.com/150",
  onClick: () => {},
};
export default Units;