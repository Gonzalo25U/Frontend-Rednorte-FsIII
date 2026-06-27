import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginContainer from "./LoginContainer";

vi.mock("../services/authService", () => ({
  login: vi.fn(),
}));

vi.mock("../utils/auth", () => ({
  saveToken: vi.fn(),
  redirectByRole: vi.fn(),
}));

import { login } from "../services/authService";
import { saveToken, redirectByRole } from "../utils/auth";

beforeEach(() => {
  vi.resetAllMocks();
});

describe("LoginContainer", () => {
  it("renderiza el formulario de login", () => {
    render(<LoginContainer />);
    expect(screen.getByRole("button", { name: /ingresar al sistema/i })).toBeInTheDocument();
  });

  it("llama login, guarda token y redirige al hacer submit exitoso", async () => {
    login.mockResolvedValue("mi-token");
    render(<LoginContainer />);

    await userEvent.type(screen.getByLabelText(/rut/i), "12345678-9");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /ingresar al sistema/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("12345678-9", "password123");
      expect(saveToken).toHaveBeenCalledWith("mi-token");
      expect(redirectByRole).toHaveBeenCalled();
    });
  });

  it("muestra error si el login falla", async () => {
    login.mockRejectedValue(new Error("Credenciales inválidas"));
    render(<LoginContainer />);

    await userEvent.type(screen.getByLabelText(/rut/i), "00000000-0");
    await userEvent.type(screen.getByLabelText(/contraseña/i), "wrong");
    await userEvent.click(screen.getByRole("button", { name: /ingresar al sistema/i }));

    await waitFor(() => {
      expect(screen.getByText("Credenciales inválidas")).toBeInTheDocument();
    });
  });
});