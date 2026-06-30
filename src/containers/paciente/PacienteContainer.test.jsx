import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PacienteContainer from "./PacienteContainer";

vi.mock("../../utils/api.js", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("../../utils/auth.js", () => ({
  logout: vi.fn(),
  getToken: vi.fn(() => "mock-token"),
}));

vi.mock("../../components/shared/NotificationBell.jsx", () => ({
  default: () => <div>NotificationBell</div>,
}));

vi.mock("../../components/shared/Logo.jsx", () => ({
  default: () => <div>Logo</div>,
}));

vi.mock("../../components/shared/StatsCard.jsx", () => ({
  default: () => <div>StatsCard</div>,
}));

import { api } from "../../utils/api.js";

const mockPatient = { id: 1, name: "Juan Pérez", rut: "12345678-9", role: "PACIENTE" };
const mockAppointments = [
  {
    id: 1,
    doctorRut: "98765432-1",
    doctorName: "Dr. López",
    status: "PENDIENTE",
    priority: "B",
    dateTime: "2026-01-01T10:00:00",
  },
];

beforeEach(() => {
  vi.resetAllMocks();
  global.fetch = vi.fn();
  api.get.mockImplementation((endpoint) => {
    if (endpoint.includes("/me")) return Promise.resolve(mockPatient);
    if (endpoint.includes("/appointments")) return Promise.resolve(mockAppointments);
    return Promise.resolve([]);
  });
});

describe("PacienteContainer", () => {
  it("renderiza el panel del paciente", async () => {
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(screen.getByText("Mi información")).toBeInTheDocument();
    });
  });

  it("muestra la sección de solicitar cita", async () => {
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(screen.getAllByText("Solicitar cita").length).toBeGreaterThan(0);
    });
  });

  it("muestra la sección de mis citas", async () => {
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(screen.getByText("Mis citas")).toBeInTheDocument();
    });
  });

  it("carga la información del paciente", async () => {
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/paciente/me");
    });
  });

  it("carga las citas del paciente", async () => {
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/paciente/appointments");
    });
  });

  it("actualiza citas al hacer click en Actualizar", async () => {
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Actualizar"));
    fireEvent.click(screen.getByText("Actualizar"));
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/paciente/appointments");
    });
  });

  it("muestra error si falla la carga del paciente", async () => {
    api.get.mockImplementation((endpoint) => {
      if (endpoint.includes("/me")) return Promise.reject(new Error("Error paciente"));
      return Promise.resolve([]);
    });
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(screen.getByText("Error paciente")).toBeInTheDocument();
    });
  });

  it("muestra error si falla la carga de citas", async () => {
    api.get.mockImplementation((endpoint) => {
      if (endpoint.includes("/appointments")) return Promise.reject(new Error("Error citas"));
      return Promise.resolve(mockPatient);
    });
    render(<PacienteContainer />);
    await waitFor(() => {
      expect(screen.getByText("Error citas")).toBeInTheDocument();
    });
  });

  it("solicita una cita sin archivo adjunto", async () => {
    api.post = vi.fn().mockResolvedValue({ id: 99, doctorName: "Dr. Nuevo", doctorRut: "1-1" });
    render(<PacienteContainer />);
    await waitFor(() => screen.getAllByText("Solicitar cita"));
    const submitButton = screen.getByRole("button", { name: "Solicitar cita" });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/bff/paciente/appointments");
    });
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("muestra pantalla de éxito y permite solicitar otra cita", async () => {
    api.post = vi.fn().mockResolvedValue({ id: 99, doctorName: "Dr. Nuevo", doctorRut: "1-1" });
    render(<PacienteContainer />);
    await waitFor(() => screen.getAllByText("Solicitar cita"));
    fireEvent.click(screen.getByRole("button", { name: "Solicitar cita" }));

    await waitFor(() => {
      expect(screen.getByText(/Dr. Nuevo/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/solicitar otra cita/i));
    await waitFor(() => {
      expect(screen.queryByText(/Dr. Nuevo/)).not.toBeInTheDocument();
    });
  });

  it("sube imagen correctamente al crear cita con archivo adjunto", async () => {
    api.post = vi.fn().mockResolvedValue({ id: 99, doctorName: "Dr. Nuevo", doctorRut: "1-1" });
    global.fetch.mockResolvedValue({ ok: true });

    render(<PacienteContainer />);
    await waitFor(() => screen.getAllByText("Solicitar cita"));

    const file = new File(["contenido"], "examen.pdf", { type: "application/pdf" });
    const input = document.querySelector("#patientImage");
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByRole("button", { name: "Solicitar cita" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8085/bff/paciente/appointments/99/upload-image",
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "Bearer mock-token" },
        })
      );
    });
  });

  it("advierte en consola si falla la subida de imagen (res.ok = false)", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    api.post = vi.fn().mockResolvedValue({ id: 99, doctorName: "Dr. Nuevo", doctorRut: "1-1" });
    global.fetch.mockResolvedValue({ ok: false });

    render(<PacienteContainer />);
    await waitFor(() => screen.getAllByText("Solicitar cita"));

    const file = new File(["contenido"], "examen.pdf", { type: "application/pdf" });
    const input = document.querySelector("#patientImage");
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole("button", { name: "Solicitar cita" }));

    await waitFor(() => {
      expect(warnSpy).toHaveBeenCalledWith("Cita creada pero no se pudo subir la imagen");
    });
    warnSpy.mockRestore();
  });

  it("muestra error si falla la creación de la cita", async () => {
    api.post = vi.fn().mockRejectedValue(new Error("Error al solicitar cita"));
    render(<PacienteContainer />);
    await waitFor(() => screen.getAllByText("Solicitar cita"));
    fireEvent.click(screen.getByRole("button", { name: "Solicitar cita" }));
    await waitFor(() => {
      expect(screen.getByText("Error al solicitar cita")).toBeInTheDocument();
    });
  });

  it("abre el modal de cancelar cita al hacer click en Cancelar", async () => {
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Mis citas"));
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => {
      expect(screen.getByText("Cancelar cita")).toBeInTheDocument();
    });
  });

  it("cierra el modal de cancelar cita al hacer click en Volver", async () => {
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Mis citas"));
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => screen.getByText("Cancelar cita"));
    fireEvent.click(screen.getByText("Volver"));
    await waitFor(() => {
      expect(screen.queryByText("Cancelar cita")).not.toBeInTheDocument();
    });
  });

  it("llama a api.put al confirmar la cancelación de una cita", async () => {
    api.put = vi.fn().mockResolvedValue({});
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Mis citas"));
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => screen.getByText("Cancelar cita"));

    const form = document.querySelector("form");
    Object.defineProperty(form, "reason", {
      value: { value: "No puedo asistir por trabajo" },
      configurable: true,
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/bff/paciente/appointments/1/cancel", {
        reason: "No puedo asistir por trabajo",
      });
    });
    expect(screen.queryByText("Cancelar cita")).not.toBeInTheDocument();
  });

  it("muestra error si falla la cancelación de cita y mantiene el modal abierto", async () => {
    api.put = vi.fn().mockRejectedValue(new Error("Error al cancelar cita"));
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Mis citas"));
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => screen.getByText("Cancelar cita"));

    const form = document.querySelector("form");
    Object.defineProperty(form, "reason", {
      value: { value: "No puedo asistir por trabajo" },
      configurable: true,
    });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Error al cancelar cita")).toBeInTheDocument();
    });
    expect(screen.getByText("Cancelar cita")).toBeInTheDocument();
  });
});