"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const [serverMsg, setServerMsg] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    setServerMsg(null);
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Credenciales invalidas");
      const json = await res.json();
      console.log("Login OK", json);
      setServerMsg("Bienvenido");
      reset();
    } catch (err) {
      setServerMsg("Error: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
      <div className="w-full max-w-md rounded-2xl border border-fuchsia-500/50 bg-zinc-950/80 p-8 shadow-[0_0_50px_rgba(217,70,239,0.35)]">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]">
            LOGIN
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-zinc-500">
            RetroStore Access
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email invalido",
                },
              })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.6)]"
              placeholder="seller@retrostore.com"
            />
            {errors.email && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Contrasena requerida",
                minLength: { value: 6, message: "Minimo 6 caracteres" },
              })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(34,211,238,0.6)]"
              placeholder="********"
            />
            {errors.password && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md border border-fuchsia-400 bg-gradient-to-r from-fuchsia-600/30 to-cyan-600/30 py-3 font-bold uppercase tracking-[0.3em] text-fuchsia-200 transition hover:from-fuchsia-600/60 hover:to-cyan-600/60 hover:text-white hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] disabled:opacity-50"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>

          {serverMsg && (
            <div className="text-center text-sm text-cyan-300">{serverMsg}</div>
          )}
        </form>

        <div className="mt-6 text-center text-xs text-zinc-500">
          No tienes cuenta?{" "}
          <span className="text-fuchsia-400 hover:text-fuchsia-300 cursor-pointer">
            Registrate
          </span>
        </div>
      </div>
    </div>
  );
}