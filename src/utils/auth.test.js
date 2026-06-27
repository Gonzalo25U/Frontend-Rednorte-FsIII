import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveToken,
  getToken,
  removeToken,
  isAuthenticated,
  getRole,
  getRut,
  redirectByRole,
  logout,
} from "./auth.js";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock window.location
delete window.location;
window.location = { href: "" };

// JWT válido con role ADMIN, exp en el futuro
const validToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3OC05Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.signature";

// JWT expirado
const expiredToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3OC05Iiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjF9.signature";

beforeEach(() => {
  localStorageMock.clear();
  window.location.href = "";
});

describe("saveToken / getToken / removeToken", () => {
  it("guarda y recupera el token", () => {
    saveToken("mi-token");
    expect(getToken()).toBe("mi-token");
  });

  it("retorna null si no hay token", () => {
    expect(getToken()).toBeNull();
  });

  it("elimina el token correctamente", () => {
    saveToken("mi-token");
    removeToken();
    expect(getToken()).toBeNull();
  });
});

describe("isAuthenticated", () => {
  it("retorna false si no hay token", () => {
    expect(isAuthenticated()).toBe(false);
  });

  it("retorna true con token válido", () => {
    saveToken(validToken);
    expect(isAuthenticated()).toBe(true);
  });

  it("retorna false con token expirado", () => {
    saveToken(expiredToken);
    expect(isAuthenticated()).toBe(false);
  });

  it("retorna false con token malformado", () => {
    saveToken("token-invalido");
    expect(isAuthenticated()).toBe(false);
  });
});

describe("getRole", () => {
  it("retorna null si no hay token", () => {
    expect(getRole()).toBeNull();
  });

  it("retorna el rol del token", () => {
    saveToken(validToken);
    expect(getRole()).toBe("ADMIN");
  });

  it("retorna null con token malformado", () => {
    saveToken("token-invalido");
    expect(getRole()).toBeNull();
  });
});

describe("getRut", () => {
  it("retorna null si no hay token", () => {
    expect(getRut()).toBeNull();
  });

  it("retorna el rut del token", () => {
    saveToken(validToken);
    expect(getRut()).toBe("12345678-9");
  });

  it("retorna null con token malformado", () => {
    saveToken("token-invalido");
    expect(getRut()).toBeNull();
  });
});

describe("redirectByRole", () => {
  it("redirige a /admin/ si el rol es ADMIN", () => {
    saveToken(validToken);
    redirectByRole();
    expect(window.location.href).toBe("/admin/");
  });

  it("redirige a / si no hay token", () => {
    redirectByRole();
    expect(window.location.href).toBe("/");
  });
});

describe("logout", () => {
  it("elimina el token y redirige a /", () => {
    saveToken("mi-token");
    logout();
    expect(getToken()).toBeNull();
    expect(window.location.href).toBe("/");
  });
});