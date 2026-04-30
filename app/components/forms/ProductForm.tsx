"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";

type ProductFormInputs = {
  name: string;
  code: string;
  description: string;
  price: number;
  platform: string;
  condition: "NUEVO" | "USADO";
  category: "VINILO" | "VIDEO" | "ROPA";
  youtubeUrl?: string;
  image: FileList;
};

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInputs>({
    defaultValues: {
      condition: "NUEVO",
      category: "VINILO",
    },
  });

  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const category = watch("category");

  const onSubmit: SubmitHandler<ProductFormInputs> = async (data) => {
    setServerMsg(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("code", data.code);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("platform", data.platform);
      formData.append("condition", data.condition);
      formData.append("category", data.category);

      if (data.category === "VINILO" && data.youtubeUrl) {
        formData.append("youtubeUrl", data.youtubeUrl);
      }

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      const res = await fetch("http://localhost:4000/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear el producto");

      setServerMsg("Producto creado correctamente");
      reset();
    } catch (err) {
      setServerMsg("Error: " + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
      <div className="w-full max-w-2xl rounded-2xl border border-fuchsia-500/40 bg-zinc-950/80 p-8 shadow-[0_0_40px_rgba(217,70,239,0.25)]">
        <h1 className="text-center text-3xl font-bold tracking-widest text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]">
          CREAR PRODUCTO
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          RetroStore Backoffice
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2"
          encType="multipart/form-data"
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Nombre
            </label>
            <input
              type="text"
              {...register("name", { required: "El nombre es obligatorio" })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              placeholder="Soda Stereo - De Musica Ligera"
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Codigo
            </label>
            <input
              type="text"
              {...register("code", { required: "Codigo requerido" })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              placeholder="VIN-004"
            />
            {errors.code && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.code.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Precio requerido",
                valueAsNumber: true,
                min: { value: 0, message: "Debe ser positivo" },
              })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              placeholder="45.70"
            />
            {errors.price && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.price.message}
              </span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Descripcion
            </label>
            <textarea
              rows={3}
              {...register("description", { required: "Descripcion requerida" })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              placeholder="Vinilo original de la banda..."
            />
            {errors.description && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.description.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Plataforma
            </label>
            <input
              type="text"
              {...register("platform", { required: "Plataforma requerida" })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
              placeholder="Vinilo"
            />
            {errors.platform && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.platform.message}
              </span>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Categoria
            </label>
            <select
              {...register("category", { required: true })}
              className="w-full rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-zinc-100 outline-none transition focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            >
              <option value="VINILO">VINILO</option>
              <option value="VIDEO">VIDEO</option>
              <option value="ROPA">ROPA</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <span className="mb-2 block text-xs uppercase tracking-wider text-cyan-300">
              Condicion
            </span>
            <div className="flex gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
                <input
                  type="radio"
                  value="NUEVO"
                  {...register("condition", { required: true })}
                  className="h-4 w-4 accent-fuchsia-500"
                />
                <span>Nuevo</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-zinc-200">
                <input
                  type="radio"
                  value="USADO"
                  {...register("condition", { required: true })}
                  className="h-4 w-4 accent-fuchsia-500"
                />
                <span>Usado</span>
              </label>
            </div>
          </div>

          {category === "VINILO" && (
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs uppercase tracking-wider text-fuchsia-300">
                YouTube URL (solo VINILO)
              </label>
              <input
                type="url"
                {...register("youtubeUrl", {
                  required:
                    category === "VINILO"
                      ? "Link de YouTube requerido para VINILO"
                      : false,
                })}
                className="w-full rounded-md border border-fuchsia-500/50 bg-black/60 px-3 py-2 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                placeholder="https://youtu.be/..."
              />
              {errors.youtubeUrl && (
                <span className="mt-1 block text-xs text-red-400">
                  {errors.youtubeUrl.message}
                </span>
              )}
            </div>
          )}

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs uppercase tracking-wider text-cyan-300">
              Imagen del producto
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image", { required: "Imagen requerida" })}
              className="block w-full cursor-pointer rounded-md border border-cyan-500/40 bg-black/60 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-fuchsia-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-wider file:text-white hover:file:bg-fuchsia-500"
            />
            {errors.image && (
              <span className="mt-1 block text-xs text-red-400">
                {errors.image.message}
              </span>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md border border-fuchsia-400 bg-fuchsia-600/20 py-3 font-bold uppercase tracking-[0.2em] text-fuchsia-300 transition hover:bg-fuchsia-600/40 hover:text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.7)] disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Crear producto"}
            </button>
          </div>

          {serverMsg && (
            <div className="md:col-span-2 text-center text-sm text-cyan-300">
              {serverMsg}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}