import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaz Basada en nuestro backend
export interface User {
  id: string; 
  username: string;
  email: string;
  role: 'COLLECTOR' | 'SELLER';
  favoriteConsole: string;
  storeName?: string; // Es opcional porque el COLLECTOR no tiene este campo
  createdAt: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  // Acciones
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'retrostore-auth', // Nombre de la llave en el localStorage
    }
  )
);