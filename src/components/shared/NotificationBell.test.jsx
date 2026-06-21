import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import NotificationBell from "./NotificationBell.jsx";

vi.mock("../../utils/api.js", () => ({
  api: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

import { api } from "../../utils/api.js";

describe("NotificationBell", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra la campana sin badge cuando no hay notificaciones", async () => {
    api.get.mockResolvedValue([]);
    render(<NotificationBell />);
    await waitFor(() => {
      expect(screen.queryByText(/\d+/)).not.toBeInTheDocument();
    });
  });

  it("muestra badge con el número de notificaciones no leídas", async () => {
    api.get.mockResolvedValue([
      { id: 1, message: "Nueva cita", type: "CITA_CREADA", read: false, createdAt: new Date().toISOString() },
      { id: 2, message: "Cita aprobada", type: "CITA_APROBADA", read: true, createdAt: new Date().toISOString() },
    ]);
    render(<NotificationBell />);
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("abre el dropdown al hacer click en la campana", async () => {
    api.get.mockResolvedValue([]);
    render(<NotificationBell />);
    await waitFor(() => {});
    fireEvent.click(document.querySelector(".bell-button"));
    expect(screen.getByText("Notificaciones")).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay notificaciones", async () => {
    api.get.mockResolvedValue([]);
    render(<NotificationBell />);
    fireEvent.click(document.querySelector(".bell-button"));
    await waitFor(() => {
      expect(screen.getByText(/no tienes notificaciones/i)).toBeInTheDocument();
    });
  });

  it("muestra las notificaciones correctamente", async () => {
    api.get.mockResolvedValue([
      { id: 1, message: "Nueva cita asignada", type: "CITA_CREADA", read: false, createdAt: new Date().toISOString() },
    ]);
    render(<NotificationBell />);
    fireEvent.click(document.querySelector(".bell-button"));
    await waitFor(() => {
      expect(screen.getByText("Nueva cita asignada")).toBeInTheDocument();
    });
  });

  it("cierra el dropdown al hacer click fuera", async () => {
    api.get.mockResolvedValue([]);
    render(<NotificationBell />);
    await waitFor(() => {});
    fireEvent.click(document.querySelector(".bell-button"));
    expect(screen.getByText("Notificaciones")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    await waitFor(() => {
      expect(screen.queryByText("Notificaciones")).not.toBeInTheDocument();
    });
  });
});