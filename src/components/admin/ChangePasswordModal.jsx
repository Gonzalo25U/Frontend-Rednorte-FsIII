export default function ChangePasswordModal({ user, onSubmit, onClose, loading, error, success }) {

  if (success) {
    return (
      <div className="modal-overlay" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e) => e.key === 'Enter' && onClose()}>
        <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Contraseña actualizada</h2>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
          <div className="modal-body">
            <div className="success-card">
              <div className="success-icon">✓</div>
              <p className="success-msg">La contraseña fue actualizada exitosamente.</p>
            </div>
            <div className="password-reveal">
              <p className="password-label">Nueva contraseña</p>
              <p className="password-value">{success}</p>
              <p className="password-hint">Entrega esta contraseña al usuario.</p>
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
    <div className="modal-overlay" role="button" tabIndex={0} onClick={onClose} onKeyDown={(e) => e.key === 'Enter' && onClose()}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Cambiar contraseña</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form
          className="modal-body"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(e.target.password.value.trim());
          }}
        >
          <p className="confirm-message">
            Ingresa la nueva contraseña para <strong>{user.name}</strong>.
          </p>
          <div className="field-group">
            <label className="field-label" htmlFor="password">Nueva contraseña</label>
            <input
              id="password"
              name="password"
              type="text"
              placeholder="ej: T22o"
              className="field-input"
              maxLength={20}
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}