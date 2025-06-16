import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import Button1 from "../components/Button1";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/AdminForm.css";
import "../styles/BackButton.css";

function AdminForm() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    superUser: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isEditing = !!username;

  useEffect(() => {
    const checkSuperAdmin = () => {
      const superAdmin = localStorage.getItem("isSuperAdmin") === "1";
      if (!superAdmin) {
        navigate("/admin");
        return false;
      }
      return true;
    };

    if (checkSuperAdmin() && isEditing) {
      loadAdminData();
    }
  }, [username, navigate]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const response = await fetchWithToken("/verAdmins");
      const adminData = response[username];
      if (adminData) {
        setFormData(prev => ({
          ...prev,
          username: adminData.username,
          superUser: adminData.superUser
        }));
      }
    } catch (error) {
      setError(error.message || "Error al cargar los datos del administrador");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    if (!isEditing && formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!isEditing && formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setLoading(true);
      if (isEditing) {
        // Si se proporcionó una nueva contraseña, actualizarla
        if (formData.password) {
          console.log("Datos enviados al backend para modificar contraseña:", {
            password: formData.password
          });
          await fetchWithToken("/editPass", {
            method: "POST",
            body: JSON.stringify({
              password: formData.password
            })
          });
        }
        // No hay ruta para modificar superUser en el backend
        // TODO: Implementar cuando el backend lo soporte
      } else {
        console.log("Datos enviados al backend para crear admin:", {
          username: formData.username,
          password: formData.password,
          superUser: formData.superUser
        });
        await fetchWithToken("/crearAdmin", {
          method: "POST",
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            superUser: formData.superUser
          })
        });
      }

      navigate("/admins");
    } catch (error) {
      setError(error.message || "Error al procesar la solicitud");
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">Cargando...</p>;

  return (
    <>
      <Navbar />
      <Button1
        title={<FaArrowLeft className="back-icon" />}
        onClick={() => navigate("/admins")}
        className="back-button"
      />
      <div className="admin-form">
        <form onSubmit={handleSubmit} className="admin-form__form">
          <div className="admin-form__field">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isEditing}
              required
              autoComplete="username"
            />
          </div>

          {!isEditing ? (
            <>
              <div className="admin-form__field">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="admin-form__field">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                />
              </div>
            </>
          ) : (
            <div className="admin-form__field">
              <label htmlFor="password">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          )}

          <div className="admin-form__field checkbox">
            <label htmlFor="superUser">
              <input
                type="checkbox"
                id="superUser"
                name="superUser"
                checked={formData.superUser}
                onChange={handleChange}
              />
              Super Usuario
            </label>
          </div>

          {error && <p className="admin-form__error">{error}</p>}

          <Button1 title={isEditing ? "Modificar" : "Crear"} type="submit" disabled={loading} />
        </form>
      </div>
    </>
  );
}

export default AdminForm;
