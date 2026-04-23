// Obtenemos la URL del .env
const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any; 
  cache?: RequestCache;
  headers?: Record<string, string>;
};

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  // Nos aseguramos de que el endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;
  
  const isFormData = options.body instanceof FormData;

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    cache: options.cache || 'no-store',
  };

  if (options.body) {
    config.body = isFormData ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorMessage = `Error ${response.status}: `;
    try {
      const errorData = await response.json();
      
      // NestJS suele devolver los errores en 'message' o 'errors' (si es Zod)
      if (Array.isArray(errorData.message)) {
        errorMessage += errorData.message.join(', ');
      } else {
        errorMessage += errorData.message || errorData.error || 'Error desconocido';
      }
    } catch (e) {
      errorMessage += 'Error interno del servidor';
    }
    throw new Error(errorMessage);
  }

  return response.json();
}