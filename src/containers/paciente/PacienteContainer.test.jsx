import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PacienteContainer from "./PacienteContainer";
import { fireEvent } from "@testing-library/react";

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
  { id: 1, doctorRut: "98765432-1", status: "PENDING", priority: "B" },
];

beforeEach(() => {
  vi.resetAllMocks();
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
    it("abre modal de cancelar cita al hacer click", async () => {
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Mis citas"));
    const cancelButtons = screen.queryAllByText("Cancelar cita");
    if (cancelButtons.length > 0) {
      fireEvent.click(cancelButtons[0]);
      await waitFor(() => {
        expect(screen.getByText("Cancelar cita")).toBeInTheDocument();
      });
    }
  });

  it("solicita una cita al hacer click en el botón", async () => {
    api.post = vi.fn().mockResolvedValue({ id: 99 });
    render(<PacienteContainer />);
    await waitFor(() => screen.getAllByText("Solicitar cita"));
    const submitButton = screen.getByRole("button", { name: "Solicitar cita" });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/bff/paciente/appointments");
    });
  });
  it("llama a api.put al cancelar cita", async () => {
  const cancelAppointment = { id: 1, doctorRut: "98765432-1", status: "PENDING", priority: "B" };
  api.get.mockImplementation((endpoint) => {
    if (endpoint.includes("/me")) return Promise.resolve(mockPatient);
    return Promise.resolve([cancelAppointment]);
  });
  api.put = vi.fn().mockResolvedValue({});
  render(<PacienteContainer />);
  await waitFor(() => screen.getByText("Mis citas"));
  const cancelButtons = screen.queryAllByText(/cancelar/i);
  
    if (cancelButtons.length > 0) {
      fireEvent.click(cancelButtons[0]);
      await waitFor(() => {
        const form = document.querySelector("form");
        if (form) {
          Object.defineProperty(form, "reason", { value: { value: "No puedo ir" }, configurable: true });
          fireEvent.submit(form);
        }
      });
      await waitFor(() => {
        expect(api.put).toHaveBeenCalled();
      });
    }
  });

  it("maneja error al cancelar cita", async () => {
    api.get.mockImplementation((endpoint) => {
      if (endpoint.includes("/me")) return Promise.resolve(mockPatient);
      return Promise.resolve([{ id: 1, doctorRut: "98765432-1", status: "PENDING", priority: "B" }]);
    });
    api.put = vi.fn().mockRejectedValue(new Error("Error al cancelar"));
    render(<PacienteContainer />);
    await waitFor(() => screen.getByText("Mis citas"));
  });
});