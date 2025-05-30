//components/ConfirmModal.jsx

import { useState, useEffect } from "react";
import placeholder from "../assets/casita.jpg";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import "../styles/PhotoCarousel.css";

export default function PhotoCarousel({ fotos = [], onUploadSuccess }) {
  const [images, setImages] = useState(fotos.length ? fotos : [placeholder]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(""); // mensaje para subir foto

  // Actualizar imágenes cuando cambian las fotos
  useEffect(() => {
    setImages(fotos.length ? fotos : [placeholder]);
  }, [fotos]);

  const prevImage = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setMessage("");

    try {
      const url = await uploadToCloudinary(file);
      setImages(prev => [...prev, url]);
      setCurrentIndex(images.length); // mostrar la última subida
      setMessage("Foto subida correctamente");
      if (onUploadSuccess) onUploadSuccess(url);
    } catch (err) {
      console.error("Error subiendo imagen:", err);
      setMessage("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="carousel">
      <div className="carousel-image-wrapper">
        <img className="carousel-img" src={images[currentIndex]} alt={`Foto ${currentIndex + 1}`} />
      </div>

      <div className="carousel-controls">
        <button onClick={prevImage} disabled={uploading}>
          &lt;
        </button>
        <button onClick={nextImage} disabled={uploading}>
          &gt;
        </button>
      </div>

      <div className="carousel-upload">
        <label className="upload-label">
          {uploading ? "Subiendo..." : "Subir foto"}
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} hidden />
        </label>
      </div>

      {message && <p className={`upload-message ${uploading ? "uploading" : ""}`}>{message}</p>}
    </div>
  );
}
