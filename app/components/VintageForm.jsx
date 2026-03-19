import { useState } from "react";

// ─── Estilos globales (fuentes vintage de Google Fonts) ───────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap";
document.head.appendChild(fontLink);

// ─── Paleta de colores vintage ────────────────────────────────────────────────
const colors = {
  parchment: "#F5E6C8",
  paper:     "#FDF6E3",
  darkBrown: "#2C1810",
  brown:     "#6B3A2A",
  burgundy:  "#722F37",
  gold:      "#C4A055",
  border:    "#C4A882",
  muted:     "#8C6D52",
};

// ─── Estilos reutilizables ────────────────────────────────────────────────────
const styles = {
  // Fondo general con textura de papel viejo
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(ellipse at 20% 20%, #E8D5A3 0%, transparent 50%),
      radial-gradient(ellipse at 80% 80%, #D4B896 0%, transparent 50%),
      #F0DDB8
    `,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Cormorant Garamond', serif",
  },

  // Tarjeta central (aspecto de papel envejecido)
  card: {
    background: colors.paper,
    maxWidth: "440px",
    width: "100%",
    padding: "2.5rem 2.8rem",
    border: `1.5px solid ${colors.border}`,
    boxShadow: `
      0 2px 8px rgba(44, 24, 16, 0.15),
      inset 0 0 60px rgba(196, 160, 85, 0.08)
    `,
    position: "relative",
    textAlign: "center",
  },

  // Esquinas decorativas (pseudo-marcos vintage)
  cornerDecor: {
    position: "absolute",
    width: "28px",
    height: "28px",
    borderColor: colors.gold,
    borderStyle: "solid",
  },

  // Título principal
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    fontWeight: "700",
    color: colors.darkBrown,
    margin: "0 0 0.2rem",
    lineHeight: 1.2,
    letterSpacing: "0.04em",
  },

  // Subtítulo en itálica
  subtitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontStyle: "italic",
    fontSize: "1rem",
    color: colors.muted,
    margin: "0 0 1.6rem",
    letterSpacing: "0.06em",
  },

  // Divisor ornamental
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    margin: "0 0 1.8rem",
    color: colors.gold,
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: `linear-gradient(to right, transparent, ${colors.gold}, transparent)`,
  },

  // Grupo de campo (label + input)
  fieldGroup: {
    marginBottom: "1.2rem",
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "0.78rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: colors.brown,
    marginBottom: "0.3rem",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "0.7rem 0.9rem",
    border: `1px solid ${colors.border}`,
    background: "rgba(245, 230, 200, 0.35)",
    fontSize: "1rem",
    fontFamily: "'Cormorant Garamond', serif",
    color: colors.darkBrown,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
  },

  // Botón de envío
  button: {
    width: "100%",
    padding: "0.85rem",
    background: colors.burgundy,
    color: "#F5E6C8",
    border: "none",
    fontSize: "0.85rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "0.4rem",
    transition: "background 0.2s, transform 0.1s",
  },

  // Mensaje de éxito
  success: {
    padding: "1.2rem",
    border: `1px solid ${colors.gold}`,
    background: "rgba(196, 160, 85, 0.12)",
    color: colors.brown,
    fontSize: "1.05rem",
    fontStyle: "italic",
    marginTop: "1rem",
  },

  // Nota al pie
  footer: {
    marginTop: "1.4rem",
    fontSize: "0.8rem",
    color: colors.muted,
    fontStyle: "italic",
    lineHeight: 1.5,
  },
};

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VintageForm() {
  // Estado del formulario: guardamos lo que el usuario escribe
  const [form, setForm]       = useState({ nombre: "", correo: "", telefono: "" });
  const [enviado, setEnviado] = useState(false);
  const [hover, setHover]     = useState(false);
  const [focused, setFocused] = useState("");

  // Actualiza el campo correspondiente cuando el usuario escribe
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    console.log("Datos del formulario:", form);
    setEnviado(true);
  };

  // Estilo dinámico del input según si está enfocado
  const inputStyle = (name) => ({
    ...styles.input,
    borderColor: focused === name ? colors.burgundy : colors.border,
    background:
      focused === name
        ? "rgba(245, 230, 200, 0.6)"
        : "rgba(245, 230, 200, 0.35)",
  });

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ── Decoraciones de esquina ── */}
        <div style={{ ...styles.cornerDecor, top: 10, left: 10,  borderWidth: "2px 0 0 2px" }} />
        <div style={{ ...styles.cornerDecor, top: 10, right: 10, borderWidth: "2px 2px 0 0" }} />
        <div style={{ ...styles.cornerDecor, bottom: 10, left: 10,  borderWidth: "0 0 2px 2px" }} />
        <div style={{ ...styles.cornerDecor, bottom: 10, right: 10, borderWidth: "0 2px 2px 0" }} />

        {/* ── Encabezado ── */}
        <p style={{ fontSize: "0.75rem", letterSpacing: "0.25em", color: colors.gold, marginBottom: "0.5rem", textTransform: "uppercase" }}>
          ✦ Colección Vintage ✦
        </p>
        <h1 style={styles.title}>Únete a Nosotros</h1>
        <p style={styles.subtitle}>Recibe nuestras novedades y ofertas exclusivas</p>

        {/* ── Divisor ornamental ── */}
        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={{ fontSize: "1rem" }}>❧</span>
          <div style={styles.dividerLine} />
        </div>

        {/* ── Formulario o mensaje de éxito ── */}
        {enviado ? (
          <div style={styles.success}>
            ✦ ¡Gracias, {form.nombre}! <br />
            Pronto recibirás nuestras novedades en <em>{form.correo}</em>.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Campo: Nombre completo */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={handleChange}
                onFocus={() => setFocused("nombre")}
                onBlur={() => setFocused("")}
                style={inputStyle("nombre")}
                required
              />
            </div>

            {/* Campo: Correo electrónico */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="tu@correo.com"
                value={form.correo}
                onChange={handleChange}
                onFocus={() => setFocused("correo")}
                onBlur={() => setFocused("")}
                style={inputStyle("correo")}
                required
              />
            </div>

            {/* Campo: Número de teléfono */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="telefono">Número de teléfono</label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="+57 300 000 0000"
                value={form.telefono}
                onChange={handleChange}
                onFocus={() => setFocused("telefono")}
                onBlur={() => setFocused("")}
                style={inputStyle("telefono")}
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              style={{
                ...styles.button,
                background: hover ? "#5C1E2A" : colors.burgundy,
                transform: hover ? "translateY(-1px)" : "none",
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Suscribirme ✦
            </button>
          </form>
        )}

        {/* ── Nota al pie ── */}
        <p style={styles.footer}>
          Sin spam. Solo lo más selecto de nuestra colección.
        </p>
      </div>
    </div>
  );
}
