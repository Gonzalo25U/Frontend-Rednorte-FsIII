export default function StatsCard({ appointments }) {
  const total = appointments?.length || 0;
  const pending = appointments?.filter(a => a.status === "PENDIENTE").length || 0;
  const approved = appointments?.filter(a => a.status === "APROBADA").length || 0;
  const cancelled = appointments?.filter(a => a.status === "CANCELADA").length || 0;

  const items = [
    { label: "Total", value: total, color: "#ffffff" },
    { label: "Pendientes", value: pending, color: "#fbbf24" },
    { label: "Aprobadas", value: approved, color: "#2dd4bf" },
    { label: "Canceladas", value: cancelled, color: "#f87171" },
  ];

  return (
    <div className="stats-card">
      <span className="section-eyebrow">Resumen</span>
      <h3 className="stats-title">Tus citas</h3>
      <div className="stats-grid">
        {items.map((item) => (
          <div key={item.label} className="stat-item">
            <span className="stat-value" style={{ color: item.color }}>{item.value}</span>
            <span className="stat-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}