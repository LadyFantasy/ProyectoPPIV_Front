import placeholder from "../assets/casita.jpg";

export default function PhotoCarousel({ fotos = [] }) {
  const images = fotos.length ? fotos : [placeholder];

  return (
    <div className="carousel">
      {images.map((url, idx) => (
        <img key={idx} src={url} alt={`Foto ${idx + 1}`} />
      ))}
    </div>
  );
}
