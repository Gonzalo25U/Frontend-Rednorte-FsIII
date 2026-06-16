import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatsCard from "./StatsCard.jsx";

const mockAppointments = [
  { status: "PENDIENTE" },
  { status: "PENDIENTE" },
  { status: "APROBADA" },
  { status: "CANCELADA" },
];

describe("StatsCard", () => {

  it("muestra el total correcto de citas", () => {
    render(<StatsCard appointments={mockAppointments} />);
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("muestra el total de pendientes correctamente", () => {
    render(<StatsCard appointments={mockAppointments} />);
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("muestra el total de aprobadas correctamente", () => {
    render(<StatsCard appointments={mockAppointments} />);
    const aprobadas = screen.getAllByText("1")[0];
    expect(aprobadas).toBeInTheDocument();
  });

  it("muestra los labels correctamente", () => {
    render(<StatsCard appointments={mockAppointments} />);
    expect(screen.getByText(/total/i)).toBeInTheDocument();
    expect(screen.getByText(/pendientes/i)).toBeInTheDocument();
    expect(screen.getByText(/aprobadas/i)).toBeInTheDocument();
    expect(screen.getByText(/canceladas/i)).toBeInTheDocument();
  });

  it("muestra ceros cuando no hay citas", () => {
    render(<StatsCard appointments={[]} />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });

  it("maneja appointments undefined sin errores", () => {
    render(<StatsCard appointments={undefined} />);
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(4);
  });
});