import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ConfirmModal from "./ConfirmModal.jsx";

describe("ConfirmModal", () => {

  it("renderiza el título correctamente", () => {
    render(<ConfirmModal title="Eliminar usuario" message="¿Estás seguro?" onConfirm={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByText("Eliminar usuario")).toBeInTheDocument();
  });

  it("renderiza el mensaje correctamente", () => {
    render(<ConfirmModal title="Eliminar usuario" message="¿Estás seguro?" onConfirm={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
  });

  it("muestra botones de Cancelar y Eliminar", () => {
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Eliminar" })).toBeInTheDocument();
  });

  it("llama a onConfirm al hacer click en Eliminar", () => {
    const mockConfirm = vi.fn();
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={mockConfirm} onCancel={vi.fn()} loading={false} />);
    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(mockConfirm).toHaveBeenCalled();
  });

  it("llama a onCancel al hacer click en Cancelar", () => {
    const mockCancel = vi.fn();
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={mockCancel} loading={false} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(mockCancel).toHaveBeenCalled();
  });

  it("llama a onCancel al hacer click en ✕", () => {
    const mockCancel = vi.fn();
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={mockCancel} loading={false} />);
    fireEvent.click(screen.getByText("✕"));
    expect(mockCancel).toHaveBeenCalled();
  });

  it("llama a onCancel al hacer click en el overlay", () => {
    const mockCancel = vi.fn();
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={mockCancel} loading={false} />);
    fireEvent.click(document.querySelector(".modal-overlay"));
    expect(mockCancel).toHaveBeenCalled();
  });

  it("deshabilita ambos botones cuando loading es true", () => {
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={vi.fn()} loading={true} />);
    expect(screen.getByText("Cancelar")).toBeDisabled();
    expect(screen.getByText("Eliminando...")).toBeDisabled();
  });

  it("muestra texto Eliminando... cuando loading es true", () => {
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={vi.fn()} loading={true} />);
    expect(screen.getByText("Eliminando...")).toBeInTheDocument();
  });

  it("no llama a onConfirm cuando loading es true", () => {
    const mockConfirm = vi.fn();
    render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={mockConfirm} onCancel={vi.fn()} loading={true} />);
    fireEvent.click(screen.getByText("Eliminando..."));
    expect(mockConfirm).not.toHaveBeenCalled();
  });
  it("llama a onCancel al presionar Enter en el overlay", () => {
  const mockCancel = vi.fn();
  render(<ConfirmModal title="Eliminar" message="Mensaje" onConfirm={vi.fn()} onCancel={mockCancel} loading={false} />);
  fireEvent.keyDown(document.querySelector(".modal-overlay"), { key: "Enter" });
  expect(mockCancel).toHaveBeenCalled();
  });
});