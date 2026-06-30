import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ChangePasswordModal from "./ChangePasswordModal.jsx";

const defaultProps = {
  user: { name: "Juan Pérez", rut: "12345678-9" },
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  loading: false,
  error: null,
  success: null,
};

describe("ChangePasswordModal", () => {
  it("renderiza el título correctamente", () => {
    render(<ChangePasswordModal {...defaultProps} />);
    expect(screen.getByText("Cambiar contraseña")).toBeInTheDocument();
  });

  it("muestra el nombre del usuario", () => {
    render(<ChangePasswordModal {...defaultProps} />);
    expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
  });

  it("llama a onClose al hacer click en Cancelar", () => {
    const mockClose = vi.fn();
    render(<ChangePasswordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en ✕", () => {
    const mockClose = vi.fn();
    render(<ChangePasswordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el overlay", () => {
    const mockClose = vi.fn();
    render(<ChangePasswordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al presionar Enter en el overlay", () => {
    const mockClose = vi.fn();
    render(<ChangePasswordModal {...defaultProps} onClose={mockClose} />);
    fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Enter" });
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onSubmit con la contraseña ingresada", async () => {
    const mockSubmit = vi.fn();
    render(<ChangePasswordModal {...defaultProps} onSubmit={mockSubmit} />);
    const input = screen.getByLabelText(/nueva contraseña/i);
    fireEvent.change(input, { target: { value: "nueva123", name: "password" } });
    const form = document.querySelector("form");
    Object.defineProperty(form, "password", { value: { value: "nueva123" }, configurable: true });
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalledWith("nueva123");
  });


  it("muestra error cuando existe", () => {
    render(<ChangePasswordModal {...defaultProps} error="Error al cambiar contraseña" />);
    expect(screen.getByText("Error al cambiar contraseña")).toBeInTheDocument();
  });

  it("muestra pantalla de éxito cuando success tiene valor", () => {
    render(<ChangePasswordModal {...defaultProps} success="nueva123" />);
    expect(screen.getByText("Contraseña actualizada")).toBeInTheDocument();
    expect(screen.getByText("nueva123")).toBeInTheDocument();
  });

  it("llama a onClose en pantalla de éxito al hacer click en overlay", () => {
    const mockClose = vi.fn();
    render(<ChangePasswordModal {...defaultProps} onClose={mockClose} success="nueva123" />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("muestra Guardando... cuando loading es true", () => {
    render(<ChangePasswordModal {...defaultProps} loading={true} />);
    expect(screen.getByText("Guardando...")).toBeInTheDocument();
  });
  it("llama a onClose en pantalla de éxito al presionar Enter en el overlay", () => {
  const mockClose = vi.fn();
  render(<ChangePasswordModal {...defaultProps} onClose={mockClose} success="nueva123" />);
  fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Enter" });
  expect(mockClose).toHaveBeenCalled();
});

it("no propaga el click en pantalla de éxito al hacer click dentro del modal", () => {
  const mockClose = vi.fn();
  render(<ChangePasswordModal {...defaultProps} onClose={mockClose} success="nueva123" />);
  fireEvent.click(document.querySelector(".modal"));
  expect(mockClose).not.toHaveBeenCalled();
});

it("no llama a onClose al presionar otra tecla en el overlay (estado normal)", () => {
  const mockClose = vi.fn();
  render(<ChangePasswordModal {...defaultProps} onClose={mockClose} />);
  fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Tab" });
  expect(mockClose).not.toHaveBeenCalled();
});

it("no propaga el click al overlay al hacer click dentro del modal (estado normal)", () => {
  const mockClose = vi.fn();
  render(<ChangePasswordModal {...defaultProps} onClose={mockClose} />);
  fireEvent.click(document.querySelector(".modal"));
  expect(mockClose).not.toHaveBeenCalled();
});
});