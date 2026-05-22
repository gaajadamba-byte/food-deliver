"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiFetch, tokenStore } from "@/lib/api";
import type { AuthResponse, User } from "@/lib/types";

const USER_KEY = "food_user";

export interface SignUpInput {
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<{ message: string }>;
  verifyEmail: (token: string) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate the session from localStorage on first load.
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (stored && tokenStore.getAccess()) {
      try {
        setUser(JSON.parse(stored) as User);
      } catch {
        persistUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const applySession = useCallback((data: AuthResponse) => {
    tokenStore.setTokens(data.accessToken, data.refreshToken);
    persistUser(data.user);
    setUser(data.user);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<AuthResponse>("/auth/sign-in", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      applySession(data);
    },
    [applySession],
  );

  const signUp = useCallback(async (input: SignUpInput) => {
    // Sign-up does not log the user in — they must verify their email first.
    return apiFetch<{ message: string }>("/auth/sign-up", {
      method: "POST",
      body: input,
      auth: false,
    });
  }, []);

  const verifyEmail = useCallback(
    async (token: string) => {
      const data = await apiFetch<AuthResponse>(
        `/auth/verify-email?token=${encodeURIComponent(token)}`,
        { auth: false },
      );
      applySession(data);
    },
    [applySession],
  );

  const signOut = useCallback(() => {
    tokenStore.clear();
    persistUser(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((next: User) => {
    persistUser(next);
    setUser(next);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "ADMIN",
      signIn,
      signUp,
      verifyEmail,
      signOut,
      updateUser,
    }),
    [user, isLoading, signIn, signUp, verifyEmail, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
