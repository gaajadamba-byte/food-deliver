"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      console.log("AdminGuard state:", {
        isAuthenticated,
        isAdmin,
        role: user?.role,
      });
      if (!isAuthenticated) {
        console.log("AdminGuard: Not authenticated, redirecting to login");
        router.push("/login");
      } else if (!isAdmin) {
        console.log("AdminGuard: Not admin, redirecting home");
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!isAuthenticated || !isAdmin) return null;
  return <>{children}</>;
};
