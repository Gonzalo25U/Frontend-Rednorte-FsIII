// src/containers/paciente/PacienteContainer.jsx

import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import { logout } from "../../utils/auth.js";
import Logo from "../../components/shared/Logo.jsx";
import PatientInfo from "../../components/paciente/PatientInfo.jsx";
import AppointmentForm from "../../components/paciente/AppointmentForm.jsx";
import AppointmentList from "../../components/paciente/AppointmentList.jsx";
import CancelAppointmentModal from "../../components/paciente/CancelAppointmentModal.jsx";
import Footer from "../../components/shared/Footer.jsx";

export default function PacienteContainer() {
  const [patient, setPatient] = useState(null);
  const [patientLoading, setPatientLoading] = useState(true);
  const [patientError, setPatientError] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  useEffect(() => {
    fetchPatient();
    fetchAppointments();
  }, []);

  async function fetchPatient() {
    setPatientLoading(true);
    setPatientError(null);
    try {
      const data = await api.get("/bff/paciente/me");
      setPatient(data);
    } catch (err) {
      setPatientError(err.message || "Error al cargar información");
    } finally {
      setPatientLoading(false);
    }
  }

  async function fetchAppointments() {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const data = await api.get("/bff/paciente/appointments");
      setAppointments(data);
    } catch (err) {
      setAppointmentsError(err.message || "Error al cargar citas");
    } finally {
      setAppointmentsLoading(false);
    }
  }

  async function handleCreateAppointment() {
    setFormLoading(true);
    setFormError(null);
    try {
      const result = await api.post("/bff/paciente/appointments");
      setFormSuccess(result);
      fetchAppointments();
    } catch (err) {
      setFormError(err.message || "Error al solicitar cita");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleCancelAppointment(reason) {
    setCancelLoading(true);
    setCancelError(null);
    try {
      await api.put(`/bff/paciente/appointments/${appointmentToCancel.id}/cancel`, { reason });
      setAppointmentToCancel(null);
      fetchAppointments();
    } catch (err) {
      setCancelError(err.message || "Error al cancelar cita");
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-brand">
          <Logo size="sm" variant="default" />
        </div>
        <div className="header-actions">
          <span className="header-role">Paciente</span>
          <button className="btn-logout" onClick={logout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="admin-main">

        <section className="page-section">
          <div className="section-header">
            <div>
              <h1 className="section-title">Mi información</h1>
              <p className="section-subtitle">Tus datos registrados en el sistema</p>
            </div>
          </div>
          <PatientInfo patient={patient} loading={patientLoading} error={patientError} />
        </section>

        <section className="page-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Solicitar cita</h2>
              <p className="section-subtitle">Se asignará el doctor disponible automáticamente</p>
            </div>
          </div>
          <div className="form-card">
            <AppointmentForm
              onSubmit={handleCreateAppointment}
              loading={formLoading}
              error={formError}
              success={formSuccess}
              onReset={() => setFormSuccess(null)}
            />
          </div>
        </section>

        <section className="page-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Mis citas</h2>
              <p className="section-subtitle">Historial y estado de tus solicitudes</p>
            </div>
            <button className="btn-secondary" onClick={fetchAppointments}>Actualizar</button>
          </div>
          <AppointmentList
            appointments={appointments}
            loading={appointmentsLoading}
            error={appointmentsError}
            onCancel={(appt) => setAppointmentToCancel(appt)}
          />
        </section>

      </main>

      {appointmentToCancel && (
        <CancelAppointmentModal
          appointment={appointmentToCancel}
          onSubmit={handleCancelAppointment}
          onClose={() => { setAppointmentToCancel(null); setCancelError(null); }}
          loading={cancelLoading}
          error={cancelError}
        />
      )}
      <Footer />
    </div>
  );
}