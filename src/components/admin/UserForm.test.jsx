import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import UserForm from "./UserForm.jsx";

const defaultProps = {
  onSubmit: vi.fn(),
  onClose: vi.fn(),
  loading: false,
  error: null,
  createdUser: null,
};

describe("UserForm", () => {
  it("renderiza el título correctamente", () => {
    render(<UserForm {...defaultProps} />);
    expect(screen.getByText("Nuevo usuario")).toBeInTheDocument();
  });

  it("llama a onClose al hacer click en Cancelar", () => {
    const mockClose = vi.fn();
    render(<UserForm {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en ✕", () => {
    const mockClose = vi.fn();
    render(<UserForm {...defaultProps} onClose={mockClose} />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al hacer click en el overlay", () => {
    const mockClose = vi.fn();
    render(<UserForm {...defaultProps} onClose={mockClose} />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onClose al presionar Enter en el overlay", () => {
    const mockClose = vi.fn();
    render(<UserForm {...defaultProps} onClose={mockClose} />);
    fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Enter" });
    expect(mockClose).toHaveBeenCalled();
  });

  it("llama a onSubmit con los datos ingresados", async () => {
    const mockSubmit = vi.fn();
    render(<UserForm {...defaultProps} onSubmit={mockSubmit} />);
    const form = document.querySelector("form");
    Object.defineProperty(form, "name", { value: { value: "Juan Pérez" }, configurable: true });
    Object.defineProperty(form, "rut", { value: { value: "12345678-9" }, configurable: true });
    Object.defineProperty(form, "role", { value: { value: "DOCTOR" }, configurable: true });
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalledWith({
      name: "Juan Pérez",
      rut: "12345678-9",
      role: "DOCTOR",
    });
  });

  it("muestra error cuando existe", () => {
    render(<UserForm {...defaultProps} error="Error al crear usuario" />);
    expect(screen.getByText("Error al crear usuario")).toBeInTheDocument();
  });

  it("muestra pantalla de éxito cuando createdUser tiene valor", () => {
    const createdUser = {
      name: "Juan Pérez",
      rut: "12345678-9",
      role: "DOCTOR",
      generatedPassword: "pass123",
    };
    render(<UserForm {...defaultProps} createdUser={createdUser} />);
    expect(screen.getByText("Usuario creado")).toBeInTheDocument();
    expect(screen.getByText("pass123")).toBeInTheDocument();
  });

  it("muestra Creando... cuando loading es true", () => {
    render(<UserForm {...defaultProps} loading={true} />);
    expect(screen.getByText("Creando...")).toBeInTheDocument();
  });
});