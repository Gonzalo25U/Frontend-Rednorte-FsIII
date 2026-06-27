import { describe, it, expect, vi, beforeEach } from "vitest";
import { login } from "./authService.js";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("login", () => {
  it("retorna el token si las credenciales son correctas", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ token: "mi-jwt-token" }),
    });

    const token = await login("12345678-9", "password123");
    expect(token).toBe("mi-jwt-token");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bff/auth/login"),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rut: "12345678-9", password: "password123" }),
      })
    );
  });

  it("lanza error con mensaje del servidor si las credenciales son incorrectas", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Credenciales inválidas" }),
    });

    await expect(login("00000000-0", "wrong")).rejects.toThrow("Credenciales inválidas");
  });

  it("lanza error genérico si el servidor no devuelve JSON", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => { throw new Error("not json"); },
    });

    await expect(login("00000000-0", "wrong")).rejects.toThrow("Credenciales inválidas");
  });

  it("lanza error si fetch falla completamente", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    await expect(login("12345678-9", "password123")).rejects.toThrow("Network error");
  });
});