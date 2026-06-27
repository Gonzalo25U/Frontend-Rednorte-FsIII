import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CancelAppointmentModal from "./CancelAppointmentModal.jsx";

const defaultProps = {
  appointment: { doctorRut: "98765432-1" },
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  loading: false,
  error: null,
};

describe("CancelAppointmentModal", () => {
  it("renderiza el título correctamente", () => {
    render(<CancelAppointmentModal {...defaultProps} />);
    expect(screen.getByText("Cancelar cita")).toBeInTheDocument();
  });

  it("muestra el RUT del doctor", () => {
    render(<CancelAppointmentModal {...defaultProps} />);
    expect(screen.getByText(/98765432-1/)).toBeInTheDocument();
  });

  it("llama a onClose al hacer click en Volver", () => {
    const mockClose = vi.fn();
    render(<CancelAppointmentModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Volver"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en ✕", () => {
    const mockClose = vi.fn();
    render(<CancelAppointmentModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el overlay", () => {
    const mockClose = vi.fn();
    render(<CancelAppointmentModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al presionar Enter en el overlay", () => {
    const mockClose = vi.fn();
    render(<CancelAppointmentModal {...defaultProps} onClose={mockClose} />);
    fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Enter" });
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onSubmit con el motivo ingresado", () => {
    const mockSubmit = vi.fn();
    render(<CancelAppointmentModal {...defaultProps} onSubmit={mockSubmit} />);
    const form = document.querySelector("form");
    Object.defineProperty(form, "reason", { value: { value: "No puedo asistir" }, configurable: true });
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalledWith("No puedo asistir");
  });

  it("muestra error cuando existe", () => {
    render(<CancelAppointmentModal {...defaultProps} error="Error al cancelar" />);
    expect(screen.getByText("Error al cancelar")).toBeInTheDocument();
  });

  it("muestra Cancelando... cuando loading es true", () => {
    render(<CancelAppointmentModal {...defaultProps} loading={true} />);
    expect(screen.getByText("Cancelando...")).toBeInTheDocument();
  });
});