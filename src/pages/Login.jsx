// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/Login.css";

function Login() {
  const [username, setUsername] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); // 
  const navigate = useNavigate();
  const { login } = useAuth();

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
         login(data.access_token);   
       
       /*  localStorage.setItem("token", data.access_token); */

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
      <div className="login-logo">
        <span className="login-omega">Ω</span>
        <h1 className="login-title">Omeguitas</h1>
      </div>
      
      <div className="login-login">
        <h2 className="login-login__title">Bienvenido</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
        
          type="text" /* CAMBIAR A TYPE TEXT CUANDO SE ACTUALICE LA DB */
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
        <button type="submit" className="login-button">Ingresar</button>
      </form>
      <h4 className="login-login_pass">Olvidé mi contraseña</h4>
      {/* TODO Agregar en botón de "Olvidé mi contraseña" link a algún lado
          TODO Agregar un botón de "Crear cuenta" */}
      {error && <p className="error">{error}</p>} {}
      </div>
      
    </div>
  );
}

export default Login;
