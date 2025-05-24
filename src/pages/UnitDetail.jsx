// src/pages/UnitDetail.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import PhotoCarousel from "../components/PhotoCarousel";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import AmenitiesSelector from "../components/AmenitiesSelector";
import placeholder from "../assets/casita.jpg";
import "../styles/UnitDetail.css";


const ALL_AMENITIES = [
  "aire acondicionado",
  "ventilador",
  "wifi",
  "hidromasaje/jacuzzi",
  "parking",
  "parrilla",
  "piscina",
  "admite mascotas",
  "balcón",
  "lavarropa",
  "cocina",
  "gimnasio",
  "incluye desayuno",
  "detector de humo",
  "blanqueria",
  "servicio de habitaciones",
];

export default function UnitDetail() {
  const { state } = useLocation();
  const unit = state?.unit;
  const navigate = useNavigate();

  const [formData, setFormData] = useState(
    unit
      ? {
          ...unit,
          address: unit.address || "",
          bathrooms: unit.bathrooms || 1,
          urls_fotos: unit.urls_fotos || "",
        }
      : null
  );
  const [amenities, setAmenities] = useState(
    unit?.amenities ? unit.amenities.split(",").map((a) => a.trim()) : []
  );
  const [modal, setModal] = useState(null); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!unit) navigate("/units");
  }, [unit, navigate]);

  if (!unit || !formData) return null;

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });



  // Preparo el objeto que envía al backend, con tipos correctos
 const dataToSend = {
  id: formData.id,
  rooms: Number(formData.rooms),
  beds: Number(formData.beds),
  bathrooms: Number(formData.bathrooms),
  description: formData.description,
  price: Number(formData.price),
  amenities: amenities.join(", "),         
  urls_fotos:
    formData.urls_fotos && formData.urls_fotos.length > 0
      ? formData.urls_fotos                    
      : "",                                   
};

  console.log("Enviando al backend (editarUnidad):", dataToSend);
  

const confirmAction = async () => {
  try {
    if (modal === "edit") {
      await fetchWithToken("/editarUnidad", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });
    } else if (modal === "delete") {
      await fetchWithToken("/eliminarUnidad", {
        method: "POST",
        body: JSON.stringify({ id: formData.id }),
      });
    }
console.log("JSON enviado:", JSON.stringify(dataToSend));
    const currentAction = modal; 



setModal(null);
setSuccess(true);
setTimeout(() => {
  currentAction === "delete" ? navigate("/units") : setSuccess(false);
}, 1500);

  } catch (err) {
    setError(err.message || "Error al procesar la solicitud");
  }
};

const fotos =
  unit.urls_fotos && unit.urls_fotos.trim() !== ""
    ? unit.urls_fotos.split(",").map(f => f.trim()).filter(f => f !== "")
    : [placeholder];

  return (
    <>
    <Navbar/>
    <div className="unit-detail">
      <button onClick={() => navigate("/units")}>Volver</button>
      <h2>Modificar unidad</h2>

      <PhotoCarousel fotos={fotos} />

      <label>
        Descripción
        <input name="description" value={formData.description} onChange={handleChange} />
      </label>

      <label>
        Dirección
        <input name="address" value={formData.address} onChange={handleChange} />
      </label>

      <label>
        Precio
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />
      </label>

      {["rooms", "beds", "bathrooms"].map((field) => (
        <label key={field}>
          {field === "rooms"
            ? "Habitaciones"
            : field === "beds"
            ? "Camas"
            : "Baños"}
          <select name={field} value={formData[field]} onChange={handleChange}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      ))}

<AmenitiesSelector
  all={ALL_AMENITIES}
  selected={amenities}
  onChange={setAmenities}
/>


      <div className="unit-detail__buttons">
        <button onClick={() => setModal("edit")}>Modificar</button>
        <button className="danger" onClick={() => setModal("delete")}>
          Eliminar
        </button>
      </div>

      {modal && (
         
        <ConfirmModal
          text={modal === "edit" ? "¿Confirmar cambios?" : "¿Eliminar unidad?"}
          error={error}
          onConfirm={confirmAction}
          onCancel={() => setModal(null)}
         
        />
      )}

      {success && <SuccessModal message="Acción realizada correctamente." />}
    </div>
    </>
  );
}
