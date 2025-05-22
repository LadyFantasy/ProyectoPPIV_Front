import React, { useState } from "react";
import { fetchWithToken } from "../utils/fetchWithToken"; 
import "../styles/UnitDetail.css"; 

export default function UnitDetail({ unit, onUpdate, onDelete }) {
  const [formData, setFormData] = useState({
    rooms: unit.rooms,
    beds: unit.beds,
    description: unit.description,
    price: unit.price,
    amenities: unit.amenities,
    urls_fotos: unit.urls_fotos,
    id: unit.id,
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [actionType, setActionType] = useState(null); // "edit" o "delete"
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fd) => ({ ...fd, [name]: value }));
  };

  const openConfirm = (type) => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const closeConfirm = () => {
    setShowConfirmModal(false);
    setError("");
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
  };

  const handleConfirm = async () => {
    try {
      setShowConfirmModal(false);
      if (actionType === "edit") {
        const res = await fetchWithToken("/editarUnidad", {
          method: "POST",
          body: JSON.stringify(formData),
        });
        console.log(res)
        setShowSuccessModal(true);
        onUpdate && onUpdate(formData);
      } else if (actionType === "delete") {
        const res = await fetchWithToken("/eliminarUnidad", {
          method: "POST",
          body: JSON.stringify({ id: formData.id }),
        });
        console.log(res)
        setShowSuccessModal(true);
        onDelete && onDelete(formData.id);
      }
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(true);
    }
  };

  return (
    <>
      <div className="unit-detail">
        <label>
          Habitaciones:
          <input
            type="number"
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
          />
        </label>
        <label>
          Camas:
          <input
            type="number"
            name="beds"
            value={formData.beds}
            onChange={handleChange}
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Precio:
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Amenities (coma separados):
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
          />
        </label>
        <label>
          URLs Fotos (coma separados):
          <input
            type="text"
            name="urls_fotos"
            value={formData.urls_fotos}
            onChange={handleChange}
          />
        </label>

        <div className="buttons">
          <button onClick={() => openConfirm("edit")}>Guardar Cambios</button>
          <button onClick={() => openConfirm("delete")}>Eliminar Unidad</button>
        </div>
      </div>

      {showConfirmModal && (
        <>
          <div className="overlay" />
          <div className="modal">
            <p>
              ¿Desea confirmar {actionType === "edit" ? "los cambios" : "la eliminación"}?
            </p>
            {error && <p className="error">{error}</p>}
            <button onClick={handleConfirm}>Confirmar</button>
            <button onClick={closeConfirm}>Cancelar</button>
          </div>
        </>
      )}

      {showSuccessModal && (
        <>
          <div className="overlay" />
          <div className="modal">
            <p>Cambios guardados correctamente</p>
            <button onClick={closeSuccess}>Cerrar</button>
          </div>
        </>
      )}
    </>
  );
}
