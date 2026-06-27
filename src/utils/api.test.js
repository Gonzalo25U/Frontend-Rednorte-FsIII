import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "./api.js";

// Mock auth
vi.mock("./auth.js", () => ({
  getToken: vi.fn(() => "mock-token"),
  logout: vi.fn(),
}));

import { getToken, logout } from "./auth.js";

beforeEach(() => {
  vi.resetAllMocks();
  getToken.mockReturnValue("mock-token");
});

function mockFetch(status, body, contentType = "application/json") {
  global.fetch = vi.fn().mockResolvedValue({
    status,
    ok: status >= 200 && status < 300,
    headers: { get: () => contentType },
    json: async () => body,
    text: async () => (typeof body === "string" ? body : JSON.stringify(body)),
  });
}

describe("api.get", () => {
  it("hace GET y retorna JSON", async () => {
    mockFetch(200, { data: "ok" });
    const result = await api.get("/test");
    expect(result).toEqual({ data: "ok" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({ method: "GET" })
    );
  });

  it("incluye Authorization header cuando hay token", async () => {
    mockFetch(200, {});
    await api.get("/test");
    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBe("Bearer mock-token");
  });

  it("no incluye Authorization si no hay token", async () => {
    getToken.mockReturnValue(null);
    mockFetch(200, {});
    await api.get("/test");
    const headers = fetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it("llama logout si responde 401", async () => {
    mockFetch(401, {});
    await api.get("/test");
    expect(logout).toHaveBeenCalled();
  });

  it("lanza error si responde 403", async () => {
    mockFetch(403, {});
    await expect(api.get("/test")).rejects.toThrow("No tienes permisos");
  });

  it("lanza error si responde 500", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      ok: false,
      headers: { get: () => "text/plain" },
      text: async () => "Internal Server Error",
    });
    await expect(api.get("/test")).rejects.toThrow("Internal Server Error");
  });

  it("retorna texto si content-type no es JSON", async () => {
    mockFetch(200, "texto plano", "text/plain");
    const result = await api.get("/test");
    expect(result).toBe("texto plano");
  });
});

describe("api.post", () => {
  it("hace POST con body JSON", async () => {
    mockFetch(200, { id: 1 });
    const result = await api.post("/test", { name: "test" });
    expect(result).toEqual({ id: 1 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "test" }),
      })
    );
  });
});

describe("api.put", () => {
  it("hace PUT con body JSON", async () => {
    mockFetch(200, { updated: true });
    const result = await api.put("/test/1", { name: "nuevo" });
    expect(result).toEqual({ updated: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test/1"),
      expect.objectContaining({ method: "PUT" })
    );
  });
});

describe("api.delete", () => {
  it("hace DELETE correctamente", async () => {
    mockFetch(200, { deleted: true });
    const result = await api.delete("/test/1");
    expect(result).toEqual({ deleted: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/test/1"),
      expect.objectContaining({ method: "DELETE" })
    );
  });
});