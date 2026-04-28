import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "token";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp > now;
  } catch {
    return false;
  }
}

export function getRole() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch {
    return null;
  }
}

export function getRut() {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded.sub;
  } catch {
    return null;
  }
}

export function redirectByRole() {
  const role = getRole();

  switch (role) {
    case "ADMIN":
      window.location.href = "/admin";
      break;
    case "MEDICO":
      window.location.href = "/medico";
      break;
    case "PACIENTE":
      window.location.href = "/paciente";
      break;
    default:
      window.location.href = "/";
  }
}

export function logout() {
  removeToken();
  window.location.href = "/";
}