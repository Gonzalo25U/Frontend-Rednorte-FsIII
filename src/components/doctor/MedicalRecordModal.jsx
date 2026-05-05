export default function MedicalRecordModal({ appointment, onSubmit, onClose, loading, error }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Registro médico</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form
          className="modal-body"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              prescription: e.target.prescription.value.trim(),
              indications: e.target.indications.value.trim(),
              restDays: parseInt(e.target.restDays.value) || 0,
            });
          }}
        >
          <p className="confirm-message">
            Paciente: <strong>{appointment.patientRut}</strong>
          </p>

          <div className="field-group">
            <label className="field-label" htmlFor="prescription">Receta médica</label>
            <textarea
              id="prescription"
              name="prescription"
              className="field-input field-textarea"
              placeholder="Medicamentos recetados..."
              rows={3}
              defaultValue={appointment.prescription || ""}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="indications">Indicaciones</label>
            <textarea
              id="indications"
              name="indications"
              className="field-input field-textarea"
              placeholder="Indicaciones para el paciente..."
              rows={3}
              defaultValue={appointment.indications || ""}
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="restDays">Días de reposo</label>
            <input
              id="restDays"
              name="restDays"
              type="number"
              min="0"
              className="field-input"
              placeholder="0"
              defaultValue={appointment.restDays || 0}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar y dar de alta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}