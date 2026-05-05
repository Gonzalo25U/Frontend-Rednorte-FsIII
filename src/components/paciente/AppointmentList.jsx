export default function AppointmentList({ appointments, loading, error, onCancel }) {
  if (loading) {
    return (
      <div className="table-state">
        <span className="spinner-lg" />
        <p>Cargando citas...</p>
      </div>
    );
  }

  if (error) {
    return <div className="table-state error"><p>{error}</p></div>;
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="table-state">
        <p>No tienes citas registradas.</p>
      </div>
    );
  }

  const statusClass = {
    PENDIENTE: "appt-status pendiente",
    APROBADA: "appt-status aprobada",
    CANCELADA: "appt-status cancelada",
  };

  const statusLabel = {
    PENDIENTE: "Pendiente",
    APROBADA: "Aprobada",
    CANCELADA: "Cancelada",
  };

  const priorityClass = {
    A: "priority priority-a",
    B: "priority priority-b",
    C: "priority priority-c",
    D: "priority priority-d",
    E: "priority priority-e",
    F: "priority priority-f",
  };

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Fecha y hora</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td className="td-rut">{appt.doctorRut}</td>
              <td>{appt.dateTime
                ? new Date(appt.dateTime).toLocaleString("es-CL")
                : "—"}
              </td>
              <td>
                <span className={priorityClass[appt.priority] || "priority"}>
                  {appt.priority}
                </span>
              </td>
              <td>
                <span className={statusClass[appt.status] || "appt-status"}>
                  {statusLabel[appt.status] || appt.status}
                </span>
              </td>
              <td>
                {appt.status === "PENDIENTE" && (
                  <button
                    className="btn-danger-sm"
                    onClick={() => onCancel(appt)}
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}