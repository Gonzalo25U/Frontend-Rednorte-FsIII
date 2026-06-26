export default function PriorityModal({ appointment, onSubmit, onClose, loading, error }) {
  const priorities = ["A", "B", "C", "D", "E", "F"];
  const priorityDesc = {
    A: "Urgencia máxima",
    B: "Urgencia alta",
    C: "Urgencia media",
    D: "Urgencia baja",
    E: "Muy baja",
    F: "Sin urgencia",
  };

  return (
    <div className="modal-overlay" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e) => e.key === 'Enter' && onClose()}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Cambiar prioridad</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p className="confirm-message">
            Selecciona la prioridad para la cita del paciente <strong>{appointment.patientRut}</strong>.
          </p>
          <div className="priority-grid">
            {priorities.map((p) => (
              <button
                key={p}
                className={`priority-btn priority-btn-${p.toLowerCase()} ${appointment.priority === p ? "active" : ""}`}
                onClick={() => onSubmit(p)}
                disabled={loading}
              >
                <span className="priority-letter">{p}</span>
                <span className="priority-desc">{priorityDesc[p]}</span>
              </button>
            ))}
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}