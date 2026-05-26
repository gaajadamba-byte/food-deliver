"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { BackButton } from "@/components/auth/BackButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { isValidEmail } from "@/lib/validation";

const BUTTON =
  "h-9 w-full rounded-md bg-[#18181B] px-8 text-sm font-medium text-[#FAFAFA] transition-opacity hover:opacity-90 disabled:opacity-20";

function inputClass(hasError: boolean) {
  return `w-full rounded-md border bg-white px-3 py-2 text-sm text-[#09090B] outline-none transition-colors placeholder:text-[#71717A] ${
    hasError ? "border-red-500" : "border-[#E4E4E7] focus:border-[#18181B]"
  }`;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Invalid email. Use a format like example@email.com");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const user = await signIn(email.trim(), password);
      console.log("Logged in user:", user); // Debug хийхэд тусална

      // Хэрэглэгчийн мэдээлэл nested байж болзошгүйг тооцох
      const userData = user?.user || user;
      const userRole =
        userData?.role ||
        JSON.parse(localStorage.getItem("food_user") || "{}").role;

      if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not log in. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-6">
      <BackButton href="/" />
      <AuthHeader
        title="Log in"
        subtitle="Log in to enjoy your favorite dishes."
      />

      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="Enter your email address"
          className={inputClass(error !== null)}
        />
        <div className="flex flex-col gap-1.5">
          <PasswordInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="Password"
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Link
            href="/forgot-password"
            className="text-sm text-[#2563EB] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <button type="submit" disabled={submitting} className={BUTTON}>
        {submitting ? "Logging in…" : "Let's Go"}
      </button>

      <p className="text-center text-base text-[#71717A]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#2563EB] hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
