import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button1 from "../components/Button1";
import SuccessModal from "../components/SuccessModal";
import config from "../config";
import "../styles/Login.css";

const RecoveryPass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setModalMessage("Token no válido o expirado");
      setIsSuccess(false);
      setShowModal(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }, [token, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setModalMessage("Las contraseñas no coinciden");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    if (password.length < 6) {
      setModalMessage("La contraseña debe tener al menos 6 caracteres");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch(`${config.baseUrl}/recoveryPass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (response.status === 200) {
        setModalMessage(data.message);
        setIsSuccess(true);
        setShowModal(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (response.status === 404) {
        setModalMessage("El enlace de recuperación ha expirado o no es válido");
        setIsSuccess(false);
        setShowModal(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setModalMessage(data.message || "Error al cambiar la contraseña");
        setIsSuccess(false);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setModalMessage("No se pudo conectar con el servidor");
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <span className="login-omega">Ω</span>
        <h1 className="login-title">Omeguitas</h1>
      </div>

      <div className="login-login">
        <h2 className="login-login__title">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setShowModal(false)}
              required
              className="login-input login-input-top"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          <div className="login-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña..."
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => setShowModal(false)}
              required
              className="login-input login-input-bottom"
            />
          </div>

          <Button1 type="submit" title="Cambiar Contraseña" />
        </form>
      </div>

      {showModal && (
        <SuccessModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
          isSuccess={isSuccess}
        />
      )}
    </div>
  );
};

export default RecoveryPass;
