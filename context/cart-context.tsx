"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Food } from "@/lib/types";

const CART_KEY = "food_cart";

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (food: Food, quantity?: number) => void;
  removeItem: (foodId: string) => void;
  setQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Load the cart from localStorage once on mount.
  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after the initial load).
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((food: Food, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { food, quantity }];
    });
  }, []);

  const removeItem = useCallback((foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food.id !== foodId));
  }, []);

  const setQuantity = useCallback((foodId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.food.id !== foodId)
        : prev.map((item) =>
            item.food.id === foodId ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.food.price * item.quantity,
      0,
    );
    return {
      items,
      totalCount,
      totalPrice,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
    };
  }, [
    items,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
