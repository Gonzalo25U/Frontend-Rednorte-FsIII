import { useState, useEffect, useRef } from "react";
import { Bell, Check } from "lucide-react";
import { api } from "../../utils/api.js";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // refresca cada 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const data = await api.get("/bff/notifications");
      setNotifications(data || []);
    } catch (err) {
      console.error("Error al cargar notificaciones", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      await api.put(`/bff/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error al marcar notificación", err);
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeIcon = {
    CITA_CREADA: "🩺",
    CITA_APROBADA: "✅",
    CITA_CANCELADA: "❌",
  };

  return (
    <div className="notification-bell" ref={ref}>
      <button className="bell-button" onClick={() => setOpen(!open)}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-dropdown">
          <div className="bell-dropdown-header">
            <h3>Notificaciones</h3>
          </div>

          <div className="bell-dropdown-list">
            {loading ? (
              <p className="bell-empty">Cargando...</p>
            ) : notifications.length === 0 ? (
              <p className="bell-empty">No tienes notificaciones</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`bell-item ${n.read ? "read" : "unread"}`}
                >
                  <span className="bell-item-icon">
                    {typeIcon[n.type] || "🔔"}
                  </span>
                  <div className="bell-item-content">
                    <p className="bell-item-message">{n.message}</p>
                    <span className="bell-item-date">
                      {new Date(n.createdAt).toLocaleString("es-CL")}
                    </span>
                  </div>
                  {!n.read && (
                    <button
                      className="bell-item-check"
                      onClick={() => handleMarkAsRead(n.id)}
                      title="Marcar como leída"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}