import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DoctorContainer from "./DoctorContainer";
import { fireEvent } from "@testing-library/react";

vi.mock("../../utils/api.js", () => ({
  api: {
    get: vi.fn(),
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

const mockDoctor = { id: 1, name: "Dr. López", rut: "98765432-1", role: "DOCTOR" };
const mockAppointments = [
  { id: 1, patientRut: "12345678-9", status: "ATTENDING", priority: "A" },
];

beforeEach(() => {
  vi.resetAllMocks();
  api.get.mockImplementation((endpoint) => {
    if (endpoint.includes("/me")) return Promise.resolve(mockDoctor);
    if (endpoint.includes("/appointments")) return Promise.resolve(mockAppointments);
    return Promise.resolve([]);
  });
});

describe("DoctorContainer", () => {
  it("renderiza el panel del doctor", async () => {
    render(<DoctorContainer />);
    await waitFor(() => {
      expect(screen.getByText("Mi información")).toBeInTheDocument();
    });
  });

  it("muestra la sección de citas asignadas", async () => {
    render(<DoctorContainer />);
    await waitFor(() => {
      expect(screen.getByText("Citas asignadas")).toBeInTheDocument();
    });
  });

  it("carga la información del doctor", async () => {
    render(<DoctorContainer />);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/doctor/me");
    });
  });

  it("carga las citas del doctor", async () => {
    render(<DoctorContainer />);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/doctor/appointments");
    });
  });
  it("abre modal de prioridad al hacer click en botón", async () => {
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("Citas asignadas"));
    const menuButtons = screen.getAllByText("⋯");
    fireEvent.click(menuButtons[0]);
    await waitFor(() => screen.getByText("Cambiar prioridad"));
    fireEvent.click(screen.getByText("Cambiar prioridad"));
    await waitFor(() => {
      expect(screen.getByText("Cambiar prioridad")).toBeInTheDocument();
    });
  });;

  it("actualiza citas al hacer click en Actualizar", async () => {
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("Actualizar"));
    fireEvent.click(screen.getByText("Actualizar"));
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/doctor/appointments");
    });
  });

  it("muestra error si falla la carga del doctor", async () => {
    api.get.mockImplementation((endpoint) => {
      if (endpoint.includes("/me")) return Promise.reject(new Error("Error de red"));
      return Promise.resolve([]);
    });
    render(<DoctorContainer />);
    await waitFor(() => {
      expect(screen.getByText("Error de red")).toBeInTheDocument();
    });
  });
  it("abre modal de registro médico al hacer click", async () => {
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("Citas asignadas"));
    const menuButtons = screen.getAllByText("⋯");
    fireEvent.click(menuButtons[0]);
    await waitFor(() => {
      const items = screen.getAllByRole("button");
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("muestra error si falla la carga de citas", async () => {
    api.get.mockImplementation((endpoint) => {
      if (endpoint.includes("/appointments")) return Promise.reject(new Error("Error citas doctor"));
      return Promise.resolve(mockDoctor);
    });
    render(<DoctorContainer />);
    await waitFor(() => {
      expect(screen.getByText("Error citas doctor")).toBeInTheDocument();
    });
  });
  it("llama a api.put al cambiar prioridad", async () => {
    api.put = vi.fn().mockResolvedValue({});
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("Citas asignadas"));
    const menuButtons = screen.getAllByText("⋯");
    fireEvent.click(menuButtons[0]);
    await waitFor(() => screen.getByText("Cambiar prioridad"));
    fireEvent.click(screen.getByText("Cambiar prioridad"));
    await waitFor(() => screen.getByText("Urgencia alta"));
    fireEvent.click(screen.getByText("Urgencia alta"));
    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });
  });
  });