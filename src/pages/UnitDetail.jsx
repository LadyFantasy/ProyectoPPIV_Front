// src/pages/UnitDetail.jsx
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import PhotoCarousel from "../components/PhotoCarousel";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import AmenitiesSelector from "../components/AmenitiesSelector";
import Button1 from "../components/Button1";
import { FaArrowLeft } from "react-icons/fa";
import placeholder from "../assets/casita.jpg";
import "../styles/UnitDetail.css";

const ALL_AMENITIES = [
  "aire acondicionado", "ventilador", "wifi", "hidromasaje/jacuzzi", "parking", "parrilla",
  "piscina", "admite mascotas", "balcón", "lavarropa", "cocina", "gimnasio",
  "incluye desayuno", "detector de humo", "blanqueria", "servicio de habitaciones"
];

export default function UnitDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(state?.unit || null);
  const [formData, setFormData] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Buscar unidad por ID si no viene del estado
  useEffect(() => {
    if (!unit && id) {
      const fetchUnit = async () => {
        try {
          const res = await fetchWithToken(`/unidad/${id}`);
          const data = await res.json();
          setUnit(data);
        } catch (err) {
          console.error("Error al obtener la unidad:", err);
          navigate("/units");
        }
      };
      fetchUnit();
    }
  }, [unit, id, navigate]);

  // Inicializar formData y amenities a partir de unit
  useEffect(() => {
    if (unit) {
      setFormData({
        ...unit,
        title: unit.title || "",
        address: unit.address || "",
        bathrooms: unit.bathrooms || 1,
        urls_fotos: unit.urls_fotos || ""
      });
      setAmenities(unit.amenities ? unit.amenities.split(",").map(a => a.trim()) : []);
    }
  }, [unit]);

  if (!formData) return null;

  const handleChange = e =>
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

  const handleNewPhoto = newUrl => {
    const currentUrls = formData.urls_fotos
      ? formData.urls_fotos
          .split(",")
          .map(u => u.trim())
          .filter(Boolean)
      : [];
    const updatedUrls = [...currentUrls, newUrl];
    setFormData(prev => ({
      ...prev,
      urls_fotos: updatedUrls.join(", ")
    }));
  };

  const dataToSend = {
    address: formData.address,
    id: formData.id,
    title: formData.title,
    rooms: Number(formData.rooms),
    beds: Number(formData.beds),
    bathrooms: Number(formData.bathrooms),
    description: formData.description,
    price: Number(formData.price),
    amenities: amenities.join(", "),
    urls_fotos: formData.urls_fotos?.length > 0 ? formData.urls_fotos : ""
  };

  const confirmAction = async () => {
    try {
      if (modal === "edit") {
        console.log("Datos enviados:", dataToSend);
        await fetchWithToken("/editarUnidad", {
          method: "POST",
          body: JSON.stringify(dataToSend)
        });
      } else if (modal === "delete") {
        await fetchWithToken("/eliminarUnidad", {
          method: "POST",
          body: JSON.stringify({ id: formData.id })
        });
      }

      const currentAction = modal;
      setModal(null);
      setSuccess(true);

      setTimeout(() => {
        currentAction === "delete" ? navigate("/units") : setSuccess(false);
      }, 2000);

    } catch (err) {
      setError(err.message || "Error al procesar la solicitud");
    }
  };

  const fotos = formData.urls_fotos?.trim()
    ? formData.urls_fotos
        .split(",")
        .map(f => f.trim())
        .filter(Boolean)
    : [placeholder];

  return (
    <>
      <Navbar />
      <button className="back-button" onClick={() => navigate("/units")}>
        <FaArrowLeft className="back-icon" />
      </button>

      <div className="unit-detail">
        <h2 className="unit-detail__title">Modificar unidad</h2>

        <div className="unit-detail__wrapper">
          <PhotoCarousel fotos={fotos} onUploadSuccess={handleNewPhoto} />

          <div className="unit-detail__inputs">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Título"
              className="unit-input"
            />
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="unit-input"
            />
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Dirección"
              className="unit-input"
            />
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Precio"
              className="unit-input"
            />

            <div className="unit-detail__numeric-group">
              {["rooms", "beds", "bathrooms"].map(field => (
                <div key={field} className="numeric-input">
                  <label className="numeric-label">
                    {field === "rooms"
                      ? "Habitaciones"
                      : field === "beds"
                      ? "Camas"
                      : "Baños"}
                  </label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="numeric-select"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <AmenitiesSelector all={ALL_AMENITIES} selected={amenities} onChange={setAmenities} />
        </div>

        <div className="unit-detail__buttons">
          <Button1 title="Modificar" onClick={() => setModal("edit")} />
          <Button1 title="Eliminar" className="danger" onClick={() => setModal("delete")} />
        </div>

        {modal && (
          <ConfirmModal
            text={
              modal === "edit"
                ? "¿Desea confirmar los cambios?"
                : "¿Desea eliminar esta unidad?"
            }
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
