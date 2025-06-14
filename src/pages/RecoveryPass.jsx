import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Login.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button1 from "../components/Button1";
import config from "../config";

function RecoveryPass() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Token no válido");
    }
  }, [searchParams]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const token = searchParams.get("token");
      const response = await fetch(`${config.baseUrl}/recoveryPass`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (response.status === 200) {
        setSuccess("Contraseña modificada con éxito");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(data.message || "Error al modificar la contraseña");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor");
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
              onFocus={() => {
                setError("");
                setSuccess("");
              }}
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
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar contraseña..."
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => {
                setError("");
                setSuccess("");
              }}
              required
              className="login-input login-input-bottom"
            />

            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
              {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}
          {success && <p className="login-success">{success}</p>}
          <Button1 type="submit" title="Cambiar Contraseña" />
        </form>
      </div>
    </div>
  );
}

export default RecoveryPass; 