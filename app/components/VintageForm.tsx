'use client';

import { useState } from "react";

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
    <div className="mb-4 text-left">
      <label
        htmlFor={id}
        className={`block text-[9px] font-mono uppercase tracking-[0.25em] mb-1.5 transition-colors duration-200 ${
          active ? 'text-cyan-400' : 'text-white/40'
        }`}
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
        className={`w-full rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 bg-black/50 border ${
          active
            ? 'border-cyan-400/70 shadow-[0_0_15px_rgba(34,211,238,0.2)] bg-cyan-950/10'
            : 'border-white/10 hover:border-white/20'
        }`}
      />
    </div>
  );
}

export default function RetroNeonForm() {
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
    <div className="w-full py-16 flex items-center justify-center px-4 bg-[#050508]">
      <div className="relative text-center w-full max-w-lg">

        {/* Glow de fondo */}
        <div className="absolute inset-0 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />

        {/* Card */}
        <div className="relative rounded-2xl border border-cyan-500/20 bg-black/60 px-10 py-10 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">

          {/* Línea neon superior */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Esquinas neon */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-cyan-400/50" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-cyan-400/50" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-fuchsia-400/50" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-fuchsia-400/50" />

          {/* Header */}
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-cyan-400/60 mb-2">
            ✦ Señal Detectada ✦
          </p>
          <h1 className="text-3xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] mb-1">
            Únete a Nosotros
          </h1>
          <p className="text-xs font-mono text-white/30 tracking-widest mb-6">
            Recibe nuestras novedades y ofertas exclusivas
          </p>

          {/* Divisor */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-cyan-500/30 to-transparent" />
            <span className="text-cyan-400/40 text-xs font-mono">✦</span>
            <div className="flex-1 h-px bg-linear-to-r from-transparent via-fuchsia-500/30 to-transparent" />
          </div>

          {/* Contenido */}
          {enviado ? (
            <div className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-950/20 px-6 py-5 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <p className="text-cyan-300 font-mono text-sm uppercase tracking-widest mb-1">
                ✦ Transmisión recibida
              </p>
              <p className="text-white/50 font-mono text-xs">
                Gracias, <span className="text-cyan-400">{form.nombre}</span>.<br />
                Pronto recibirás señales en <span className="text-fuchsia-400">{form.correo}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Field id="nombre"   label="Nombre completo"    type="text"  placeholder="Player_One"       value={form.nombre}   focused={focused} onChange={handleChange} onFocus={() => setFocused("nombre")}   onBlur={() => setFocused("")} required />
              <Field id="correo"   label="Correo electrónico" type="email" placeholder="retro@mail.com"    value={form.correo}   focused={focused} onChange={handleChange} onFocus={() => setFocused("correo")}   onBlur={() => setFocused("")} required />
              <Field id="telefono" label="Número de teléfono" type="tel"   placeholder="+57 300 000 0000" value={form.telefono} focused={focused} onChange={handleChange} onFocus={() => setFocused("telefono")} onBlur={() => setFocused("")} />

              <button
                type="submit"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`mt-2 w-full rounded-lg border py-3 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] ${
                  hover
                    ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[0_0_25px_rgba(34,211,238,0.5)]'
                    : 'border-cyan-400/40 bg-cyan-500/10 text-cyan-300'
                }`}
              >
                Suscribirme ✦
              </button>
            </form>
          )}

          <p className="mt-5 text-[10px] font-mono text-white/20 tracking-widest">
            Sin spam. Solo lo más selecto de nuestra colección.
          </p>

          {/* Línea neon inferior */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-fuchsia-400 to-transparent" />
        </div>
      </div>
    </div>
  );
}