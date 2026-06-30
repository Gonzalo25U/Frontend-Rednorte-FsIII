import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserListContainer from "./UserListContainer";

vi.mock("../../utils/api.js", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../../utils/auth.js", () => ({
  logout: vi.fn(),
  getToken: vi.fn(() => "mock-token"),
}));

vi.mock("../../components/shared/NotificationBell.jsx", () => ({
  default: () => <div>NotificationBell</div>,
}));

vi.mock("../../components/shared/Logo.jsx", () => ({
  default: () => <div>Logo</div>,
}));

import { api } from "../../utils/api.js";

const mockUsers = [
  { id: 1, name: "Juan Pérez", rut: "12345678-9", role: "DOCTOR", active: true },
  { id: 2, name: "Ana García", rut: "98765432-1", role: "PACIENTE", active: false },
];

beforeEach(() => {
  vi.resetAllMocks();
  api.get.mockResolvedValue(mockUsers);
});

describe("UserListContainer", () => {
  it("renderiza el panel de administración", async () => {
    render(<UserListContainer />);
    await waitFor(() => {
      expect(screen.getByText("Usuarios")).toBeInTheDocument();
    });
  });

  it("muestra las estadísticas de usuarios", async () => {
    render(<UserListContainer />);
    await waitFor(() => {
      expect(screen.getByText("Total usuarios")).toBeInTheDocument();
      expect(screen.getByText("Doctores")).toBeInTheDocument();
      expect(screen.getByText("Pacientes")).toBeInTheDocument();
      expect(screen.getByText("Activos")).toBeInTheDocument();
    });
  });

  it("carga y muestra los usuarios", async () => {
    render(<UserListContainer />);
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith("/bff/admin/users");
    });
  });

  it("muestra el botón de nuevo usuario", async () => {
    render(<UserListContainer />);
    await waitFor(() => {
      expect(screen.getByText("+ Nuevo usuario")).toBeInTheDocument();
    });
  });

  it("muestra error si la carga de usuarios falla", async () => {
    api.get.mockRejectedValue(new Error("Error de red"));
    render(<UserListContainer />);
    await waitFor(() => {
      expect(screen.getByText("Error de red")).toBeInTheDocument();
    });
  });

  it("abre el formulario de nuevo usuario al hacer click", async () => {
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("+ Nuevo usuario"));
    fireEvent.click(screen.getByText("+ Nuevo usuario"));
    await waitFor(() => {
      expect(screen.getByText("Nuevo usuario")).toBeInTheDocument();
    });
  });

  it("cierra el formulario al hacer click en Cancelar", async () => {
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("+ Nuevo usuario"));
    fireEvent.click(screen.getByText("+ Nuevo usuario"));
    await waitFor(() => screen.getByText("Nuevo usuario"));
    fireEvent.click(screen.getByText("Cancelar"));
    await waitFor(() => {
      expect(screen.queryByText("Nuevo usuario")).not.toBeInTheDocument();
    });
  });

  it("actualiza la lista al hacer click en Actualizar", async () => {
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("Actualizar"));
    fireEvent.click(screen.getByText("Actualizar"));
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });

  it("abre el menú de acciones al hacer click en ⋯", async () => {
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("Juan Pérez"));
    const menuButtons = screen.getAllByText("⋯");
    fireEvent.click(menuButtons[0]);
    await waitFor(() => {
      expect(screen.getByText("Eliminar usuario")).toBeInTheDocument();
    });
  });

  it("llama a api.delete al confirmar eliminación", async () => {
    api.delete = vi.fn().mockResolvedValue({});
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("Juan Pérez"));
    const menuButtons = screen.getAllByText("⋯");
    fireEvent.click(menuButtons[0]);
    await waitFor(() => screen.getByText("Eliminar usuario"));
    fireEvent.click(screen.getByText("Eliminar usuario"));
    await waitFor(() => {
      expect(
        screen.getByText((content) => content.includes("¿Estás seguro que deseas eliminar"))
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Eliminar"));
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith("/bff/admin/users/1");
    });
  });

  it("registra el error en consola si falla la eliminación", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    api.delete = vi.fn().mockRejectedValue(new Error("No se pudo eliminar"));
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("Juan Pérez"));
    fireEvent.click(screen.getAllByText("⋯")[0]);
    await waitFor(() => screen.getByText("Eliminar usuario"));
    fireEvent.click(screen.getByText("Eliminar usuario"));
    await waitFor(() => screen.getByText("Eliminar"));
    fireEvent.click(screen.getByText("Eliminar"));

    await waitFor(() => {
      expect(errorSpy).toHaveBeenCalledWith("Error al eliminar:", "No se pudo eliminar");
    });
    errorSpy.mockRestore();
  });

    it("abre modal de cambiar contraseña al hacer click", async () => {
    render(<UserListContainer />);
    await waitFor(() => screen.getByText("Juan Pérez"));
    const menuButtons = screen.getAllByText("⋯");
    fireEvent.click(menuButtons[0]);
    await waitFor(() => screen.getByText("Cambiar contraseña"));
    fireEvent.click(screen.getByText("Cambiar contraseña"));

    await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Cambiar contraseña" })).toBeInTheDocument();
    });

    const modal = document.querySelector(".modal");
    expect(within(modal).getByText(/Juan Pérez/)).toBeInTheDocument();
    });

