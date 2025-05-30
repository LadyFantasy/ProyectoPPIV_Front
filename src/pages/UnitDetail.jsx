// src/pages/UnitDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
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
import { ALL_AMENITIES } from "../constants/amenities";
import "../styles/UnitDetail.css";

export default function UnitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [formData, setFormData] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchUnit();
  }, [id]);

  const fetchUnit = async () => {
    try {
      const data = await fetchWithToken(`/api/terceros/units/?id=${id}`);
      if (Array.isArray(data) && data.length > 0) {
        setUnit(data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener la unidad:", err);
      navigate("/units");
    }
  };

  useEffect(() => {
    if (unit) {
      setFormData({
        ...unit,
        title: unit.title || "",
        address: unit.address || "",
        bathrooms: unit.bathrooms || 1,
        urls_fotos: unit.urls_fotos || ""
      });
      const cleanAmenities = unit.amenities
        ? unit.amenities
            .replace(/\\/g, "")
            .replace(/"/g, "")
            .split(",")
            .map(a => a.trim())
            .filter(a => a.length > 0)
        : [];
      setAmenities(cleanAmenities);
    }
  }, [unit]);

  if (loading) {
    return (
      <div className="loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!formData) return null;

  const handleChange = e =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  const handleNewPhoto = newUrl => {
    const currentUrls = formData.urls_fotos
      ? formData.urls_fotos
          .split(",")
          .map(u => u.trim())
          .filter(u => u.length > 0)
      : [];
    const updatedUrls = [...currentUrls, newUrl];
    setFormData(prev => ({
      ...prev,
      urls_fotos: updatedUrls.join(",")
    }));
  };

  const handleDeletePhoto = photoUrl => {
    const currentUrls = formData.urls_fotos
      ? formData.urls_fotos
          .split(",")
          .map(u => u.trim())
          .filter(u => u.length > 0)
      : [];
    const updatedUrls = currentUrls.filter(url => url !== photoUrl);
    setFormData(prev => ({
      ...prev,
      urls_fotos: updatedUrls.join(",")
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
    amenities: amenities.join(","),
    urls_fotos: formData.urls_fotos ? formData.urls_fotos.trim() : ""
  };

  const confirmAction = async () => {
    try {
      if (modal === "edit") {
        await fetchWithToken("/editarUnidad", {
          method: "POST",
          body: JSON.stringify(dataToSend)
        });
        await fetchUnit();
        setModal(null);
        setSuccess(true);
      } else if (modal === "delete") {
        await fetchWithToken("/eliminarUnidad", {
          method: "POST",
          body: JSON.stringify({ id: unit.id })
        });
        setSuccess(true);
        setIsDeleting(true);
        setModal(null);
      }
    } catch (error) {
      console.error("Error detallado:", error);
      setError(error.message || "Error al procesar la solicitud");
      setModal(null);
    }
  };

  const fotos = formData.urls_fotos
    ? formData.urls_fotos
        .split(",")
        .map(f => f.trim())
        .filter(f => f !== "")
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
          <PhotoCarousel
            fotos={fotos}
            onUploadSuccess={handleNewPhoto}
            onDeletePhoto={handleDeletePhoto}
          />

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
                    {field === "rooms" ? "Habitaciones" : field === "beds" ? "Camas" : "Baños"}
                  </label>
                  <select
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="numeric-select">
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
              modal === "edit" ? "¿Desea confirmar los cambios?" : "¿Desea eliminar esta unidad?"
            }
            error={error}
            onConfirm={confirmAction}
            onCancel={() => setModal(null)}
          />
        )}

        {success && (
          <SuccessModal
            message={
              isDeleting
                ? "La unidad se ha eliminado correctamente"
                : "Los cambios se han guardado correctamente"
            }
            onClose={() => {
              setSuccess(false);
              if (isDeleting) {
                navigate("/units");
              }
            }}
          />
        )}
      </div>
    </>
  );
}
