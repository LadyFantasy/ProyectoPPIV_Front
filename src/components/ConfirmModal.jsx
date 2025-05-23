export default function ConfirmModal({ text, error, onConfirm, onCancel }) {
  return (
    <div className="overlay">
      <div className="modal">
        <p>{text}</p>
        {error && <p className="error">{error}</p>}
        <button onClick={onConfirm}>Confirmar</button>
        <button onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
