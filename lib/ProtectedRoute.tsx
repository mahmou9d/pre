// lib/ProtectedRoute.tsx
"use client";

import IsLoading from "@/components/IsLoading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

function ProtectedRouteInner({
  children,
  adminOnly = true,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }
    if (adminOnly && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, redirectTo, router]);

  if (isLoading) return <IsLoading />;
  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = (props) => {
  return (
    <Suspense fallback={<IsLoading />}>
      <ProtectedRouteInner {...props} />
    </Suspense>
  );
};
