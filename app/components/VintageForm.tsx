'use client';
import { useState } from "react";

if (typeof document !== "undefined") {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap";
  document.head.appendChild(link);
}

const playfair  = { fontFamily: "'Playfair Display', serif" } as const;
const cormorant = { fontFamily: "'Cormorant Garamond', serif" } as const;

interface FormState {
  nombre:   string;
  correo:   string;
  telefono: string;
}

interface FieldProps {
  id:          keyof FormState;
  label:       string;
  type:        string;
  placeholder: string;
  value:       string;
  focused:     string;
  onChange:    (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus:     () => void;
  onBlur:      () => void;
  required?:   boolean;
}

function Field({ id, label, type, placeholder, value, focused, onChange, onFocus, onBlur, required }: FieldProps) {
  const active = focused === id;
  return (
    <div className="mb-5 text-left">
      <label
        htmlFor={id}
        className="block text-[0.78rem] uppercase font-semibold tracking-[0.15em] mb-[0.3rem] text-[#6B3A2A]"
        style={cormorant}
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        className="w-full text-base text-[#2C1810] outline-none box-border rounded-none appearance-none transition-[border-color,background] duration-200"
        style={{
          padding: "0.7rem 0.9rem",
          border: `1px solid ${active ? "#722F37" : "#C4A882"}`,
          background: active ? "rgba(245,230,200,0.6)" : "rgba(245,230,200,0.35)",
          ...cormorant,
        }}
      />
    </div>
  );
}

export default function VintageForm() {
  const [form, setForm]       = useState<FormState>({ nombre: "", correo: "", telefono: "" });
  const [enviado, setEnviado] = useState(false);
  const [hover, setHover]     = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos del formulario:", form);
    setEnviado(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{
        background: `
          radial-gradient(ellipse at 20% 20%, #E8D5A3 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, #D4B896 0%, transparent 50%),
          #F0DDB8
        `,
        ...cormorant,
      }}
    >
      <div
        className="relative text-center w-full max-w-[440px]"
        style={{
          background: "#FDF6E3",
          padding: "2.5rem 2.8rem",
          border: "1.5px solid #C4A882",
          boxShadow: "0 2px 8px rgba(44,24,16,0.15), inset 0 0 60px rgba(196,160,85,0.08)",
        }}
      >
        {/* Esquinas */}
        <div className="absolute top-[10px] left-[10px]  w-7 h-7 border-t-2 border-l-2 border-[#C4A055]" />
        <div className="absolute top-[10px] right-[10px] w-7 h-7 border-t-2 border-r-2 border-[#C4A055]" />
        <div className="absolute bottom-[10px] left-[10px]  w-7 h-7 border-b-2 border-l-2 border-[#C4A055]" />
        <div className="absolute bottom-[10px] right-[10px] w-7 h-7 border-b-2 border-r-2 border-[#C4A055]" />

        {/* Encabezado */}
        <p className="text-[0.75rem] tracking-[0.25em] uppercase text-[#C4A055] mb-2" style={cormorant}>
          ✦ Colección Vintage ✦
        </p>
        <h1 className="text-[2rem] font-bold leading-[1.2] tracking-[0.04em] text-[#2C1810] mb-[0.2rem]" style={playfair}>
          Únete a Nosotros
        </h1>
        <p className="italic text-base tracking-[0.06em] text-[#8C6D52] mb-[1.6rem]" style={cormorant}>
          Recibe nuestras novedades y ofertas exclusivas
        </p>

        {/* Divisor */}
        <div className="flex items-center gap-[0.6rem] mb-[1.8rem] text-[#C4A055]">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #C4A055, transparent)" }} />
          <span className="text-base">❧</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #C4A055, transparent)" }} />
        </div>

        {/* Contenido */}
        {enviado ? (
          <div
            className="mt-4 text-[1.05rem] italic text-[#6B3A2A]"
            style={{ padding: "1.2rem", border: "1px solid #C4A055", background: "rgba(196,160,85,0.12)", ...cormorant }}
          >
            ✦ ¡Gracias, {form.nombre}!<br />
            Pronto recibirás nuestras novedades en <em>{form.correo}</em>.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Field id="nombre"   label="Nombre completo"    type="text"  placeholder="Tu nombre"       value={form.nombre}   focused={focused} onChange={handleChange} onFocus={() => setFocused("nombre")}   onBlur={() => setFocused("")} required />
            <Field id="correo"   label="Correo electrónico" type="email" placeholder="tu@correo.com"    value={form.correo}   focused={focused} onChange={handleChange} onFocus={() => setFocused("correo")}   onBlur={() => setFocused("")} required />
            <Field id="telefono" label="Número de teléfono" type="tel"   placeholder="+57 300 000 0000" value={form.telefono} focused={focused} onChange={handleChange} onFocus={() => setFocused("telefono")} onBlur={() => setFocused("")} />

            {/* Botón claro con texto negro */}
            <button
              type="submit"
              className="w-full text-[#2C1810] text-[0.85rem] tracking-[0.2em] uppercase font-semibold cursor-pointer rounded-none transition-all duration-200"
              style={{
                padding: "0.85rem",
                marginTop: "0.4rem",
                border: `1px solid #C4A882`,
                background: hover ? "#EDD9A3" : "#F5E6C8",
                transform: hover ? "translateY(-1px)" : "none",
                ...cormorant,
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Suscribirme ✦
            </button>
          </form>
        )}

        <p className="mt-[1.4rem] text-[0.8rem] italic leading-[1.5] text-[#8C6D52]" style={cormorant}>
          Sin spam. Solo lo más selecto de nuestra colección.
        </p>
      </div>
    </div>
  );
}