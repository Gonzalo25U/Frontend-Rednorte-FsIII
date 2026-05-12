import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import UserTable from "./UserTable.jsx";

const mockUsers = [
  { id: 1, rut: "11111111-1", name: "Admin", role: "ADMIN", active: true },
  { id: 2, rut: "22222222-2", name: "Doctor Test", role: "DOCTOR", active: true },
  { id: 3, rut: "33333333-3", name: "Paciente Test", role: "PACIENTE", active: false },
];

describe("UserTable", () => {

  it("muestra spinner cuando loading es true", () => {
    render(<UserTable users={[]} loading={true} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);
    expect(screen.getByText(/cargando usuarios/i)).toBeInTheDocument();
  });

  it("muestra mensaje de error cuando hay un error", () => {
    render(<UserTable users={[]} loading={false} error="Error al cargar" onDelete={vi.fn()} onChangePassword={vi.fn()} />);
    expect(screen.getByText("Error al cargar")).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay usuarios", () => {
    render(<UserTable users={[]} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);
    expect(screen.getByText(/no hay usuarios registrados/i)).toBeInTheDocument();
  });

  it("renderiza la tabla con los usuarios correctamente", () => {
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);

    expect(screen.getByText("11111111-1")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Doctor Test")).toBeInTheDocument();
    expect(screen.getByText("Paciente Test")).toBeInTheDocument();
  });

  it("muestra los labels de rol correctamente", () => {
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);

    expect(screen.getByText("Administrador")).toBeInTheDocument();
    expect(screen.getByText("Doctor")).toBeInTheDocument();
    expect(screen.getByText("Paciente")).toBeInTheDocument();
  });

  it("muestra estado Activo e Inactivo correctamente", () => {
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);

    const activos = screen.getAllByText("Activo");
    expect(activos).toHaveLength(2);
    expect(screen.getByText("Inactivo")).toBeInTheDocument();
  });

  it("no muestra botón de acciones para el ADMIN", () => {
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);

    const menuBtns = screen.getAllByText("⋯");
    expect(menuBtns).toHaveLength(2); // solo DOCTOR y PACIENTE
  });

  it("abre el menú de acciones al hacer click en ⋯", () => {
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);

    const menuBtns = screen.getAllByText("⋯");
    fireEvent.click(menuBtns[0]);

    expect(screen.getByText("Cambiar contraseña")).toBeInTheDocument();
    expect(screen.getByText("Eliminar usuario")).toBeInTheDocument();
  });

  it("llama a onChangePassword con el usuario correcto", () => {
    const mockChangePassword = vi.fn();
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={mockChangePassword} />);

    fireEvent.click(screen.getAllByText("⋯")[0]);
    fireEvent.click(screen.getByText("Cambiar contraseña"));

    expect(mockChangePassword).toHaveBeenCalledWith(mockUsers[1]);
  });

  it("llama a onDelete con el usuario correcto", () => {
    const mockDelete = vi.fn();
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={mockDelete} onChangePassword={vi.fn()} />);

    fireEvent.click(screen.getAllByText("⋯")[0]);
    fireEvent.click(screen.getByText("Eliminar usuario"));

    expect(mockDelete).toHaveBeenCalledWith(mockUsers[1]);
  });

  it("cierra el menú al hacer click en el backdrop", () => {
    render(<UserTable users={mockUsers} loading={false} error={null} onDelete={vi.fn()} onChangePassword={vi.fn()} />);

    fireEvent.click(screen.getAllByText("⋯")[0]);
    expect(screen.getByText("Cambiar contraseña")).toBeInTheDocument();

    fireEvent.click(document.querySelector(".menu-backdrop"));
    expect(screen.queryByText("Cambiar contraseña")).not.toBeInTheDocument();
  });
});