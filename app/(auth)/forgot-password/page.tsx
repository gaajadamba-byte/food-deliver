"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { BackButton } from "@/components/auth/BackButton";
import { apiFetch, ApiError } from "@/lib/api";
import { isValidEmail } from "@/lib/validation";

const BUTTON =
  "h-9 w-full rounded-md bg-[#18181B] px-8 text-sm font-medium text-[#FAFAFA] transition-opacity hover:opacity-90 disabled:opacity-20";

function inputClass(hasError: boolean) {
  return `w-full rounded-md border bg-white px-3 py-2 text-sm text-[#09090B] outline-none transition-colors placeholder:text-[#71717A] ${
    hasError ? "border-red-500" : "border-[#E4E4E7] focus:border-[#18181B]"
  }`;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Invalid email. Use a format like example@email.com");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch("/auth/reset-password-request", {
        method: "POST",
        body: { email: email.trim() },
        auth: false,
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-6">
        <BackButton href="/login" />
        <div className="flex size-14 items-center justify-center rounded-full border border-[#E4E4E7] bg-white">
          <Mail className="size-6 text-[#18181B]" />
        </div>
        <AuthHeader
          title="Check your email"
          subtitle={`We just sent a password reset link to ${email}. Click the link to set a new password.`}
        />
        <Link href="/login" className={`${BUTTON} flex items-center justify-center`}>
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <BackButton href="/login" />
      <AuthHeader
        title="Reset your password"
        subtitle="Enter your email to receive a password reset link."
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
      <button type="submit" disabled={submitting} className={BUTTON}>
        {submitting ? "Sending…" : "Send link"}
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
