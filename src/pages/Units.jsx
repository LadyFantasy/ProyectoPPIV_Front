import { useState, useEffect } from "react";
import  useFetchWithAuth  from "../hooks/useFetchWithAuth";
import UnitCard from "../components/UnitCard";
import Navbar from "../components/Navbar";
import "../styles/Units.css";

const UNITS_URL = "https://proyectoppvi.onrender.com/api/terceros/units";

export default function Units() {
  const { data, error, loading } = useFetchWithAuth(UNITS_URL);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (data) setUnits(data);
  }, [data]);

  if (loading) return <p>Cargando unidades...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <Navbar />
 <div className="units-page">
      <h2>Unidades</h2>

      {units.length === 0 ? (
        <p>No hay unidades disponibles.</p>
      ) : (
        <div className="units-grid">
          {units.map((u) => (
            <UnitCard key={u.id} unit={u} />
          ))}
        </div>
      )}
    </div>
  );
    </>
  );

    
}
