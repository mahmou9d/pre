"use client";

import IsLoading from "@/components/IsLoading";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = true,
  redirectTo = "/",
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      router.replace(redirectTo);
      return;
    }

    if (adminOnly && !isAdmin) {
      router.replace("/");
    }
  }, [isAuthenticated, isAdmin, isLoading, adminOnly, redirectTo, router]);

  if (isLoading) {
    return <IsLoading />;
  }

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return <>{children}</>;
};
