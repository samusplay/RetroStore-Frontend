"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2"; // <-- Importamos SweetAlert

import { registerAction } from "../actions/register.action";
import { registerSchema, type RegisterInput } from "../schemas/register.schema";

//subiendo cambios
const CONSOLES = [
  {
    id: "Super Nintendo",
    src: "/images/logos/super-nintendo-entertainment-system.svg", 
    color: "hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]",
  },
  {
    id: "Nintendo 64",
    src: "/images/logos/nintendo-64-2.svg",
    color: "hover:border-orange-500 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)]",
  },
  {
    id: "PlayStation 1",
    src: "/images/logos/playstation-logo-colour.svg",
    color: "hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)]",
  },
  {
    id: "Sega Genesis",
    src: "/images/logos/sega-logo.svg",
    color: "hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
  },
];

export function RegisterForm() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "COLLECTOR",
      favoriteConsole: "Super Nintendo",
    },
  });

  const role = watch("role");
  const selectedConsole = watch("favoriteConsole");

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    // Mantenemos el toast chiquito solo para el estado de carga
    const toastId = toast.loading("Configurando tu avatar en el servidor...");
    
    try {
      await registerAction(data);
      
      // Destruimos el toast de carga porque vamos a abrir el modal gigante
      toast.dismiss(toastId);
      
      const isSeller = data.role === "SELLER";
      
      // === MAGIA DE SWEETALERT ===
      await Swal.fire({
        title: isSeller ? "¡TIENDA REGISTRADA!" : "¡REGISTRO EXITOSO!",
        text: isSeller ? "A la velocidad del sonido ⚡" : "¡1-UP! Nivel superado 🍄",
        imageUrl: isSeller 
          ? "/images/sonic-running.gif" 
          : "/images/mario-jump.gif",
        
        // 1. Reducimos el tamaño del GIF
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: isSeller ? "Sonic Avatar" : "Mario Avatar",
        
        // 2. Controlamos el ancho y el espaciado interno del modal
        width: '22em', 
        padding: '1.5em',
        
        background: '#0a0514', 
        color: isSeller ? '#60a5fa' : '#4ade80', 
        backdrop: `rgba(0,0,0,0.85)`, 
        timer: 3500, 
        timerProgressBar: true,
        showConfirmButton: false, 
        allowOutsideClick: false, 
        customClass: {
          // 3. Ajustamos el resplandor para que no sea tan exagerado en un modal pequeño
          popup: `border-2 ${isSeller ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)]' : 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]'} rounded-2xl`,
          // 4. Achicamos sutilmente los textos (text-lg en lugar de text-xl)
          title: 'font-mono text-lg tracking-[0.15em] mt-2',
          htmlContainer: 'font-mono text-xs text-zinc-300 tracking-wider',
        }
      });
      // Como usamos "await Swal.fire", el router.push solo se ejecuta cuando la barra de tiempo se acaba
      router.push(`/login?email=${encodeURIComponent(data.email)}`);

    } catch (err: any) {
      // Si hay error, sí usamos el toast chiquito rojo
      toast.error(err.message || "Error de comunicación", { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-[32rem] rounded-2xl border border-pink-500/50 bg-black/30 p-5 shadow-[0_0_30px_rgba(236,72,153,0.15)] backdrop-blur-lg">
      <h1 className="text-center text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-fuchsia-500 to-orange-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
        CREAR CUENTA
      </h1>
      <p className="mt-1 text-center text-[9px] font-mono uppercase tracking-[0.3em] text-cyan-400/80">
        Únete a la Resistencia Retro
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid grid-cols-1 gap-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-cyan-300">Username</label>
            <input
              type="text"
              {...register("username")}
              className="w-full rounded-md border border-cyan-500/30 bg-black/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-cyan-400 focus:bg-cyan-950/20 focus:shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              placeholder="Player_One"
            />
            {errors.username && <span className="mt-1 block text-[10px] text-red-400">{errors.username.message}</span>}
          </div>

          <div>
            <label className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-cyan-300">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-md border border-cyan-500/30 bg-black/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-cyan-400 focus:bg-cyan-950/20 focus:shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              placeholder="retro@mail.com"
            />
            {errors.email && <span className="mt-1 block text-[10px] text-red-400">{errors.email.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-cyan-300">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-md border border-cyan-500/30 bg-black/50 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-cyan-400 focus:bg-cyan-950/20 focus:shadow-[0_0_12px_rgba(34,211,238,0.4)]"
              placeholder="••••••••"
            />
            {errors.password && <span className="mt-1 block text-[10px] text-red-400">{errors.password.message}</span>}
          </div>

          <div>
            <label className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-pink-400">Clase de Usuario</label>
            <select
              {...register("role")}
              className="w-full rounded-md border border-pink-500/40 bg-black/50 px-3 py-2 text-sm text-pink-100 outline-none transition focus:border-pink-400 focus:shadow-[0_0_12px_rgba(236,72,153,0.4)] cursor-pointer"
            >
              <option value="COLLECTOR">Coleccionista (Comprador)</option>
              <option value="SELLER">Vendedor (Tienda)</option>
            </select>
            {errors.role && <span className="mt-1 block text-[10px] text-red-400">{errors.role.message}</span>}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[9px] font-mono uppercase tracking-wider text-cyan-300">Consola de tu Infancia</label>
          <div className="grid grid-cols-4 gap-2">
            {CONSOLES.map((c) => {
              const isSelected = selectedConsole === c.id;
              return (
                <label
                  key={c.id}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-2 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? "border-pink-500 bg-pink-950/40 shadow-[0_0_15px_rgba(236,72,153,0.5)] scale-[1.02]" 
                      : `border-zinc-800 bg-black/40 ${c.color} opacity-60 hover:opacity-100`
                  }`}
                >
                  <input type="radio" value={c.id} {...register("favoriteConsole")} className="hidden" />
                  <div className="flex items-center justify-center h-6 w-full">
                    {c.src ? (
                      <img src={c.src} alt={c.id} className={`max-h-full max-w-full object-contain transition-all duration-300 ${isSelected ? 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'grayscale-[50%]'}`} />
                    ) : (
                      <span className="text-sm">🎮</span>
                    )}
                  </div>
                  <span className={`text-[7px] font-mono uppercase text-center ${isSelected ? "text-pink-300 font-bold" : "text-zinc-500"}`}>
                    {c.id}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.favoriteConsole && <span className="mt-1 block text-[10px] text-red-400">{errors.favoriteConsole.message}</span>}
        </div>

        {role === "SELLER" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="mb-1 block text-[9px] font-mono uppercase tracking-wider text-orange-400">Nombre de tu Tienda</label>
            <input
              type="text"
              {...register("storeName")}
              className="w-full rounded-md border border-orange-500/40 bg-orange-950/10 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-orange-400 focus:shadow-[0_0_12px_rgba(249,115,22,0.4)]"
              placeholder="El Rincón del Píxel"
            />
            {errors.storeName && <span className="mt-1 block text-[10px] text-red-400">{errors.storeName.message}</span>}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-md border-none bg-gradient-to-r from-pink-600 to-orange-500 py-3 font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isSubmitting ? "Cargando..." : "Crear Perfil"}
        </button>

        <div className="text-center text-[11px] text-zinc-400 font-mono mt-1">
          ¿Ya tienes cuenta?{" "}
          <button type="button" onClick={() => router.push('/login')} className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
            Inicia Sesión
          </button>
        </div>
      </form>
    </div>
  );
}