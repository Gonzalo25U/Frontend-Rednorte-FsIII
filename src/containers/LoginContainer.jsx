import { useState } from "react";
import { login } from "../services/authService";
import { saveToken, redirectByRole } from "../utils/auth";
import LoginForm from "../components/shared/LoginForm";

export default function LoginContainer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(rut, password) {
    setLoading(true);
    setError(null);

    try {
      const token = await login(rut, password);
      saveToken(token);
      redirectByRole();
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginForm
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
    <Footer />
  );
}