import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "./LoginForm.jsx";

vi.mock("./Logo.jsx", () => ({
  default: () => <div data-testid="logo" />,
}));

describe("LoginForm", () => {

  it("renderiza el formulario correctamente", () => {
    render(<LoginForm onSubmit={vi.fn()} loading={false} error={null} />);

    expect(screen.getByLabelText(/rut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ingresar/i })).toBeInTheDocument();
  });

  it("muestra el mensaje de error cuando hay un error", () => {
    render(
      <LoginForm onSubmit={vi.fn()} loading={false} error="Credenciales inválidas" />
    );
    expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
  });

  it("no muestra error cuando error es null", () => {
    render(<LoginForm onSubmit={vi.fn()} loading={false} error={null} />);
    expect(screen.queryByText(/credenciales/i)).not.toBeInTheDocument();
  });

  it("deshabilita el botón cuando loading es true", () => {
    render(<LoginForm onSubmit={vi.fn()} loading={true} error={null} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("muestra texto de carga cuando loading es true", () => {
    render(<LoginForm onSubmit={vi.fn()} loading={true} error={null} />);
    expect(screen.getByText(/ingresando/i)).toBeInTheDocument();
  });

  it("llama a onSubmit con rut y password al enviar el formulario", () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} loading={false} error={null} />);

    fireEvent.change(screen.getByLabelText(/rut/i), {
      target: { value: "11111111-1" },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: "T11a" },
    });
    fireEvent.submit(screen.getByLabelText(/rut/i).closest("form"));

    expect(mockSubmit).toHaveBeenCalledWith("11111111-1", "T11a");
  });

  it("no llama a onSubmit si los campos están vacíos", () => {
    const mockSubmit = vi.fn();
    render(<LoginForm onSubmit={mockSubmit} loading={false} error={null} />);

    fireEvent.submit(screen.getByLabelText(/rut/i).closest("form"));

    expect(mockSubmit).not.toHaveBeenCalled();
  });
});