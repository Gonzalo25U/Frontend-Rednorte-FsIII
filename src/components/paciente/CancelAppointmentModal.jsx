export default function CancelAppointmentModal({ appointment, onSubmit, onClose, loading, error }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Cancelar cita</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form
          className="modal-body"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.target.reason.value.trim());
          }}
        >
          <p className="confirm-message">
            Indica el motivo de cancelación de tu cita con el doctor <strong>{appointment.doctorRut}</strong>.
          </p>

          <div className="field-group">
            <label className="field-label" htmlFor="reason">Motivo</label>
            <textarea
              id="reason"
              name="reason"
              className="field-input field-textarea"
              placeholder="Describe el motivo de cancelación..."
              rows={3}
              required
              minLength={10}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Volver
            </button>
            <button type="submit" className="btn-danger" disabled={loading}>
              {loading ? "Cancelando..." : "Confirmar cancelación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}