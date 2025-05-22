import React, { useState, useEffect } from "react";
import { useFetchWithAuth } from "../hooks/useFetchWithAuth"; 
import UnitDetail from "./UnitDetail";
import "../styles/Units.css"; 

export default function Units() {
  const { data, error, loading } = useFetchWithAuth("/unidades");
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);

  useEffect(() => {
    if (data) setUnits(data);
  }, [data]);

  const handleSelectUnit = (unit) => setSelectedUnit(unit);

  const handleUpdateUnit = (updatedUnit) => {
    setUnits((prev) =>
      prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u))
    );
    setSelectedUnit(updatedUnit);
  };

  const handleDeleteUnit = (id) => {
    setUnits((prev) => prev.filter((u) => u.id !== id));
    setSelectedUnit(null);
  };

  if (loading) return <p>Cargando unidades...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="units-container">
      <div className="units-list">
        <h2>Unidades</h2>
        {units.length === 0 && <p>No hay unidades disponibles.</p>}
        <ul className="units-list__grid">
  {units.map(unit => (
    <li
      key={unit.id}
      className={`unit-item ${selectedUnit?.id === unit.id ? "selected" : ""}`}
      onClick={() => handleSelectUnit(unit)}
    >
      <UnitCard unit={unit} />
    </li>
  ))}
</ul>

      </div>

      <div className="units-detail">
        {selectedUnit ? (
          <UnitDetail
            unit={selectedUnit}
            onUpdate={handleUpdateUnit}
            onDelete={handleDeleteUnit}
          />
        ) : (
          <p>Selecciona una unidad para ver o editar.</p>
        )}
      </div>
    </div>
  );
}
