import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AppointmentList from "./AppointmentList.jsx";

const baseAppt = (overrides) => ({
  id: 1,
  doctorRut: "1-1",
  doctorName: "Dr. Test",
  dateTime: "2026-01-01T10:00:00",
  status: "PENDIENTE",
  priority: "B",
  ...overrides,
});

describe("AppointmentList", () => {
  it("muestra spinner de carga", () => {
    render(<AppointmentList loading={true} appointments={[]} onCancel={vi.fn()} />);
    expect(screen.getByText("Cargando citas...")).toBeInTheDocument();
  });

  it("muestra error", () => {
    render(<AppointmentList error="Falló todo" appointments={[]} onCancel={vi.fn()} />);
    expect(screen.getByText("Falló todo")).toBeInTheDocument();
  });

  it("muestra mensaje vacío cuando no hay citas", () => {
    render(<AppointmentList appointments={[]} onCancel={vi.fn()} />);
    expect(screen.getByText("No tienes citas registradas.")).toBeInTheDocument();
  });

  it("muestra mensaje vacío cuando appointments es null/undefined", () => {
    render(<AppointmentList appointments={null} onCancel={vi.fn()} />);
    expect(screen.getByText("No tienes citas registradas.")).toBeInTheDocument();
  });

  it("renderiza las citas ordenadas por fecha descendente", () => {
    const appts = [
      baseAppt({ id: 1, doctorName: "Dr. Antiguo", dateTime: "2026-01-01T10:00:00" }),
      baseAppt({ id: 2, doctorName: "Dr. Reciente", dateTime: "2026-03-01T10:00:00" }),
    ];
    render(<AppointmentList appointments={appts} onCancel={vi.fn()} />);
    const names = screen.getAllByText(/Dr\./).map((el) => el.textContent);
    // El más reciente (Dr. Reciente) debe aparecer primero
    expect(names[0]).toBe("Dr. Reciente");
  });

  it("usa doctorRut como fallback si no hay doctorName", () => {
    const appt = baseAppt({ doctorName: undefined, doctorRut: "5-5" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    const values = screen.getAllByText("5-5");
    expect(values.length).toBeGreaterThan(0);
  });

  it("muestra — cuando no hay dateTime", () => {
    const appt = baseAppt({ dateTime: null });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("llama a onCancel al hacer click en Cancelar (cita PENDIENTE)", () => {
    const onCancel = vi.fn();
    const appt = baseAppt({ status: "PENDIENTE" });
    render(<AppointmentList appointments={[appt]} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCancel).toHaveBeenCalledWith(appt);
  });

  it("no muestra botón Cancelar si la cita no está PENDIENTE", () => {
    const appt = baseAppt({ status: "APROBADA" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
  });

  it("muestra el label y clase correctos para cada estado", () => {
    const appt = baseAppt({ status: "CANCELADA" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("usa el status crudo como label si no está mapeado", () => {
    const appt = baseAppt({ status: "DESCONOCIDO" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.getByText("DESCONOCIDO")).toBeInTheDocument();
  });

  it("muestra documento adjunto del paciente si la cita está PENDIENTE", () => {
    const appt = baseAppt({ status: "PENDIENTE", patientImageUrl: "http://doc.com/x.pdf" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    const link = screen.getByText("Ver documento adjunto");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "http://doc.com/x.pdf");
  });

  it("muestra documento adjunto del paciente si la cita está CANCELADA", () => {
    const appt = baseAppt({ status: "CANCELADA", patientImageUrl: "http://doc.com/x.pdf" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.getByText("Ver documento adjunto")).toBeInTheDocument();
  });

  it("no muestra el bloque de documento adjunto fuera de APROBADA si no hay patientImageUrl", () => {
    const appt = baseAppt({ status: "PENDIENTE", patientImageUrl: null });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.queryByText("Ver documento adjunto")).not.toBeInTheDocument();
  });

  it("no muestra el documento adjunto 'simple' cuando la cita está APROBADA (usa el bloque de registro médico)", () => {
    const appt = baseAppt({ status: "APROBADA", patientImageUrl: "http://doc.com/x.pdf" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    // Debe existir el link, pero con el texto del bloque de registro médico, no el simple
    expect(screen.queryByText("Ver documento adjunto")).not.toBeInTheDocument();
    expect(screen.getByText("Ver tu documento adjunto")).toBeInTheDocument();
  });

  it("muestra registro médico completo cuando la cita está APROBADA", () => {
    const appt = baseAppt({
      status: "APROBADA",
      prescription: "Paracetamol",
      indications: "Reposo",
      restDays: 3,
      imageUrl: "http://doc.com/img.pdf",
      patientImageUrl: "http://doc.com/patient.pdf",
    });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.getByText("Registro médico")).toBeInTheDocument();
    expect(screen.getByText("Paracetamol")).toBeInTheDocument();
    expect(screen.getByText("Reposo")).toBeInTheDocument();
    expect(screen.getByText("3 días")).toBeInTheDocument();
    expect(screen.getByText("Ver documento del médico")).toBeInTheDocument();
    expect(screen.getByText("Ver tu documento adjunto")).toBeInTheDocument();
  });

  it("no muestra campos de registro médico que no estén presentes", () => {
    const appt = baseAppt({ status: "APROBADA", prescription: null, indications: null, restDays: 0 });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.getByText("Registro médico")).toBeInTheDocument();
    expect(screen.queryByText("Receta")).not.toBeInTheDocument();
    expect(screen.queryByText("Indicaciones")).not.toBeInTheDocument();
    expect(screen.queryByText("Días de reposo")).not.toBeInTheDocument();
  });

  it("no muestra el bloque de registro médico si la cita no está APROBADA", () => {
    const appt = baseAppt({ status: "PENDIENTE" });
    render(<AppointmentList appointments={[appt]} onCancel={vi.fn()} />);
    expect(screen.queryByText("Registro médico")).not.toBeInTheDocument();
  });

  it("muestra y permite expandir/ocultar el historial cuando hay más de 7 citas", () => {
    const appts = Array.from({ length: 9 }, (_, i) =>
      baseAppt({ id: i + 1, dateTime: `2026-0${(i % 9) + 1}-01T10:00:00` })
    );
    render(<AppointmentList appointments={appts} onCancel={vi.fn()} />);

    const toggle = screen.getByText("Ver historial completo (2 más)");
    expect(toggle).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText("Ocultar historial")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBe(3); // header + 2 filas de historial

    fireEvent.click(screen.getByText("Ocultar historial"));
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("no muestra el botón de historial cuando hay 7 o menos citas", () => {
    const appts = Array.from({ length: 7 }, (_, i) => baseAppt({ id: i + 1 }));
    render(<AppointmentList appointments={appts} onCancel={vi.fn()} />);
    expect(screen.queryByText(/Ver historial completo/)).not.toBeInTheDocument();
  });

  it("muestra — en la tabla de historial cuando no hay dateTime", () => {
    const appts = Array.from({ length: 8 }, (_, i) =>
      baseAppt({ id: i + 1, dateTime: i === 7 ? null : `2026-0${(i % 9) + 1}-01T10:00:00` })
    );
    render(<AppointmentList appointments={appts} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText(/Ver historial completo/));
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("usa doctorRut como fallback en la fila de historial cuando no hay doctorName", () => {
    const appts = Array.from({ length: 8 }, (_, i) =>
      baseAppt({ id: i + 1, doctorName: i === 7 ? undefined : "Dr. Test", doctorRut: "9-9" })
    );
    render(<AppointmentList appointments={appts} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText(/Ver historial completo/));
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});