it("llama a api.put con el rut correcto al cambiar contraseña", async () => {
  api.put = vi.fn().mockResolvedValue({});
  render(<UserListContainer />);
  await waitFor(() => screen.getByText("Juan Pérez"));
  fireEvent.click(screen.getAllByText("⋯")[0]);
  await waitFor(() => screen.getByText("Cambiar contraseña"));
  fireEvent.click(screen.getByText("Cambiar contraseña"));

  await waitFor(() => screen.getByLabelText(/nueva contraseña/i));
  const form = document.querySelector("form");
  Object.defineProperty(form, "password", {
    value: { value: "nuevaClave123" },
    configurable: true,
  });
  fireEvent.submit(form);

  await waitFor(() => {
    expect(api.put).toHaveBeenCalledWith("/bff/admin/users/password", {
      rut: "12345678-9",
      newPassword: "nuevaClave123",
    });
  });
  expect(screen.getByText("Contraseña actualizada")).toBeInTheDocument();
});

it("muestra error si falla el cambio de contraseña", async () => {
  api.put = vi.fn().mockRejectedValue(new Error("Error al cambiar contraseña"));
  render(<UserListContainer />);
  await waitFor(() => screen.getByText("Juan Pérez"));
  fireEvent.click(screen.getAllByText("⋯")[0]);
  await waitFor(() => screen.getByText("Cambiar contraseña"));
  fireEvent.click(screen.getByText("Cambiar contraseña"));

  await waitFor(() => screen.getByLabelText(/nueva contraseña/i));
  const form = document.querySelector("form");
  Object.defineProperty(form, "password", {
    value: { value: "x" },
    configurable: true,
  });
  fireEvent.submit(form);

  await waitFor(() => {
    expect(screen.getByText("Error al cambiar contraseña")).toBeInTheDocument();
  });
});

it("cierra el modal de cambiar contraseña al hacer click en Cancelar", async () => {
  render(<UserListContainer />);
  await waitFor(() => screen.getByText("Juan Pérez"));
  fireEvent.click(screen.getAllByText("⋯")[0]);
  await waitFor(() => screen.getByText("Cambiar contraseña"));
  fireEvent.click(screen.getByText("Cambiar contraseña"));
  await waitFor(() => screen.getByLabelText(/nueva contraseña/i));
  fireEvent.click(screen.getByText("Cancelar"));
  await waitFor(() => {
    expect(screen.queryByLabelText(/nueva contraseña/i)).not.toBeInTheDocument();
  });
});

it("llama a api.post con los datos correctos al crear usuario", async () => {
  api.post = vi.fn().mockResolvedValue({
    id: 3,
    name: "Nuevo",
    rut: "11111111-1",
    role: "PACIENTE",
    generatedPassword: "pass",
  });
  render(<UserListContainer />);
  await waitFor(() => screen.getByText("+ Nuevo usuario"));
  fireEvent.click(screen.getByText("+ Nuevo usuario"));
  await waitFor(() => screen.getByText("Nuevo usuario"));

  const form = document.querySelector("form");
  Object.defineProperty(form, "name", { value: { value: "Nuevo" }, configurable: true });
  Object.defineProperty(form, "rut", { value: { value: "11111111-1" }, configurable: true });
  Object.defineProperty(form, "role", { value: { value: "PACIENTE" }, configurable: true });
  fireEvent.submit(form);

  await waitFor(() => {
    expect(api.post).toHaveBeenCalledWith("/bff/admin/users", {
      name: "Nuevo",
      rut: "11111111-1",
      role: "PACIENTE",
    });
  });
  expect(screen.getByText("Usuario creado")).toBeInTheDocument();
  expect(screen.getByText("pass")).toBeInTheDocument();
});

it("muestra error si falla la creación de usuario", async () => {
  api.post = vi.fn().mockRejectedValue(new Error("Error al crear usuario"));
  render(<UserListContainer />);
  await waitFor(() => screen.getByText("+ Nuevo usuario"));
  fireEvent.click(screen.getByText("+ Nuevo usuario"));
  await waitFor(() => screen.getByText("Nuevo usuario"));

  const form = document.querySelector("form");
  Object.defineProperty(form, "name", { value: { value: "X" }, configurable: true });
  Object.defineProperty(form, "rut", { value: { value: "1-1" }, configurable: true });
  Object.defineProperty(form, "role", { value: { value: "DOCTOR" }, configurable: true });
  fireEvent.submit(form);

  await waitFor(() => {
    expect(screen.getByText("Error al crear usuario")).toBeInTheDocument();
  });
});

it("cierra la pantalla de éxito de creación de usuario", async () => {
  api.post = vi.fn().mockResolvedValue({
    id: 3,
    name: "Nuevo",
    rut: "11111111-1",
    role: "PACIENTE",
    generatedPassword: "pass",
  });
  render(<UserListContainer />);
  await waitFor(() => screen.getByText("+ Nuevo usuario"));
  fireEvent.click(screen.getByText("+ Nuevo usuario"));
  await waitFor(() => screen.getByText("Nuevo usuario"));

  const form = document.querySelector("form");
  Object.defineProperty(form, "name", { value: { value: "Nuevo" }, configurable: true });
  Object.defineProperty(form, "rut", { value: { value: "11111111-1" }, configurable: true });
  Object.defineProperty(form, "role", { value: { value: "PACIENTE" }, configurable: true });
  fireEvent.submit(form);

  await waitFor(() => screen.getByText("Usuario creado"));
  fireEvent.click(screen.getByText("Cerrar"));
  await waitFor(() => {
    expect(screen.queryByText("Usuario creado")).not.toBeInTheDocument();
  });
});
});