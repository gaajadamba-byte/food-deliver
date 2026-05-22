"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { BackButton } from "@/components/auth/BackButton";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { apiFetch, ApiError } from "@/lib/api";
import { isStrongPassword } from "@/lib/validation";

const BUTTON =
  "h-9 w-full rounded-md bg-[#18181B] px-8 text-sm font-medium text-[#FAFAFA] transition-opacity hover:opacity-90 disabled:opacity-20";

interface ResetPasswordFormProps {
  token: string | null;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <div className="flex flex-col gap-6">
        <BackButton href="/login" />
        <AuthHeader
          title="Invalid reset link"
          subtitle="This password reset link is missing or has expired. Please request a new one."
        />
        <Link
          href="/forgot-password"
          className={`${BUTTON} flex items-center justify-center`}
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
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
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: { token, password },
        auth: false,
      });
      toast.success("Password updated. Please log in.");
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not reset password.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <BackButton href="/login" />
      <AuthHeader
        title="Create new password"
        subtitle="Set a new password with a combination of letters and numbers for better security."
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
        {submitting ? "Saving…" : "Create password"}
      </button>
    </form>
  );
}
