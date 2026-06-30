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
  it("registra el error en consola si falla la carga de notificaciones", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  api.get.mockRejectedValue(new Error("fallo red"));
  render(<NotificationBell />);
  await waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith("Error al cargar notificaciones", expect.any(Error));
  });
  errorSpy.mockRestore();
});

it("marca una notificación como leída al hacer click en el check", async () => {
  api.get.mockResolvedValue([
    { id: 1, message: "Nueva cita", type: "CITA_CREADA", read: false, createdAt: new Date().toISOString() },
  ]);
  api.put.mockResolvedValue({});
  render(<NotificationBell />);
  await waitFor(() => expect(api.get).toHaveBeenCalled());
  fireEvent.click(document.querySelector(".bell-button"));
  await waitFor(() => screen.getByText("Nueva cita"));

  const checkButton = document.querySelector(".bell-item-check");
  fireEvent.click(checkButton);

  await waitFor(() => {
    expect(api.put).toHaveBeenCalledWith("/bff/notifications/1/read");
  });
});

it("actualiza el estado local de la notificación tras marcarla como leída", async () => {
  api.get.mockResolvedValue([
    { id: 1, message: "Nueva cita", type: "CITA_CREADA", read: false, createdAt: new Date().toISOString() },
  ]);
  api.put.mockResolvedValue({});
  render(<NotificationBell />);
  await waitFor(() => expect(api.get).toHaveBeenCalled());
  fireEvent.click(document.querySelector(".bell-button"));
  await waitFor(() => screen.getByText("Nueva cita"));

  fireEvent.click(document.querySelector(".bell-item-check"));

  await waitFor(() => {
    expect(document.querySelector(".bell-item").className).toContain("read");
    expect(document.querySelector(".bell-item-check")).not.toBeInTheDocument();
  });
});

it("registra el error en consola si falla marcar como leída", async () => {
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  api.get.mockResolvedValue([
    { id: 1, message: "Nueva cita", type: "CITA_CREADA", read: false, createdAt: new Date().toISOString() },
  ]);
  api.put.mockRejectedValue(new Error("fallo"));
  render(<NotificationBell />);
  await waitFor(() => expect(api.get).toHaveBeenCalled());
  fireEvent.click(document.querySelector(".bell-button"));
  await waitFor(() => screen.getByText("Nueva cita"));

  fireEvent.click(document.querySelector(".bell-item-check"));

  await waitFor(() => {
    expect(errorSpy).toHaveBeenCalledWith("Error al marcar notificación", expect.any(Error));
  });
  errorSpy.mockRestore();
});

it("no muestra el botón de marcar como leída en notificaciones ya leídas", async () => {
  api.get.mockResolvedValue([
    { id: 1, message: "Cita aprobada", type: "CITA_APROBADA", read: true, createdAt: new Date().toISOString() },
  ]);
  render(<NotificationBell />);
  await waitFor(() => expect(api.get).toHaveBeenCalled());
  fireEvent.click(document.querySelector(".bell-button"));
  await waitFor(() => screen.getByText("Cita aprobada"));
  expect(document.querySelector(".bell-item-check")).not.toBeInTheDocument();
});

it("limpia el listener de click-fuera y el intervalo al desmontar", async () => {
  vi.useFakeTimers();
  api.get.mockResolvedValue([]);
  const { unmount } = render(<NotificationBell />);
  await vi.waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));
  unmount();
  vi.advanceTimersByTime(10000);
  expect(api.get).toHaveBeenCalledTimes(1);
  vi.useRealTimers();
});
});