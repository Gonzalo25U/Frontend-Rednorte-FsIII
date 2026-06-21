const BASE_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:8085";

export async function login(rut, password) {
  const response = await fetch(`${BASE_URL}/bff/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rut, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Credenciales inválidas");
  }

  const data = await response.json();
  return data.token;
}