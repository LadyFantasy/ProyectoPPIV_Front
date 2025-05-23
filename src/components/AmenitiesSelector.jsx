import { useState } from "react";
import "../styles/AmenitiesSelector.css";

export default function AmenitiesSelector({ all, selected, onChange }) {
  const [open, setOpen] = useState(false);

  const toggleAmenity = (amenity) => {
    onChange(
      selected.includes(amenity)
        ? selected.filter((a) => a !== amenity)
        : [...selected, amenity]
    );
  };

  return (
    <div className="amenities-dropdown">
      <button
        type="button"
        className="amenities-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        Comodidades
      </button>

      {open && (
        <div className="amenities-options">
          {all.map((a) => (
            <label key={a} className="amenity-option">
              <input
                type="checkbox"
                checked={selected.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
