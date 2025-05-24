import "../styles/modal.css";
import Button1 from "./Button1";

export default function ConfirmModal({ text, error, onConfirm, onCancel }) {
  return (
    <div className="overlay">
      <div className="modal">
        <p>{text}</p>
        {error && <p className="error">{error}</p>}
        <div className="modal-buttons">
          <Button1 title="Confirmar" onClick={onConfirm} />
          <Button1 title="Cancelar" className="danger" onClick={onCancel} />
        </div>
      </div>
    </div>
  );
}
