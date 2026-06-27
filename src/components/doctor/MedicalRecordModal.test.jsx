import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MedicalRecordModal from "./MedicalRecordModal.jsx";

const defaultProps = {
  appointment: { 
    patientRut: "12345678-9",
    prescription: "",
    indications: "",
    restDays: 0,
    imageUrl: null
  },
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  loading: false,
  error: null,
};

describe("MedicalRecordModal", () => {
  it("renderiza el título correctamente", () => {
    render(<MedicalRecordModal {...defaultProps} />);
    expect(screen.getByText("Registro médico")).toBeInTheDocument();
  });

  it("muestra el RUT del paciente", () => {
    render(<MedicalRecordModal {...defaultProps} />);
    expect(screen.getByText(/12345678-9/)).toBeInTheDocument();
  });

  it("llama a onClose al hacer click en Cancelar", () => {
    const mockClose = vi.fn();
    render(<MedicalRecordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en ✕", () => {
    const mockClose = vi.fn();
    render(<MedicalRecordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el overlay", () => {
    const mockClose = vi.fn();
    render(<MedicalRecordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al presionar Enter en el overlay", () => {
    const mockClose = vi.fn();
    render(<MedicalRecordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Enter" });
    expect(mockClose).toHaveBeenCalled();
  });

  it("muestra error cuando existe", () => {
    render(<MedicalRecordModal {...defaultProps} error="Error al guardar" />);
    expect(screen.getByText("Error al guardar")).toBeInTheDocument();
  });

  it("muestra Guardando... cuando loading es true", () => {
    render(<MedicalRecordModal {...defaultProps} loading={true} />);
    expect(screen.getByText("Guardando...")).toBeInTheDocument();
  });

  it("muestra enlace a imagen si existe imageUrl", () => {
    render(<MedicalRecordModal {...defaultProps} appointment={{ ...defaultProps.appointment, imageUrl: "http://ejemplo.com/img.jpg" }} />);
    expect(screen.getByText("Ver imagen adjunta")).toBeInTheDocument();
  });

  it("llama a onSubmit al enviar el formulario", () => {
    const mockSubmit = vi.fn();
    render(<MedicalRecordModal {...defaultProps} onSubmit={mockSubmit} />);
    const form = document.querySelector("form");
    Object.defineProperty(form, "prescription", { value: { value: "Ibuprofeno" }, configurable: true });
    Object.defineProperty(form, "indications", { value: { value: "Reposo" }, configurable: true });
    Object.defineProperty(form, "restDays", { value: { value: "3" }, configurable: true });
    Object.defineProperty(form, "image", { value: { files: [] }, configurable: true });
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalledWith({
      prescription: "Ibuprofeno",
      indications: "Reposo",
      restDays: 3,
      file: null,
    });
  });
});