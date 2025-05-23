const ALL_AMENITIES = [
  "aire acondicionado", "ventilador", "wifi", "hidromasaje/jacuzzi",
  "parking", "parrilla", "piscina", "admite mascotas", "balcón",
  "lavarropa", "cocina", "gimnasio", "incluye desayuno", "detector de humo",
  "blanqueria", "servicio de habitaciones"
];

export default function AmenitySelector({ selected = [], onToggle }) {
  const handleChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    onToggle(options);
  };

  return (
    <select multiple value={selected} onChange={handleChange}>
      {ALL_AMENITIES.map((amenity) => (
        <option key={amenity} value={amenity}>
          {amenity}
        </option>
      ))}
    </select>
  );
}
