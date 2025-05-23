export default function SuccessModal({ message }) {
  return (
    <div className="overlay">
      <div className="modal">
        <p>{message}</p>
      </div>
    </div>
  );
}
