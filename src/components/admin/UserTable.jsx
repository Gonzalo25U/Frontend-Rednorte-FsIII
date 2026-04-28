
export default function UserTable({ users, loading, error }) {
  if (loading) {
    return (
      <div className="table-state">
        <span className="spinner-lg" />
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-state error">
        <p>{error}</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="table-state">
        <p>No hay usuarios registrados.</p>
      </div>
    );
  }

  const roleLabel = {
    ADMIN: "Administrador",
    MEDICO: "Médico",
    PACIENTE: "Paciente",
  };

  const roleClass = {
    ADMIN: "badge badge-admin",
    MEDICO: "badge badge-medico",
    PACIENTE: "badge badge-paciente",
  };

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Estado</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}