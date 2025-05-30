//components/ConfirmModal.jsx

import { useState } from "react";
import "../styles/modal.css";
import Button1 from "./Button1";

export default function SuccessModal({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="overlay">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <Button1 title="Aceptar" onClick={handleClose} />
        </div>
      </div>
    </div>
  );
}
