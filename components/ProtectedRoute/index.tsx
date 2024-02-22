import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export default function ProtectedRoute({ fallback, children} :ProtectedRouteProps) {
  const { status } = useSession();
  const router = useRouter();

  if (status !== "authenticated") {
    router.push("/login");
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
