"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { useAuthStore } from "@/app/lib/useAuthStore";
import { createProductAction } from "../actions/create-product.action";
import {
    CreateProductFormValues,
    CreateProductInput,
    createProductSchema,
} from "../schemas/create-product.schema";

export function ProductForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isSeller = user?.role === "SELLER";

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormValues, unknown, CreateProductInput>({
    // 👆 Tres genéricos: TFieldValues, TContext, TTransformedValues
    // useForm<input, context, output>
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,          // string vacío también es válido aquí porque es z.input
      platform: "",
      condition: "NUEVO",
      category: "VINILO",
      youtubeUrl: "",    // string vacío — preprocess lo convierte a undefined
      image: undefined,
    },
  });

  // El useEffect no puede leer isSubmitting porque viene del hook
  // que se declara después — lo movemos abajo o eliminamos esa dependencia
  useEffect(() => {
    if (!isSeller) {
      toast.error("Acceso denegado: Solo los vendedores pueden listar productos.");
      router.push("/catalogo");
    }
  }, [isSeller, router]);

  const category = watch("category");

  // onSubmit recibe el OUTPUT tipado (ya parseado por Zod)
  const onSubmit: SubmitHandler<CreateProductInput> = async (data) => {
    const toastId = toast.loading("Sincronizando con el servidor de RetroStore...");

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("platform", data.platform);
      formData.append("condition", data.condition);
      formData.append("category", data.category);

      if (data.youtubeUrl) formData.append("youtubeUrl", data.youtubeUrl);

      // data.image es FileList (output de Zod), ya validado con length > 0
      if (data.image?.[0]) formData.append("image", data.image[0]);

      const response = await createProductAction(formData);

      toast.dismiss(toastId);

      await Swal.fire({
        title: "¡ARTÍCULO LISTADO!",
        text: `El producto ha sido indexado con el ID: ${response.productId}`,
        icon: "success",
        background: "#0a0514",
        color: "#4ade80",
        confirmButtonColor: "#c026d3",
        timer: 3000,
        customClass: {
          popup:
            "border-2 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)] rounded-xl font-mono",
        },
      });

      reset();
    } catch (err: any) {
      toast.error(err.message || "Error al procesar el inventario", { id: toastId });
    }
  };

  if (!isSeller) return null;

  return (
    <div className="w-full max-w-3xl rounded-2xl border border-fuchsia-500/30 bg-black/40 p-8 shadow-[0_0_40px_rgba(217,70,239,0.15)] backdrop-blur-xl">
      <header className="mb-8 border-b border-fuchsia-500/20 pb-4">
        <h2 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 uppercase italic">
          Terminal de Inventario: {user?.storeName || "Mi Tienda"}
        </h2>
        <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mt-1">
          Añadiendo nuevo recurso al sistema central
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        
        {/* NOMBRE */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-[10px] font-mono uppercase text-cyan-300">Nombre del Producto</label>
          <input
            {...register("name")}
            className="w-full rounded-md border border-fuchsia-500/30 bg-black/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-fuchsia-400 focus:shadow-[0_0_10px_rgba(217,70,239,0.3)] transition-all"
            placeholder="Ej: Final Fantasy VII - Black Label"
          />
          {errors.name && <p className="mt-1 text-[10px] text-red-400 font-mono italic">{errors.name.message}</p>}
        </div>

        {/* PRECIO Y PLATAFORMA */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase text-cyan-300">Precio (USD)</label>
          <input
            type="number"
            step="0.01"
            {...register("price",{valueAsNumber:true})}
            className="w-full rounded-md border border-fuchsia-500/30 bg-black/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-fuchsia-400"
            placeholder="99.99"
          />
          {errors.price && <p className="mt-1 text-[10px] text-red-400 font-mono italic">{errors.price.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase text-cyan-300">Plataforma</label>
          <input
            {...register("platform")}
            className="w-full rounded-md border border-fuchsia-500/30 bg-black/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-fuchsia-400"
            placeholder="PlayStation / Sega / Vinyl"
          />
          {errors.platform && <p className="mt-1 text-[10px] text-red-400 font-mono italic">{errors.platform.message}</p>}
        </div>

        {/* CATEGORÍA Y CONDICIÓN */}
        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase text-purple-300">Categoría</label>
          <select
            {...register("category")}
            className="w-full rounded-md border border-purple-500/30 bg-black/80 px-4 py-3 text-sm text-purple-100 outline-none cursor-pointer"
          >
            <option value="VIDEO">Videojuegos</option>
            <option value="VINILO">Música (Vinilos)</option>
            <option value="ROPA">Retro-Clothing</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-mono uppercase text-purple-300">Condición</label>
          <select
            {...register("condition")}
            className="w-full rounded-md border border-purple-500/30 bg-black/80 px-4 py-3 text-sm text-purple-100 outline-none cursor-pointer"
          >
            <option value="NUEVO">Nuevo (Mint)</option>
            <option value="USADO">Usado (B-Stock)</option>
          </select>
        </div>

        {/* YOUTUBE URL (SOLO VINILO) */}
        {category === "VINILO" && (
          <div className="md:col-span-2 animate-in slide-in-from-top-4 duration-300">
            <label className="mb-1 block text-[10px] font-mono uppercase text-orange-400 italic">Previsualización de Audio (YouTube URL)</label>
            <input
              {...register("youtubeUrl")}
              className="w-full rounded-md border border-orange-500/40 bg-orange-950/10 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-orange-400 focus:shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.youtubeUrl && <p className="mt-1 text-[10px] text-red-400 font-mono italic">{errors.youtubeUrl.message}</p>}
          </div>
        )}

        {/* DESCRIPCIÓN */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-[10px] font-mono uppercase text-cyan-300">Descripción Técnica</label>
          <textarea
            rows={3}
            {...register("description")}
            className="w-full rounded-md border border-fuchsia-500/30 bg-black/60 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-fuchsia-400 resize-none transition-all"
            placeholder="Detalla el estado físico, región, etc..."
          />
          {errors.description && <p className="mt-1 text-[10px] text-red-400 font-mono italic">{errors.description.message}</p>}
        </div>

        {/* IMAGEN */}
        <div className="md:col-span-2">
          <label className="mb-1 block text-[10px] font-mono uppercase text-cyan-300">Imagen del Producto</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            className="block w-full text-xs text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-[10px] file:font-mono file:uppercase file:bg-fuchsia-600 file:text-white hover:file:bg-fuchsia-500 cursor-pointer"
          />
          {errors.image && <p className="mt-1 text-[10px] text-red-400 font-mono italic">{errors.image.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 mt-4 w-full rounded-md bg-gradient-to-r from-fuchsia-600 to-purple-600 py-4 font-black uppercase tracking-[0.3em] text-white transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] disabled:opacity-50"
        >
          {isSubmitting ? "Sincronizando..." : "Ejecutar Carga de Producto"}
        </button>
      </form>
    </div>
  );
}