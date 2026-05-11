import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import { logout } from "../../utils/auth.js";
import Logo from "../../components/shared/Logo.jsx";
import UserTable from "../../components/admin/UserTable.jsx";
import UserForm from "../../components/admin/UserForm.jsx";
import ConfirmModal from "../../components/shared/ConfirmModal.jsx";
import ChangePasswordModal from "../../components/admin/ChangePasswordModal.jsx";

export default function UserListContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [createdUser, setCreatedUser] = useState(null);

  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [userToChangePassword, setUserToChangePassword] = useState(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get("/bff/admin/users");
      setUsers(data);
    } catch (err) {
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(formData) {
    setFormLoading(true);
    setFormError(null);
    try {
      const newUser = await api.post("/bff/admin/users", formData);
      setCreatedUser(newUser);
      fetchUsers();
    } catch (err) {
      setFormError(err.message || "Error al crear usuario");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteUser() {
    setDeleteLoading(true);
    try {
      await api.delete(`/bff/admin/users/${userToDelete.id}`);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error("Error al eliminar:", err.message);
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleChangePassword(newPassword) {
    setPasswordLoading(true);
    setPasswordError(null);
    try {
      await api.put("/bff/admin/users/password", {
        rut: userToChangePassword.rut,
        newPassword,
      });
      setPasswordSuccess(newPassword);
    } catch (err) {
      setPasswordError(err.message || "Error al cambiar contraseña");
    } finally {
      setPasswordLoading(false);
    }
  }

  function handleCloseForm() {
    setShowForm(false);
    setFormError(null);
    setCreatedUser(null);
  }

  function handleClosePasswordModal() {
    setUserToChangePassword(null);
    setPasswordError(null);
    setPasswordSuccess(null);
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-brand">
          <Logo size="sm" variant="default" />
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
          <div className="header-btns">
            <button className="btn-secondary" onClick={fetchUsers}>
              Actualizar
            </button>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Nuevo usuario
            </button>
          </div>
        </div>

        <UserTable
          users={users}
          loading={loading}
          error={error}
          onDelete={(user) => setUserToDelete(user)}
          onChangePassword={(user) => setUserToChangePassword(user)}
        />
      </main>

      {showForm && (
        <UserForm
          onSubmit={handleCreateUser}
          onClose={handleCloseForm}
          loading={formLoading}
          error={formError}
          createdUser={createdUser}
        />
      )}

      {userToDelete && (
        <ConfirmModal
          title="Eliminar usuario"
          message={`¿Estás seguro que deseas eliminar a ${userToDelete.name}? Esta acción no se puede deshacer.`}
          onConfirm={handleDeleteUser}
          onCancel={() => setUserToDelete(null)}
          loading={deleteLoading}
        />
      )}

      {userToChangePassword && (
        <ChangePasswordModal
          user={userToChangePassword}
          onSubmit={handleChangePassword}
          onClose={handleClosePasswordModal}
          loading={passwordLoading}
          error={passwordError}
          success={passwordSuccess}
        />
      )}
    </div>
  );
}