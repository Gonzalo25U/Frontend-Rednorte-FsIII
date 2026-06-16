import { useState } from "react";

export default function AppointmentList({ appointments, loading, error, onCancel }) {
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
    return <div className="table-state"><p>No tienes citas registradas.</p></div>;
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

  // Ordenar por fecha descendente (más recientes primero)
  const sorted = [...appointments].sort(
    (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
  );

  const recent = sorted.slice(0, 7);
  const rest = sorted.slice(7);

  return (
    <div className="appointments-wrapper">
      <div className="appointments-list">
        {recent.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} onCancel={onCancel}
            statusClass={statusClass} statusLabel={statusLabel} priorityClass={priorityClass} />
        ))}
      </div>

      {rest.length > 0 && (
        <div className="history-section">
          <button className="btn-secondary history-toggle" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Ocultar historial" : `Ver historial completo (${rest.length} más)`}
          </button>

          {showAll && (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Fecha y hora</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((appt) => (
                    <tr key={appt.id}>
                      <td>
                        <span className="history-doctor">{appt.doctorName || appt.doctorRut}</span>
                        <span className="td-rut">{appt.doctorRut}</span>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appt, onCancel, statusClass, statusLabel, priorityClass }) {
  return (
    <div className="appointment-card">

      {/* Header de la cita */}
      <div className="appt-card-header">
        <div className="appt-card-info">
          <div className="appt-doctor">
            <span className="appt-label">Doctor</span>
            <span className="appt-value">{appt.doctorName || appt.doctorRut}</span>
            <span className="td-rut">{appt.doctorRut}</span>
          </div>
          <div className="appt-date">
            <span className="appt-label">Fecha y hora</span>
            <span className="appt-value">
              {appt.dateTime ? new Date(appt.dateTime).toLocaleString("es-CL") : "—"}
            </span>
          </div>
        </div>
        <div className="appt-card-badges">
          <span className={priorityClass[appt.priority] || "priority"}>
            {appt.priority}
          </span>
          <span className={statusClass[appt.status] || "appt-status"}>
            {statusLabel[appt.status] || appt.status}
          </span>
          {appt.status === "PENDIENTE" && (
            <button className="btn-danger-sm" onClick={() => onCancel(appt)}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Documento adjunto por el paciente - visible en PENDIENTE y CANCELADA */}
      {appt.patientImageUrl && appt.status !== "APROBADA" && (
        <div className="appt-patient-doc">
          <span className="medical-label">Tu documento adjunto</span>
          <a
            href={appt.patientImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="image-link"
          a>
            Ver documento adjunto
          </a>
        </div>
      )}

      {/* Registro médico - solo si está aprobada */}
      {appt.status === "APROBADA" && (
        <div className="appt-medical-record">
          <h4 className="medical-record-title">Registro médico</h4>
          <div className="medical-record-grid">
            {appt.prescription && (
              <div className="medical-field">
                <span className="medical-label">Receta</span>
                <p className="medical-value">{appt.prescription}</p>
              </div>
            )}
            {appt.indications && (
              <div className="medical-field">
                <span className="medical-label">Indicaciones</span>
                <p className="medical-value">{appt.indications}</p>
              </div>
            )}
            {appt.restDays > 0 && (
              <div className="medical-field">
                <span className="medical-label">Días de reposo</span>
                <p className="medical-value">{appt.restDays} días</p>
              </div>
            )}
            {appt.imageUrl && (
              <div className="medical-field medical-field-full">
                <span className="medical-label">Documento adjunto por el médico</span>
                <a
                  href={appt.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-link"
                >
                  Ver documento del médico
                </a>
              </div>
            )}
            {appt.patientImageUrl && (
              <div className="medical-field medical-field-full">
                <span className="medical-label">Tu documento adjunto</span>
                <a
                  href={appt.patientImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="image-link"
                >
                  Ver tu documento adjunto
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}