"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type RegisterInputs = {
  username: string;
  email: string;
  password: string;
  role: "CUSTOMER" | "SELLER";
  favoriteConsole: string;
  storeName?: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputs>({
    defaultValues: {
      role: "CUSTOMER",
      favoriteConsole: "Super Nintendo",
    },
  });

  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const role = watch("role");

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    setServerMsg(null);
    try {
      const payload: Record<string, string> = {
        username: data.username,
        email: data.email,
        password: data.password,
        role: data.role,
        favoriteConsole: data.favoriteConsole,
      };
      if (data.role === "SELLER" && data.storeName) {
        payload.storeName = data.storeName;
      }

      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al registrar");
      setServerMsg("Usuario registrado correctamente");
      reset();
    } catch (err) {
      setServerMsg("Error: " + (err as Error).message);
    }
  };

  const consoles = [
    "Super Nintendo",
    "Nintendo 64",
    "PlayStation 1",
    "Sega Genesis",
    "Game Boy",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
      <div className="w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-zinc-950/80 p-8 shadow-[0_0_40px_rgba(34,211,238,0.25)]">
        <h1 className="text-center text-3xl font-bold tracking-widest text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
          CREAR CUENTA
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Unete a RetroStore
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid grid-cols-1 gap-5"
        >
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-fuchsia-300">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Usuario requerido" })}
              className="w-full rounded-md border border-fuchsia-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(217,70,239,0.5)]"
              placeholder="samuel_seller"
            />
            {errors.username && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.username.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-fuchsia-300">
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
              className="w-full rounded-md border border-fuchsia-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(217,70,239,0.5)]"
              placeholder="seller@retrostore.com"
            />
            {errors.email && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-fuchsia-300">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Contrasena requerida",
                minLength: { value: 6, message: "Minimo 6 caracteres" },
              })}
              className="w-full rounded-md border border-fuchsia-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(217,70,239,0.5)]"
              placeholder="********"
            />
            {errors.password && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-fuchsia-300">
              Role
            </label>
            <select
              {...register("role", { required: true })}
              className="w-full rounded-md border border-fuchsia-500/40 bg-black/60 px-3 py-2 text-zinc-100 outline-none transition focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(217,70,239,0.5)]"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="SELLER">Seller</option>
            </select>
          </div>

          <div>
            <span className="mb-2 block text-xs uppercase tracking-wider text-fuchsia-300">
              Favorite Console
            </span>
            <div className="grid grid-cols-2 gap-2">
              {consoles.map((c) => (
                <label
                  key={c}
                  className="flex cursor-pointer items-center gap-2 rounded border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-zinc-200 transition hover:border-cyan-500/50"
                >
                  <input
                    type="radio"
                    value={c}
                    {...register("favoriteConsole", { required: true })}
                    className="h-4 w-4 accent-cyan-400"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>

          {role === "SELLER" && (
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
                Store Name
              </label>
              <input
                type="text"
                {...register("storeName", {
                  required:
                    role === "SELLER"
                      ? "Nombre de tienda requerido para Seller"
                      : false,
                })}
                className="w-full rounded-md border border-cyan-500/50 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                placeholder="El Rincon del Pixel"
              />
              {errors.storeName && (
                <span className="mt-1 block text-xs text-red-400">
                  {errors.storeName.message}
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md border border-cyan-400 bg-cyan-500/20 py-3 font-bold uppercase tracking-[0.2em] text-cyan-300 transition hover:bg-cyan-500/40 hover:text-white hover:shadow-[0_0_20px_rgba(34,211,238,0.7)] disabled:opacity-50"
          >
            {isSubmitting ? "Registrando..." : "Crear cuenta"}
          </button>

          {serverMsg && (
            <div className="text-center text-sm text-cyan-300">
              {serverMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}