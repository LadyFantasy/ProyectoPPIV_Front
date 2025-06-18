import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithToken } from "../utils/fetchWithToken";
import Navbar from "../components/Navbar";
import { FiTrash2, FiEdit } from "react-icons/fi";
import SuccessModal from "../components/SuccessModal";
import Button1 from "../components/Button1";
import "../styles/Admins.css";

function Admins() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState({});
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSuperAdmin = () => {
      const superAdmin = localStorage.getItem("isSuperAdmin") === "1";
      if (!superAdmin) {
        navigate("/admin");
        return false;
      }
      return true;
    };

    if (checkSuperAdmin()) {
      loadAdmins();
    }
  }, [navigate]);

  const handleDeleteClick = (id, username) => {
    setAdminToDelete({ id, username });
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!adminToDelete) return;

    try {
      const response = await fetchWithToken(`/deleteAdmin/${adminToDelete.id}`, {
        method: "DELETE"
      });

      if (response.message) {
        setSuccessMessage(response.message);
        setShowSuccessModal(true);
        loadAdmins();
      }
    } catch {
      setError("Error al eliminar el administrador");
    } finally {
      setShowModal(false);
      setAdminToDelete(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setAdminToDelete(null);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setSuccessMessage("");
  };

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetchWithToken("/verAdmins");
      console.log("Datos recibidos del backend:", response);
      setAdmins(response);
    } catch {
      setError("Error al cargar los administradores");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admins-container">
        <div className="admins-list">
          <div className="admins-list__header">
            <h2>Administradores existentes</h2>
            <Button1 title="Agregar administrador" onClick={() => navigate("/admins/add")} />
          </div>
          {loading ? (
            <p className="loading">Cargando administradores...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="admins-list__content">
              <div className="admin-table">
                <div className="admin-table-header">
                  <div className="admin-table-cell">ID</div>
                  <div className="admin-table-cell">Usuario</div>
                  <div className="admin-table-cell">Super Usuario</div>
                  <div className="admin-table-cell">Acciones</div>
                </div>

                {Object.entries(admins).map(([username, data]) => (
                  <div key={data.id} className="admin-table-row">
                    <div className="admin-table-cell">{data.id}</div>
                    <div className="admin-table-cell">{username}</div>
                    <div className="admin-table-cell">{data.superUser ? "Sí" : "No"}</div>
                    <div className="admin-table-cell actions">
                      <button
                        className="action-button edit"
                        onClick={() => navigate(`/admins/edit/${username}`)}>
                        <FiEdit />
                      </button>
                      <button
                        className="action-button delete"
                        onClick={() => handleDeleteClick(data.id, username)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {showModal && adminToDelete && (
          <SuccessModal
            show={showModal}
            onConfirm={handleDeleteConfirm}
            onCancel={handleCancel}
            showCancelButton={true}
            message={`¿Estás seguro de que deseas eliminar al administrador ${adminToDelete.username}?`}
          />
        )}

        {showSuccessModal && (
          <SuccessModal
            show={showSuccessModal}
            onConfirm={handleSuccessClose}
            message={successMessage}
          />
        )}
      </div>
    </>
  );
}

export default Admins;
