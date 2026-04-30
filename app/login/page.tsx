import { LoginForm } from "./components/LoginForm";

// 1. Convertimos la página en una función asíncrona
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  
  // 2. Esperamos (await) a que los parámetros de búsqueda se resuelvan
  const params = await searchParams;

  // 3. Ahora sí podemos acceder a 'email' de forma segura
  const defaultEmail = typeof params.email === 'string' ? params.email : '';

  return <LoginForm defaultEmail={defaultEmail} />;
}