export default function PatientInfo({ patient, loading, error }) {
  if (loading) {
    return (
      <div className="info-state">
        <span className="spinner-lg" />
        <p>Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return <div className="info-state error"><p>{error}</p></div>;
  }

  if (!patient) return null;

  const roleLabel = { ADMIN: "Administrador", DOCTOR: "Doctor", PACIENTE: "Paciente" };

  return (
    <div className="info-card">
      <div className="info-avatar">
        {patient.name?.charAt(0).toUpperCase()}
      </div>
      <div className="info-details">
        <h2 className="info-name">{patient.name}</h2>
        <div className="info-rows">
          <div className="info-row">
            <span className="info-key">RUT</span>
            <span className="info-val td-rut">{patient.rut}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Rol</span>
            <span className="info-val">
              <span className="badge badge-paciente">
                {roleLabel[patient.role] || patient.role}
              </span>
            </span>
          </div>
          <div className="info-row">
            <span className="info-key">Estado</span>
            <span className={`status ${patient.active ? "active" : "inactive"}`}>
              {patient.active ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}