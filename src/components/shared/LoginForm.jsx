import { useState } from "react";
import Logo from "./Logo.jsx";

export default function LoginForm({ onSubmit, loading, error }) {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!rut.trim() || !password) return;
    onSubmit(rut.trim(), password);
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-mark">
            <Logo size="md" variant="default" />
          </div>
          <p className="login-subtitle">Sistema de Gestión Médica</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label className="field-label" htmlFor="rut">RUT</label>
            <input
              id="rut"
              name="rut"
              type="text"
              placeholder="12345678-9"
              className="field-input"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>

          <div className="field-group">
            <label className="field-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••"
              className="field-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              "Ingresar al sistema"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
