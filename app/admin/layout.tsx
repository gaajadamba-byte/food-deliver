import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin — Food Delivery",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side guard: read access token from cookie and validate with backend
  const cookieStore = await cookies();
  const cookie = cookieStore.get("access_token")?.value;

  if (!cookie) redirect("/login");

  let shouldRedirectToHome = false;
  let shouldRedirectToLogin = false;

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
    const res = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${cookie}` },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const user = data.user || data;
      if (user?.role !== "ADMIN") {
        shouldRedirectToHome = true;
      }
    } else if (res.status === 404) {
      // Хэрэв /auth/me байхгүй бол түр алгасаад клиент талд (AdminGuard) шалгахыг зөвшөөрөх
      console.warn(
        "AdminLayout: /auth/me route missing in backend, skipping server-side check.",
      );
    } else {
      shouldRedirectToLogin = true;
    }
  } catch (err) {
    console.error("Auth check failed:", err);
    shouldRedirectToLogin = true;
  }

  if (shouldRedirectToHome) redirect("/");
  if (shouldRedirectToLogin) redirect("/login");

  // Nested layout — global CSS and Providers come from root `app/layout.tsx`.
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900">{children}</div>
  );
}
