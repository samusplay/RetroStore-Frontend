import { v2 as cloudinary } from "cloudinary";

//variables de entorno
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const verifcationTest = async () => {
    try {
        console.log("Intentando conectar con Cloudinary...");
        //esperamos de cloudinary
        const respuesta = await cloudinary.api.ping();
        console.log("✅ ¡Conexión exitosa a Cloudinary!", respuesta);
        return { exito: true, mensaje: "Conectado correctamente" };

    } catch (error) {
        console.error('❌ Error conectando a Cloudinary:', error);
        return { exito: false, mensaje: 'Revisa tus credenciales en el archivo .env.local' };

    }
};
export default cloudinary;
