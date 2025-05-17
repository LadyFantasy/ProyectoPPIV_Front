// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); // 
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    try {
      const response = await fetch("https://proyectoppvi.onrender.com/login", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ username, password }), 
      });

      const data = await response.json(); 

      if (response.status === 200 ) {
       
        localStorage.setItem("token", data.access_token);

       
        navigate("/admin");
      } else if (response.status === 401) {
        
        setError("Usuario o contraseña incorrectos");
      } else {
       
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
        
          type="texto" /* CAMBIAR A TYPE TEXT CUANDO SE ACTUALICE LA DB */
          placeholder="Tu email..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Tu contraseña..."
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required
          className="login-input"
        />
        <button type="submit" className="login-button button">Ingresar</button>
      </form>
      {error && <p className="error">{error}</p>} {}
    </div>
  );
}

export default Login;
