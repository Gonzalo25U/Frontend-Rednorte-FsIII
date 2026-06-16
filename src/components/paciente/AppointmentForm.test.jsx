import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppointmentForm from "./AppointmentForm.jsx";

describe("AppointmentForm", () => {

  it("renderiza el formulario correctamente", () => {
    render(<AppointmentForm onSubmit={vi.fn()} loading={false} error={null} success={null} onReset={vi.fn()} />);
    expect(screen.getByText(/solicitar cita/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/imagen adjunta/i)).toBeInTheDocument();
  });

  it("muestra error cuando hay un error", () => {
    render(<AppointmentForm onSubmit={vi.fn()} loading={false} error="Error al solicitar" success={null} onReset={vi.fn()} />);
    expect(screen.getByText("Error al solicitar")).toBeInTheDocument();
  });

  it("muestra spinner cuando loading es true", () => {
    render(<AppointmentForm onSubmit={vi.fn()} loading={true} error={null} success={null} onReset={vi.fn()} />);
    expect(screen.getByText(/solicitando/i)).toBeInTheDocument();
  });

  it("deshabilita el botón cuando loading es true", () => {
    render(<AppointmentForm onSubmit={vi.fn()} loading={true} error={null} success={null} onReset={vi.fn()} />);
    expect(screen.getByRole("button", { name: /solicitando/i })).toBeDisabled();
  });

  it("llama a onSubmit al hacer click en el botón", () => {
    const mockSubmit = vi.fn();
    render(<AppointmentForm onSubmit={mockSubmit} loading={false} error={null} success={null} onReset={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /solicitar cita/i }));
    expect(mockSubmit).toHaveBeenCalledWith({ file: null });
  });

  it("muestra pantalla de éxito cuando success tiene datos", () => {
    const success = { doctorName: "Dr. Test", doctorRut: "77777777-7" };
    render(<AppointmentForm onSubmit={vi.fn()} loading={false} error={null} success={success} onReset={vi.fn()} />);
    expect(screen.getByText(/Dr. Test/)).toBeInTheDocument();
    expect(screen.getByText(/solicitar otra cita/i)).toBeInTheDocument();
  });

  it("llama a onReset al hacer click en solicitar otra cita", () => {
    const mockReset = vi.fn();
    const success = { doctorName: "Dr. Test", doctorRut: "77777777-7" };
    render(<AppointmentForm onSubmit={vi.fn()} loading={false} error={null} success={success} onReset={mockReset} />);
    fireEvent.click(screen.getByText(/solicitar otra cita/i));
    expect(mockReset).toHaveBeenCalled();
  });
});