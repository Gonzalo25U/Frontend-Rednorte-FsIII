import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PatientInfo from "./PatientInfo.jsx";

const mockPatient = {
  name: "Juan Pérez",
  rut: "12345678-9",
  role: "PACIENTE",
  active: true,
};

describe("PatientInfo", () => {

  it("muestra spinner cuando loading es true", () => {
    render(<PatientInfo patient={null} loading={true} error={null} />);
    expect(screen.getByText(/cargando información/i)).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando hay un error", () => {
    render(<PatientInfo patient={null} loading={false} error="Error al cargar" />);
    expect(screen.getByText("Error al cargar")).toBeInTheDocument();
  });

  it("no renderiza nada si patient es null", () => {
    const { container } = render(<PatientInfo patient={null} loading={false} error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("muestra el nombre del paciente", () => {
    render(<PatientInfo patient={mockPatient} loading={false} error={null} />);
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("muestra la inicial del nombre en el avatar", () => {
    render(<PatientInfo patient={mockPatient} loading={false} error={null} />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("muestra el RUT correctamente", () => {
    render(<PatientInfo patient={mockPatient} loading={false} error={null} />);
    expect(screen.getByText("12345678-9")).toBeInTheDocument();
  });

  it("muestra el label de rol correcto para PACIENTE", () => {
    render(<PatientInfo patient={mockPatient} loading={false} error={null} />);
    expect(screen.getByText("Paciente")).toBeInTheDocument();
  });

  it("muestra el label de rol correcto para DOCTOR", () => {
    render(<PatientInfo patient={{ ...mockPatient, role: "DOCTOR" }} loading={false} error={null} />);
    expect(screen.getByText("Doctor")).toBeInTheDocument();
  });

  it("muestra estado Activo cuando active es true", () => {
    render(<PatientInfo patient={mockPatient} loading={false} error={null} />);
    expect(screen.getByText("Activo")).toBeInTheDocument();
  });

  it("muestra estado Inactivo cuando active es false", () => {
    render(<PatientInfo patient={{ ...mockPatient, active: false }} loading={false} error={null} />);
    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });
});