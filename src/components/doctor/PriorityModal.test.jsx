import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PriorityModal from "./PriorityModal.jsx";

const mockAppointment = {
  id: 1,
  patientRut: "12345678-9",
  doctorRut: "77777777-7",
  priority: "C",
  status: "PENDIENTE",
};

describe("PriorityModal", () => {

  it("renderiza el título correctamente", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={false} error={null} />);
    expect(screen.getByText("Cambiar prioridad")).toBeInTheDocument();
  });

  it("muestra el RUT del paciente", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={false} error={null} />);
    expect(screen.getByText("12345678-9")).toBeInTheDocument();
  });

  it("renderiza los 6 botones de prioridad", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={false} error={null} />);
    const priorities = ["A", "B", "C", "D", "E", "F"];
    priorities.forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });

  it("muestra las descripciones de prioridad", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={false} error={null} />);
    expect(screen.getByText("Urgencia máxima")).toBeInTheDocument();
    expect(screen.getByText("Sin urgencia")).toBeInTheDocument();
  });

  it("marca como active la prioridad actual del appointment", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={false} error={null} />);
    const btnC = screen.getByText("C").closest("button");
    expect(btnC).toHaveClass("active");
  });

  it("llama a onSubmit con la prioridad correcta al hacer click", () => {
    const mockSubmit = vi.fn();
    render(<PriorityModal appointment={mockAppointment} onSubmit={mockSubmit} onClose={vi.fn()} loading={false} error={null} />);
    fireEvent.click(screen.getByText("A").closest("button"));
    expect(mockSubmit).toHaveBeenCalledWith("A");
  });

  it("deshabilita todos los botones cuando loading es true", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={true} error={null} />);
    const priorities = ["A", "B", "C", "D", "E", "F"];
    priorities.forEach((p) => {
      expect(screen.getByText(p).closest("button")).toBeDisabled();
    });
  });

  it("muestra error cuando hay un error", () => {
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={vi.fn()} loading={false} error="Error al actualizar" />);
    expect(screen.getByText("Error al actualizar")).toBeInTheDocument();
  });

  it("llama a onClose al hacer click en Cancelar", () => {
    const mockClose = vi.fn();
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={mockClose} loading={false} error={null} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el botón ✕", () => {
    const mockClose = vi.fn();
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={mockClose} loading={false} error={null} />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el overlay", () => {
    const mockClose = vi.fn();
    render(<PriorityModal appointment={mockAppointment} onSubmit={vi.fn()} onClose={mockClose} loading={false} error={null} />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockClose).toHaveBeenCalled();
  });
});