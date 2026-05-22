"use client";

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { FoodDetailProvider } from "@/context/food-detail-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

/** Wraps the app with all client-side context providers. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FoodDetailProvider>{children}</FoodDetailProvider>
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </CartProvider>
    </AuthProvider>
  );
}
