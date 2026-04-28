
export default function LoginForm({ onSubmit, loading, error }) {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-mark">
            <span className="logo-cross">✚</span>
          </div>
          <h1 className="login-title">RedNorte</h1>
          <p className="login-subtitle">Sistema de Gestión Médica</p>
        </div>

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            const rut = e.target.rut.value.trim();
            const password = e.target.password.value;
            onSubmit(rut, password);
          }}
        >
          <div className="field-group">
            <label className="field-label" htmlFor="rut">
              RUT
            </label>
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
            <label className="field-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••"
              className="field-input"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Ingresando...
              </span>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}