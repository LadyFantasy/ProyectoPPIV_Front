import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UnitCard from "../components/UnitCard";
import Navbar from "../components/Navbar";
import Button1 from "../components/Button1";
import "../styles/Units.css";

const UNITS_URL = "https://proyectoppvi.onrender.com/api/terceros/units";

export default function Units() {
  const navigate = useNavigate();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await fetch(UNITS_URL);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setUnits(data);
      } catch (err) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  if (loading) return <p className="loading">Cargando unidades...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="units-page">
        <div className="units-header">
          <h2>Unidades</h2>
          <Button1 title="Agregar unidad" onClick={() => navigate("/units/add")} />
        </div>

        {units.length === 0 ? (
          <p>No hay unidades disponibles.</p>
        ) : (
          <div className="units-grid">
            {units.map(u => (
              <UnitCard key={u.id} unit={u} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
