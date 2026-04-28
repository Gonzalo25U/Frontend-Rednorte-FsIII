
import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import { logout } from "../../utils/auth.js";
import UserTable from "../../components/admin/UserTable.jsx";

export default function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/users");
      setUsers(data);
    } catch (err) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-brand">
          <span className="header-logo">✚</span>
          <span className="header-title">RedNorte</span>
        </div>
        <div className="header-actions">
          <span className="header-role">Administrador</span>
          <button className="btn-logout" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="section-header">
          <div>
            <h1 className="section-title">Usuarios</h1>
            <p className="section-subtitle">Gestión de pacientes y médicos del sistema</p>
          </div>
          <button className="btn-primary" onClick={fetchUsers}>
            Actualizar
          </button>
        </div>

        <UserTable users={users} loading={loading} error={error} />
      </main>
    </div>
  );
}