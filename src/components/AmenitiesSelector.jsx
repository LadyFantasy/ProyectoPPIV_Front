import { useState } from "react";
import "../styles/AmenitiesSelector.css";
import Button1 from "./Button1";

export default function AmenitiesSelector({ all, selected, onChange }) {
  const [open, setOpen] = useState(false);

  const toggleAmenity = amenity => {
    onChange(
      selected.includes(amenity) ? selected.filter(a => a !== amenity) : [...selected, amenity]
    );
  };

  return (
    <div className="amenities-dropdown">
      <Button1
        type="button"
        className="button1 amenities-toggle"
        onClick={() => setOpen(o => !o)}
        title="Comodidades"
      />

      {open && (
        <div className="amenities-options">
          {all.map(a => (
            <label key={a} className="amenity-option">
              <input
                className="amenity-checkbox"
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
