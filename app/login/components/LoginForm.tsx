"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

// 1. Importamos el store de Zustand

import { useAuthStore } from "@/app/lib/useAuthStore";
import { loginAction } from "../actions/login.action";
import { loginSchema, type LoginInput } from "../schemas/login.schema";

interface LoginFormProps {
  defaultEmail?: string;
}

export function LoginForm({ defaultEmail }: LoginFormProps) {
  const router = useRouter();
  
  // 2. Extraemos la función login de nuestro store
  const { login } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail || "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    const toastId = toast.loading("Verificando credenciales en la base de datos...");
    
    try {
      const response = await loginAction(data);
      
      // 3. Verificamos que tengamos token Y usuario antes de proceder
      if (response.accessToken && response.user) {
        // A. Guardamos el token en localStorage para el apiClient (como ya hacías)
        localStorage.setItem("accessToken", response.accessToken);
        
        // B. ¡AQUÍ ESTÁ LA MAGIA! Actualizamos Zustand con ambos datos
        // Esto hará que tu Header se actualice instantáneamente
        login(response.accessToken, response.user);

        toast.success(`¡Bienvenido, ${response.user.username}!`, { id: toastId });
        
        // 4. Redirigimos al catálogo
        router.push("/catalogo"); 
      }

    } catch (err: any) {
      toast.error(err.message || "Credenciales incorrectas", { id: toastId });
    }
  };

  return (
    <div className="w-full max-w-[28rem] rounded-2xl border border-cyan-400/40 bg-black/40 p-8 shadow-[0_0_40px_rgba(34,211,238,0.2)] backdrop-blur-xl relative overflow-hidden">
      
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/20 blur-[50px] rounded-full pointer-events-none"></div>

      <div className="relative z-10">
        <h1 className="text-center text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
          INICIAR SESIÓN
        </h1>
        <p className="mt-1 text-center text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-300/70">
          Inserta tu credencial
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid grid-cols-1 gap-5">
          
          <div>
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-cyan-300">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-md border border-cyan-500/30 bg-black/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-cyan-400 focus:bg-cyan-950/30 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
              placeholder="retro@mail.com"
            />
            {errors.email && <span className="mt-1 block text-[10px] text-red-400">{errors.email.message}</span>}
          </div>

          <div>
            <label className="mb-1 block text-[10px] font-mono uppercase tracking-wider text-purple-300">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full rounded-md border border-purple-500/30 bg-black/50 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-purple-400 focus:bg-purple-950/30 focus:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              placeholder="••••••••"
            />
            {errors.password && <span className="mt-1 block text-[10px] text-red-400">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-md border-none bg-gradient-to-r from-cyan-500 to-purple-600 py-3 font-black uppercase tracking-[0.2em] text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isSubmitting ? "Autenticando..." : "Ingresar"}
          </button>

          <div className="text-center text-[11px] text-zinc-400 font-mono mt-2">
            ¿Aún no eres parte de la resistencia?{" "}
            <button type="button" onClick={() => router.push('/register')} className="text-purple-400 hover:text-cyan-300 underline underline-offset-4 transition-colors">
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}