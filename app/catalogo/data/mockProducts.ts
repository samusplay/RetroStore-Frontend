// app/catalogo/data/mockProducts.ts
import type { RetroProduct } from '../schemas/retro.schema';

export const MOCK_GAMES: RetroProduct[] = [
  {
    id: "d3aca7bb-03ef-4aa4-940f-4c7a6b31383c", // UUID falso
    name: "Super Mario World",
    description: "Clásico de plataformas en 16 bits.",
    price: 35.99,
    platform: "Super Nintendo",
    condition: "USADO",
    imageUrl: "https://res.cloudinary.com/dovbivm6m/image/upload/v1777295716/retro-store/products/plsk5taztd8ulgvlri0d.jpg", // ¡Tu imagen real de Cloudinary!
    trivia: "Fue el título de lanzamiento más vendido para la consola SNES.",
    seller: "samuel_seller"
  },
 {
    id: "8c2bf314-6d95-4c8f-a877-b01430130af2", 
    name: "The Legend of Zelda: Ocarina of Time",
    description: "Obra maestra de aventura épica.",
    price: 60.00,
    platform: "Nintendo 64",
    condition: "COMO NUEVO",
    // Opción A: Un placeholder generado automáticamente con texto
    imageUrl: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_3ds_25/SI_3DS_TheLegendofZeldaOcarinaofTime3D_image1600w.jpg", 
    trivia: "Revolucionó la industria con su sistema de fijación de objetivos (Z-targeting).",
    seller: "nintendo_fan_99"
  },
  {
    id: "smk-snes-005", 
    name: "Super Mario Kart",
    description: "El inicio de la leyenda de las carreras en 16 bits.",
    price: 45.00,
    platform: "Super Nintendo",
    condition: "USADO",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmFnsPH1BUf8jMcrpQFsxoVlCSb546inkMAw&s", 
    trivia: "Utilizó el famoso 'Modo 7' para crear una sensación de profundidad 3D revolucionaria.",
    seller: "kart_master_92"
  },
  {
    id: "sf2-snes-006", 
    name: "Street Fighter II",
    description: "El rey de las arcades llega a la sala de tu casa.",
    price: 55.00,
    platform: "Super Nintendo",
    condition: "COLECCIONISTA",
    imageUrl: "https://static.wikia.nocookie.net/nintendo/images/a/a3/Street_Fighter_II_%28SNES%29.jpg/revision/latest?cb=20191011141020&path-prefix=es", 
    trivia: "Fue tan exitoso que Capcom lanzó 7 versiones diferentes del mismo juego.",
    seller: "brawler_expert"
  },
  
];