import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import DoctorContainer from "./DoctorContainer";

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

vi.mock("../../components/doctor/DoctorAppointmentList.jsx", () => ({
  default: ({ appointments, error, onSetPriority, onMedicalRecord }) => (
    <div>
      {error && <p>{error}</p>}
      {appointments.map((a) => (
        <div key={a.id}>
          <button onClick={() => onSetPriority(a)}>MockOpenPriority-{a.id}</button>
          <button onClick={() => onMedicalRecord(a)}>MockOpenRecord-{a.id}</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../components/doctor/PriorityModal.jsx", () => ({
  default: ({ onSubmit, onClose }) => (
    <div>
      <button onClick={() => onSubmit("A")}>MockSetPriority</button>
      <button onClick={onClose}>MockClosePriority</button>
    </div>
  ),
}));
vi.mock("../../components/doctor/MedicalRecordModal.jsx", () => ({
  default: ({ onSubmit, onClose, error, loading }) => (
    <div>
      {error && <p data-testid="record-error">{error}</p>}
      {loading && <p>RecordLoading</p>}
      <button
        onClick={() =>
          onSubmit({ prescription: "Paracetamol", indications: "Reposo", restDays: 2, file: null })
        }
      >
        MockSaveRecordNoFile
      </button>
      <button
        onClick={() =>
          onSubmit({
            prescription: "X",
            indications: "Y",
            restDays: 1,
            file: new File(["x"], "r.pdf"),
          })
        }
      >
        MockSaveRecordWithFile
      </button>
      <button onClick={onClose}>MockCloseRecord</button>
    </div>
  ),
}));

import { api } from "../../utils/api.js";

const mockDoctor = { id: 1, name: "Dr. López", rut: "98765432-1", role: "DOCTOR" };
const mockAppointments = [
  { id: 1, patientRut: "12345678-9", status: "ATTENDING", priority: "A" },
];

let fetchMock;
let localStorageMock;

beforeEach(() => {
  vi.resetAllMocks();
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  localStorageMock = {
    getItem: vi.fn(() => "mock-token"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  vi.stubGlobal("localStorage", localStorageMock);

  api.get.mockImplementation((endpoint) => {
    if (endpoint.includes("/me")) return Promise.resolve(mockDoctor);
    if (endpoint.includes("/appointments")) return Promise.resolve(mockAppointments);
    return Promise.resolve([]);
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
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

  it("abre y cierra el modal de prioridad", async () => {
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("MockOpenPriority-1"));
    fireEvent.click(screen.getByText("MockOpenPriority-1"));
    await waitFor(() => screen.getByText("MockClosePriority"));
    fireEvent.click(screen.getByText("MockClosePriority"));
    await waitFor(() => {
      expect(screen.queryByText("MockClosePriority")).not.toBeInTheDocument();
    });
  });

  it("actualiza prioridad correctamente", async () => {
    api.put = vi.fn().mockResolvedValue({});
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("MockOpenPriority-1"));
    fireEvent.click(screen.getByText("MockOpenPriority-1"));
    await waitFor(() => screen.getByText("MockSetPriority"));
    fireEvent.click(screen.getByText("MockSetPriority"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/bff/doctor/appointments/1/priority?priority=A");
    });
    expect(screen.queryByText("MockSetPriority")).not.toBeInTheDocument();
  });

  it("muestra error si falla actualizar prioridad", async () => {
    api.put = vi.fn().mockRejectedValue(new Error("Error al actualizar prioridad"));
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("MockOpenPriority-1"));
    fireEvent.click(screen.getByText("MockOpenPriority-1"));
    await waitFor(() => screen.getByText("MockSetPriority"));
    fireEvent.click(screen.getByText("MockSetPriority"));
    await waitFor(() => expect(api.put).toHaveBeenCalled());
  });

  it("abre y cierra el modal de registro médico", async () => {
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("MockOpenRecord-1"));
    fireEvent.click(screen.getByText("MockOpenRecord-1"));
    await waitFor(() => screen.getByText("MockCloseRecord"));
    fireEvent.click(screen.getByText("MockCloseRecord"));
    await waitFor(() => {
      expect(screen.queryByText("MockCloseRecord")).not.toBeInTheDocument();
    });
  });

  it("guarda registro médico sin archivo", async () => {
    api.put = vi.fn().mockResolvedValue({});
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("MockOpenRecord-1"));
    fireEvent.click(screen.getByText("MockOpenRecord-1"));
    await waitFor(() => screen.getByText("MockSaveRecordNoFile"));
    fireEvent.click(screen.getByText("MockSaveRecordNoFile"));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith("/bff/doctor/appointments/1/medical-record", {
        prescription: "Paracetamol",
        indications: "Reposo",
        restDays: 2,
      });
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

it("sube imagen y guarda registro médico exitosamente", async () => {
  fetchMock.mockResolvedValue({ ok: true });
  api.put = vi.fn().mockResolvedValue({});
  render(<DoctorContainer />);
  await waitFor(() => screen.getByText("MockOpenRecord-1"));
  fireEvent.click(screen.getByText("MockOpenRecord-1"));
  await waitFor(() => screen.getByText("MockSaveRecordWithFile"));
  fireEvent.click(screen.getByText("MockSaveRecordWithFile"));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8085/bff/doctor/appointments/1/upload-image",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer mock-token" },
      })
    );
    expect(api.put).toHaveBeenCalled();
  });
});

it("lanza error si falla la subida de imagen (res.ok = false)", async () => {
  fetchMock.mockResolvedValue({
    ok: false,
    json: () => Promise.resolve({ error: "Imagen inválida" }),
  });
  api.put = vi.fn();
  render(<DoctorContainer />);
  await waitFor(() => screen.getByText("MockOpenRecord-1"));
  fireEvent.click(screen.getByText("MockOpenRecord-1"));
  await waitFor(() => screen.getByText("MockSaveRecordWithFile"));
  fireEvent.click(screen.getByText("MockSaveRecordWithFile"));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalled();
  });
  expect(api.put).not.toHaveBeenCalled();
});

  it("muestra error si falla guardar el registro médico (api.put rechaza)", async () => {
    api.put = vi.fn().mockRejectedValue(new Error("Error al guardar registro médico"));
    render(<DoctorContainer />);
    await waitFor(() => screen.getByText("MockOpenRecord-1"));
    fireEvent.click(screen.getByText("MockOpenRecord-1"));
    await waitFor(() => screen.getByText("MockSaveRecordNoFile"));
    fireEvent.click(screen.getByText("MockSaveRecordNoFile"));
    await waitFor(() => expect(api.put).toHaveBeenCalled());
  });
});