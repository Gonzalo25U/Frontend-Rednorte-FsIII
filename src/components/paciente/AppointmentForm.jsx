export default function AppointmentForm({ onSubmit, loading, error, success, onReset }) {
  if (success) {
    return (
      <div className="form-success">
        <div className="success-icon">✓</div>
        <p className="success-msg">
          Cita solicitada exitosamente. Se te ha asignado al doctor <strong>{success.doctorName}</strong> ({success.doctorRut}).
        </p>
        <button className="btn-secondary" onClick={onReset}>
          Solicitar otra cita
        </button>
      </div>
    );
  }

  return (
    <form
      className="appointment-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <p className="confirm-message">
        Al solicitar una cita se te asignará automáticamente el doctor disponible con menos citas pendientes.
      </p>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Solicitando..." : "Solicitar cita"}
      </button>
    </form>
  );
}