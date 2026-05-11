import Logo from "./Logo.jsx";
 
export default function Footer() {
  const year = new Date().getFullYear();
 
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Logo size="sm" variant="default" />
          <p className="footer-tagline">Sistema de Gestión Médica</p>
        </div>
 
        <div className="footer-contact">
          <p className="footer-contact-title">Contacto</p>
          <p>contacto@rednorte.cl</p>
          <p>+56 2 2345 6789</p>
          <p>Av. Principal 1234, Santiago</p>
        </div>
 
        <div className="footer-copy">
          <p>© {year} Red Norte Hospital</p>
          <p>Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}
 