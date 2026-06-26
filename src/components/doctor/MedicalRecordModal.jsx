import { Upload } from "lucide-react";

export default function MedicalRecordModal({ appointment, onSubmit, onClose, loading, error }) {
  return (
    <div className="modal-overlay" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e) => e.key === 'Enter' && onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Registro médico</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form
          className="modal-body"
          onSubmit={(e) => {
            e.preventDefault();
            const file = e.target.image.files[0] || null;
            onSubmit({
              prescription: e.target.prescription.value.trim(),
              indications: e.target.indications.value.trim(),
              restDays: parseInt(e.target.restDays.value) || 0,
              file,
            });
          }}
        >
          <p className="confirm-message">
            Paciente: <strong>{appointment.patientRut}</strong>
          </p>
          <div className="field-group">
            <label className="field-label" htmlFor="prescription">Receta médica</label>
            <textarea id="prescription" name="prescription" className="field-input field-textarea" placeholder="Medicamentos recetados..." rows={3} defaultValue={appointment.prescription || ""} />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="indications">Indicaciones</label>
            <textarea id="indications" name="indications" className="field-input field-textarea" placeholder="Indicaciones para el paciente..." rows={3} defaultValue={appointment.indications || ""} />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="restDays">Días de reposo</label>
            <input id="restDays" name="restDays" type="number" min="0" className="field-input" placeholder="0" defaultValue={appointment.restDays || 0} />
          </div>
          <div className="field-group">
            <label className="field-label" htmlFor="image">Imagen adjunta (opcional)</label>
            <label className="file-upload-label" htmlFor="image">
              <Upload size={16} />
              <span>Seleccionar archivo</span>
              <input id="image" name="image" type="file" accept="image/*,.pdf" className="file-upload-input" />
            </label>
            <p className="field-hint">Foto de receta, examen u otro documento relacionado</p>
          </div>
          {appointment.imageUrl && (
            <div className="current-image">
              <p className="field-label">Imagen actual</p>
              <a href={appointment.imageUrl} target="_blank" rel="noopener noreferrer" className="image-link">Ver imagen adjunta</a>
            </div>
          )}
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