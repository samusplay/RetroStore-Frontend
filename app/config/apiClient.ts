const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  cache?: RequestCache;
  headers?: Record<string, string>;
  auth?: boolean; // ← indica si necesita token
};

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${cleanEndpoint}`;

  const isFormData = options.body instanceof FormData;

  // Leemos el token del localStorage donde Zustand lo guardará
  const token = typeof window !== 'undefined'
  ? (() => {
      try {
        const raw = localStorage.getItem('retrostore-auth');
        const parsed = raw ? JSON.parse(raw)?.state?.token : null;
        console.log('🔑 Token en apiClient:', parsed ? 'ENCONTRADO' : 'NULL');
        return parsed;
      } catch {
        return null;
      }
    })()
  : null;

  const config: RequestInit = {
    method: options.method || 'GET',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      // Si hay token lo agregamos automáticamente
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      if (Array.isArray(errorData.message)) {
        errorMessage += errorData.message.join(', ');
      } else {
        errorMessage += errorData.message || errorData.error || 'Error desconocido';
      }
    } catch {
      errorMessage += 'Error interno del servidor';
    }
    throw new Error(errorMessage);
  }

  return response.json();
}