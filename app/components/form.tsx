//ponemos que es un redender component
'use client';

import { useForm } from "react-hook-form";
//campos formulario
type Datos = {
    nombre: string
    email: string
}
export default function FormularioPrueba() {

    //del hook extraer  las herramientas y le pasamos el type
    const { register, handleSubmit, formState: { errors }, reset } = useForm<Datos>()

    //funcion que va enviar los datos
    const processRegister = (datos: any) => {
        console.log('Envio de ', datos)
        //montar backend en nest.js
        //llamar usando zod para server actions
        //luego hacer mutuacion con tan stack o 

        //limpiamos el formulario
        reset();

    }
    //renderizamos
    return (
        <form
            // handle submit la encargada de enviar los datos
            onSubmit={handleSubmit(processRegister)}
            className="p-10 max-w-md mx-auto flex flex-col gap-6 bg-white border border-zinc-200 rounded-2xl shadow-sm "
        >
            {/* CAMPOS*/}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-zinc-700">Nombre</label>
                <input
                    type="text"
                    placeholder="nombre"
                    //conectamos que a la libreria que es obligatorio
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    //manejamos logica de colores
                    className={`border p-2 rounded focus:outline-none transition-colors ${errors.nombre
                        ? 'border-red-500 bg-red-50' // SI HAY ERROR: Borde rojo y fondo rojito claro
                        : 'border-zinc-300 focus:border-orange-500' // SI NO HAY ERROR: Gris normal, naranja al hacer clic
                        }`}
                />
                {/* manejo de errores luego hacer componente errors*/}
                {errors.nombre && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                        {String(errors.nombre.message)}
                    </p>
                )}
            </div>


            {/* manejo de errores luego hacer componente errors*/}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-zinc-700">Email</label>
                <input type="email"
                    placeholder="ej:maria@gmail.com"
                    {...register("email",
                        {
                            required: "El email es obligatorio",
                            //validar que si es un email
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Por favor, ingresa un correo válido con @"

                            }


                        })}
                    className={`border p-2 rounded focus:outline-none transition-colors ${errors.email
                        ? 'border-red-500 bg-red-50' // SI HAY ERROR: Borde rojo y fondo rojito claro
                        : 'border-zinc-300 focus:border-orange-500' // SI NO HAY ERROR: Gris normal, naranja al hacer clic
                        }`}
                />
                {/* manejo de errores luego hacer componente errors*/}
                {errors.email && (
                    <p className="text-red-500 text-xs font-bold mt-1">
                        {String(errors.email.message)}
                    </p>
                )}
            </div>
            {/* Boton */}
            <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-all hover:scale-[1.02] shadow-md mt-4"
            >
                Enviar

            </button>
        </form>
    )

}