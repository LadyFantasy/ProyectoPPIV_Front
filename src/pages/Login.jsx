// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState(""); // Sin valores predeterminados, el usuario ingresa su propio usuario
  const [password, setPassword] = useState(""); // Sin valores predeterminados, el usuario ingresa su propia contraseña
  const [error, setError] = useState(""); // Para mostrar errores si los hay
  const navigate = useNavigate(); // Para redirigir después del login

  const handleLogin = async (e) => {
    e.preventDefault(); // Evita la recarga de la página al hacer submit

    try {
      const response = await fetch("https://proyectoppvi.onrender.com/login", {
        method: "POST", // Enviar datos al backend
        headers: {
          "Content-Type": "application/json", // Indicar que se envía JSON
        },
        body: JSON.stringify({ username, password }), // Enviar los datos de login
      });

      const data = await response.json(); // Obtener la respuesta en formato JSON

      if (response.status === 200 && data.success) {
        // Si el login es exitoso, se guarda el token en el localStorage
        localStorage.setItem("token", data.token);

        // Redirigir a la página de unidades
        navigate("/units");
      } else if (response.status === 401) {
        // Si las credenciales son incorrectas
        setError("Usuario o contraseña incorrectos");
      } else {
        // Manejo de otros errores del servidor
        setError("Error inesperado del servidor");
      }
    } catch (err) {
      console.error("Error al conectar con el servidor:", err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Actualiza el valor del usuario
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Actualiza el valor de la contraseña
          required
          className="login-input"
        />
        <button type="submit" className="login-button button">Ingresar</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Mostrar error si es necesario */}
    </div>
  );
}

export default Login;
