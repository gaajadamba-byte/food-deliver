"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { BackButton } from "@/components/auth/BackButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { useAuth } from "@/context/auth-context";
import { ApiError } from "@/lib/api";
import { isStrongPassword, isValidEmail } from "@/lib/validation";

type Step = "email" | "password";

const BUTTON =
  "h-9 w-full rounded-md bg-[#18181B] px-8 text-sm font-medium text-[#FAFAFA] transition-opacity hover:opacity-90 disabled:opacity-20";

function inputClass(hasError: boolean) {
  return `w-full rounded-md border bg-white px-3 py-2 text-sm text-[#09090B] outline-none transition-colors placeholder:text-[#71717A] ${
    hasError ? "border-red-500" : "border-[#E4E4E7] focus:border-[#18181B]"
  }`;
}

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleEmailNext(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Invalid email. Use a format like example@email.com");
      return;
    }
    setError(null);
    setStep("password");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setError("Weak password. Use at least 8 characters with letters and numbers.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords didn't match. Try again.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await signUp({ email: email.trim(), password });
      router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Sign up failed. Try again.");
      setSubmitting(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={handleEmailNext} className="flex flex-col gap-6">
        <BackButton href="/" />
        <AuthHeader
          title="Create your account"
          subtitle="Sign up to explore your favorite dishes."
        />
        <div className="flex flex-col gap-1.5">
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
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <button type="submit" className={BUTTON}>
          Let&apos;s Go
        </button>
        <p className="text-center text-base text-[#71717A]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#2563EB] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-6">
      <BackButton onClick={() => { setStep("email"); setError(null); }} />
      <AuthHeader
        title="Create a strong password"
        subtitle="Create a strong password with letters, numbers."
      />
      <div className="flex flex-col gap-3">
        <PasswordInput
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="Password"
          autoComplete="new-password"
        />
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setError(null);
          }}
          placeholder="Confirm"
          autoComplete="new-password"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <button type="submit" disabled={submitting} className={BUTTON}>
        {submitting ? "Creating account…" : "Let's Go"}
      </button>
      <p className="text-center text-base text-[#71717A]">
        Already have an account?{" "}
        <Link href="/login" className="text-[#2563EB] hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
