import { useState } from "react";

export default function UserTable({ users, loading, error, onDelete, onChangePassword }) {
  const [openMenu, setOpenMenu] = useState(null);

  if (loading) {
    return (
      <div className="table-state">
        <span className="spinner-lg" />
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return <div className="table-state error"><p>{error}</p></div>;
  }

  if (!users || users.length === 0) {
    return <div className="table-state"><p>No hay usuarios registrados.</p></div>;
  }

  const roleLabel = {
    ADMIN: "Administrador",
    DOCTOR: "Doctor",
    PACIENTE: "Paciente",
  };

  const roleClass = {
    ADMIN: "badge badge-admin",
    DOCTOR: "badge badge-doctor",
    PACIENTE: "badge badge-paciente",
  };

  function toggleMenu(id) {
    setOpenMenu(openMenu === id ? null : id);
  }

  function handleAction(action, user) {
    setOpenMenu(null);
    action(user);
  }

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="td-rut">{user.rut}</td>
              <td>{user.name}</td>
              <td>
                <span className={roleClass[user.role] || "badge"}>
                  {roleLabel[user.role] || user.role}
                </span>
              </td>
              <td>
                <span className={user.active ? "status active" : "status inactive"}>
                  {user.active ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="td-actions">
                {user.role !== "ADMIN" && (
                  <div className="action-menu">
                    <button className="btn-menu" onClick={() => toggleMenu(user.id)}>
                      ⋯
                    </button>
                    {openMenu === user.id && (
                      <>
                        <div
                          className="menu-backdrop"
                          role="button"
                          tabIndex={0}
                          onClick={() => setOpenMenu(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setOpenMenu(null)}
                        />
                                                <div className="menu-dropdown">
                          <button
                            className="menu-item"
                            onClick={() => handleAction(onChangePassword, user)}
                          >
                            Cambiar contraseña
                          </button>
                          <div className="menu-divider" />
                          <button
                            className="menu-item menu-item-danger"
                            onClick={() => handleAction(onDelete, user)}
                          >
                            Eliminar usuario
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}