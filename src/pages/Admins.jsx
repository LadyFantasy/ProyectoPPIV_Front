import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import "../styles/Admins.css";

function Admins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState({});
  const [newAdmin, setNewAdmin] = useState({ username: "", password: "", superUser: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    checkSuperAdmin();
  }, []);

  const checkSuperAdmin = async () => {
    try {
      const response = await fetchWithToken("/verAdmins");
      // Si podemos ver los admins, significa que somos superadmin
      setIsSuperAdmin(true);
      setAdmins(response);
    } catch {
      setError("No tienes permisos para acceder a esta página");
      // Redirigir al panel de admin después de 2 segundos
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    }
  };

  const handleCreateAdmin = async e => {
    e.preventDefault();
    try {
      const response = await fetchWithToken("/crearAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newAdmin)
      });

      if (response.mensaje) {
        setSuccess(response.mensaje);
        setNewAdmin({ username: "", password: "", superUser: false });
        loadAdmins();
      }
    } catch {
      setError("Error al crear el administrador");
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setNewAdmin(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const loadAdmins = async () => {
    try {
      const response = await fetchWithToken("/verAdmins");
      setAdmins(response);
    } catch {
      setError("Error al cargar los administradores");
    }
  };

  if (!isSuperAdmin) {
    return (
      <>
        <Navbar />
        <div className="admins-container">
          <div className="error-message">{error}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="admins-container">
        <h1>Administración de Administradores</h1>

        {/* Formulario de creación */}
        <div className="admin-form">
          <h2>Crear Nuevo Administrador</h2>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={newAdmin.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={newAdmin.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  name="superUser"
                  checked={newAdmin.superUser}
                  onChange={handleInputChange}
                />
                Super Usuario
              </label>
            </div>
            <button type="submit" className="button1">
              Crear Administrador
            </button>
          </form>
        </div>

        {/* Lista de administradores */}
        <div className="admin-list">
          <h2>Administradores Existentes</h2>
          <div className="admin-grid">
            {Object.entries(admins).map(([username, data]) => (
              <div key={data.id} className="admin-card">
                <h3>{username}</h3>
                <p>ID: {data.id}</p>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>
    </>
  );
}

export default Admins;
