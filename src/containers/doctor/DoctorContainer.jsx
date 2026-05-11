// src/containers/doctor/DoctorContainer.jsx

import { useState, useEffect } from "react";
import { api } from "../../utils/api.js";
import { logout } from "../../utils/auth.js";
import Logo from "../../components/shared/Logo.jsx";
import PatientInfo from "../../components/paciente/PatientInfo.jsx";
import DoctorAppointmentList from "../../components/doctor/DoctorAppointmentList.jsx";
import PriorityModal from "../../components/doctor/PriorityModal.jsx";
import MedicalRecordModal from "../../components/doctor/MedicalRecordModal.jsx";

export default function DoctorContainer() {
  const [doctor, setDoctor] = useState(null);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState(null);

  const [appointmentForPriority, setAppointmentForPriority] = useState(null);
  const [priorityLoading, setPriorityLoading] = useState(false);
  const [priorityError, setPriorityError] = useState(null);

  const [appointmentForRecord, setAppointmentForRecord] = useState(null);
  const [recordLoading, setRecordLoading] = useState(false);
  const [recordError, setRecordError] = useState(null);

  useEffect(() => {
    fetchDoctor();
    fetchAppointments();
  }, []);

  async function fetchDoctor() {
    setDoctorLoading(true);
    setDoctorError(null);
    try {
      const data = await api.get("/bff/doctor/me");
      setDoctor(data);
    } catch (err) {
      setDoctorError(err.message || "Error al cargar información");
    } finally {
      setDoctorLoading(false);
    }
  }

  async function fetchAppointments() {
    setAppointmentsLoading(true);
    setAppointmentsError(null);
    try {
      const data = await api.get("/bff/doctor/appointments");
      setAppointments(data);
    } catch (err) {
      setAppointmentsError(err.message || "Error al cargar citas");
    } finally {
      setAppointmentsLoading(false);
    }
  }

  async function handleSetPriority(priority) {
    setPriorityLoading(true);
    setPriorityError(null);
    try {
      await api.put(`/bff/doctor/appointments/${appointmentForPriority.id}/priority?priority=${priority}`);
      setAppointmentForPriority(null);
      fetchAppointments();
    } catch (err) {
      setPriorityError(err.message || "Error al actualizar prioridad");
    } finally {
      setPriorityLoading(false);
    }
  }

  async function handleSaveMedicalRecord(data) {
    setRecordLoading(true);
    setRecordError(null);
    try {
      await api.put(`/bff/doctor/appointments/${appointmentForRecord.id}/medical-record`, data);
      setAppointmentForRecord(null);
      fetchAppointments();
    } catch (err) {
      setRecordError(err.message || "Error al guardar registro médico");
    } finally {
      setRecordLoading(false);
    }
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="header-brand">
          <Logo size="sm" variant="default" />
        </div>
        <div className="header-actions">
          <span className="header-role">Doctor</span>
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
          <PatientInfo patient={doctor} loading={doctorLoading} error={doctorError} />
        </section>

        <section className="page-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Citas asignadas</h2>
              <p className="section-subtitle">Gestiona las solicitudes de tus pacientes</p>
            </div>
            <button className="btn-secondary" onClick={fetchAppointments}>Actualizar</button>
          </div>
          <DoctorAppointmentList
            appointments={appointments}
            loading={appointmentsLoading}
            error={appointmentsError}
            onSetPriority={(appt) => setAppointmentForPriority(appt)}
            onMedicalRecord={(appt) => setAppointmentForRecord(appt)}
          />
        </section>

      </main>

      {appointmentForPriority && (
        <PriorityModal
          appointment={appointmentForPriority}
          onSubmit={handleSetPriority}
          onClose={() => { setAppointmentForPriority(null); setPriorityError(null); }}
          loading={priorityLoading}
          error={priorityError}
        />
      )}

      {appointmentForRecord && (
        <MedicalRecordModal
          appointment={appointmentForRecord}
          onSubmit={handleSaveMedicalRecord}
          onClose={() => { setAppointmentForRecord(null); setRecordError(null); }}
          loading={recordLoading}
          error={recordError}
        />
      )}
    </div>
  );
}