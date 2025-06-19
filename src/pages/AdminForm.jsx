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
      console.log("Response from /verAdmins:", response);
      const adminData = response[username];
      console.log("Admin data for username:", username, adminData);
      if (adminData) {
        setFormData(prev => ({
          ...prev,
          username: adminData.username,
          superUser: adminData.superUser
        }));
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      setError(err.message || "Error al cargar los datos del administrador");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "True" : "False") : value
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
        if (formData.password) {
          await fetchWithToken("/editPass", {
            method: "POST",
            body: JSON.stringify({
              password: formData.password
            })
          });
        }
      } else {
        const adminData = {
          username: formData.username,
          password: formData.password,
          superUser: formData.superUser
        };
        await fetchWithToken("/crearAdmin", {
          method: "POST",
          body: JSON.stringify(adminData)
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
      <div className="admin-form-container">
        <h2 className="admin-form-title">
          {isEditing ? "Editar administrador" : "Agregar administrador"}
        </h2>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Usuario"
            className="admin-input"
            disabled={isEditing}
          />
          <label className="admin-label">
            <input
              type="checkbox"
              name="superUser"
              checked={formData.superUser === "True" || formData.superUser === true}
              onChange={handleChange}
              className="admin-checkbox"
            />
            Super usuario
          </label>
          {error && <div className="error-message">{error}</div>}
          <Button1 title={isEditing ? "Guardar cambios" : "Agregar administrador"} type="submit" />
        </form>
      </div>
    </>
  );
}

export default AdminForm;
