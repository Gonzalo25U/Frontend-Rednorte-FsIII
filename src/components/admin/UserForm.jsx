export default function UserForm({ onSubmit, onClose, loading, error, createdUser }) {

  if (createdUser) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Usuario creado</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <div className="success-card">
              <div className="success-icon">✓</div>
              <p className="success-msg">El usuario fue registrado exitosamente.</p>
            </div>
            <div className="password-reveal">
              <p className="password-label">Contraseña generada</p>
              <p className="password-value">{createdUser.generatedPassword}</p>
              <p className="password-hint">Entrega esta contraseña al usuario. No se volverá a mostrar.</p>
            </div>
            <div className="created-info">
              <div className="info-row">
                <span className="info-key">Nombre</span>
                <span className="info-val">{createdUser.name}</span>
              </div>
              <div className="info-row">
                <span className="info-key">RUT</span>
                <span className="info-val">{createdUser.rut}</span>
              </div>
              <div className="info-row">
                <span className="info-key">Rol</span>
                <span className="info-val">{createdUser.role}</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Nuevo usuario</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form
          className="modal-body"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              name: e.target.name.value.trim(),
              rut: e.target.rut.value.trim(),
              role: e.target.role.value,
            });
          }}
        >
          <div className="field-group">
            <label className="field-label" htmlFor="name">Nombre completo</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Juan Pérez"
              className="field-input"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="rut">RUT</label>
            <input
              id="rut"
              name="rut"
              type="text"
              placeholder="12345678-9"
              className="field-input"
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="role">Rol</label>
            <select id="role" name="role" className="field-input" required>
              <option value="">Seleccionar rol</option>
              <option value="DOCTOR">Doctor</option>
              <option value="PACIENTE">Paciente</option>
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creando..." : "Crear usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}