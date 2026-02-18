import { useHomeRedirect } from "../hooks/useHomeRedirect";

export default function HomePage() {
  const { isRedirecting } = useHomeRedirect();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse text-center">
        <p className="text-muted-foreground">
          {isRedirecting ? "Redirecionando..." : "Carregando..."}
        </p>
      </div>
    </div>
  );
}
