import "../styles/modal.css";
import Button1 from "./Button1";

export default function SuccessModal({ message }) {
  return (
    <div className="overlay">
      <div className="modal">
        <p>{message}</p>
        <div className="modal-buttons">
          <Button1 title="Cerrar" onClick={() => window.location.reload()} />
        </div>
      </div>
    </div>
  );
}
