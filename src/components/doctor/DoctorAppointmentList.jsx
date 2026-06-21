import { useState } from "react";

export default function DoctorAppointmentList({ appointments, loading, error, onSetPriority, onMedicalRecord }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="table-state">
        <span className="spinner-lg" />
        <p>Cargando citas...</p>
      </div>
    );
  }

  if (error) return <div className="table-state error"><p>{error}</p></div>;

  if (!appointments || appointments.length === 0) {
    return <div className="table-state"><p>No tienes citas asignadas.</p></div>;
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
    A: "priority priority-a", B: "priority priority-b",
    C: "priority priority-c", D: "priority priority-d",
    E: "priority priority-e", F: "priority priority-f",
  };

  function toggleMenu(id) {
    setOpenMenu(openMenu === id ? null : id);
  }

  function handleAction(action, appt) {
    setOpenMenu(null);
    action(appt);
  }

  // Ordenar por fecha descendente (más recientes primero)
  const sorted = [...appointments].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );

  const visible = showAll ? sorted : sorted.slice(0, 7);
  const restCount = sorted.length - 7;

  return (
    <div className="table-wrapper">
      <table className="user-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Fecha y hora</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((appt) => (
            <tr key={appt.id}>
              <td className="td-rut">{appt.patientRut}</td>
              <td>{appt.dateTime ? new Date(appt.dateTime).toLocaleString("es-CL") : "—"}</td>
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
              <td className="td-actions">
                {appt.status !== "CANCELADA" && (
                  <div className="action-menu">
                    <button className="btn-menu" onClick={() => toggleMenu(appt.id)}>⋯</button>
                    {openMenu === appt.id && (
                      <>
                        <div className="menu-backdrop" onClick={() => setOpenMenu(null)} />
                        <div className="menu-dropdown">
                          <button className="menu-item" onClick={() => handleAction(onSetPriority, appt)}>
                            Cambiar prioridad
                          </button>
                          {appt.status === "PENDIENTE" && (
                            <>
                              <div className="menu-divider" />
                              <button className="menu-item" onClick={() => handleAction(onMedicalRecord, appt)}>
                                Registrar y dar de alta
                              </button>
                            </>
                          )}
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

      {restCount > 0 && (
        <div className="history-section">
          <button className="btn-secondary history-toggle" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Mostrar solo recientes" : `Ver historial completo (${restCount} más)`}
          </button>
        </div>
      )}
    </div>
  );
}