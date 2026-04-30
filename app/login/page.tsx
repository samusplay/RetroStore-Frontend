import { LoginForm } from "./components/LoginForm";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Atrapamos el email de la URL si existe
  const defaultEmail = typeof searchParams?.email === 'string' ? searchParams.email : '';

  return <LoginForm defaultEmail={defaultEmail} />;
}