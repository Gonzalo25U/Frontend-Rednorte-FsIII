export default function AppointmentForm({ onSubmit, loading, error, success, onReset }) {
  if (success) {
    return (
      <div className="form-success">
        <div className="success-icon">✓</div>
        <p className="success-msg">Cita solicitada exitosamente.</p>
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
        onSubmit({
          doctorRut: e.target.doctorRut.value.trim(),
        });
      }}
    >
      <div className="field-group">
        <label className="field-label" htmlFor="doctorRut">RUT del Doctor</label>
        <input
          id="doctorRut"
          name="doctorRut"
          type="text"
          placeholder="12345678-9"
          className="field-input"
          required
        />
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Solicitando..." : "Solicitar cita"}
      </button>
    </form>
  );
}