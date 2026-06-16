import { useState } from "react";
import { Upload } from "lucide-react";

export default function AppointmentForm({ onSubmit, loading, error, success, onReset }) {
  const [file, setFile] = useState(null);

  if (success) {
    return (
      <div className="form-success">
        <div className="success-icon">✓</div>
        <p className="success-msg">
          Cita solicitada exitosamente. Se te ha asignado al doctor{" "}
          <strong>{success.doctorName}</strong> ({success.doctorRut}).
        </p>
        <button className="btn-secondary" onClick={onReset}>
          Solicitar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="appointment-form">
      <p className="form-description">
        Al solicitar una cita se te asignará automáticamente el doctor disponible
        con menos citas pendientes.
      </p>

      <div className="field-group">
        <label className="field-label" htmlFor="patientImage">
          Imagen adjunta (opcional)
        </label>
        <label className="file-upload-label" htmlFor="patientImage">
          <Upload size={16} />
          <span>{file ? file.name : "Seleccionar archivo"}</span>
          <input
            id="patientImage"
            type="file"
            accept="image/*,.pdf"
            className="file-upload-input"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </label>
        <p className="field-hint">
          Exámenes previos, documentos u otro antecedente relevante
        </p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button
        className="btn-primary btn-submit"
        disabled={loading}
        onClick={() => onSubmit({ file })}
      >
        {loading ? "Solicitando..." : "Solicitar cita"}
      </button>
    </div>
  );
}