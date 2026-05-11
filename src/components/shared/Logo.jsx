export default function Logo({ size = "md", variant = "default" }) {
  const sizes = {
    sm: "120px",
    md: "180px",
    lg: "240px",
  };

  // variant "white" para fondos oscuros (header), "default" para fondos claros
  const filter = variant === "white" ? "brightness(0) invert(1)" : "none";

  return (
    <img
      src="/RedNorte.png"
      alt="Red Norte Hospital"
      style={{
        width: sizes[size] || size,
        height: "auto",
        objectFit: "contain",
        filter,
      }}
    />
  );
}