"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { BackButton } from "@/components/auth/BackButton";
import { useAuth } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";

const BUTTON =
  "h-9 w-full rounded-md bg-[#18181B] px-8 text-sm font-medium text-[#FAFAFA] transition-opacity hover:opacity-90 disabled:opacity-20";

interface VerifyEmailContentProps {
  token: string | null;
  email: string | null;
}

export function VerifyEmailContent({ token, email }: VerifyEmailContentProps) {
  const router = useRouter();
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<"notice" | "verifying" | "error">(
    token ? "verifying" : "notice",
  );
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  // When arriving from an email link, verify the token and log the user in.
  useEffect(() => {
    if (!token) return;
    verifyEmail(token)
      .then(() => {
        toast.success("Email verified — welcome!");
        router.replace("/");
      })
      .catch((err: unknown) => {
        setStatus("error");
        setError(
          err instanceof ApiError ? err.message : "Verification failed.",
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleResend() {
    if (!email) {
      toast.error("Email address is unknown. Please sign up again.");
      return;
    }
    setResending(true);
    try {
      await apiFetch("/auth/resend-verification", {
        method: "POST",
        body: { email },
        auth: false,
      });
      toast.success("Verification email sent.");
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Could not resend email.",
      );
    } finally {
      setResending(false);
    }
  }

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <Loader2 className="size-10 animate-spin text-[#18181B]" />
        <p className="text-base text-[#71717A]">Verifying your email…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col gap-6">
        <BackButton href="/login" />
        <div className="flex size-14 items-center justify-center rounded-full border border-red-200 bg-white">
          <XCircle className="size-6 text-red-500" />
        </div>
        <AuthHeader
          title="Verification failed"
          subtitle={error ?? "This verification link is invalid or has expired."}
        />
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className={BUTTON}
        >
          {resending ? "Sending…" : "Resend email"}
        </button>
        <p className="text-center text-base text-[#71717A]">
          <Link href="/login" className="text-[#2563EB] hover:underline">
            Back to log in
          </Link>
        </p>
      </div>
    );
  }

  // notice — shown right after sign-up
  return (
    <div className="flex flex-col gap-6">
      <BackButton href="/signup" />
      <div className="flex size-14 items-center justify-center rounded-full border border-[#E4E4E7] bg-white">
        <Mail className="size-6 text-[#18181B]" />
      </div>
      <AuthHeader
        title="Please verify your email"
        subtitle={
          email
            ? `We just sent an email to ${email}. Click the link in the email to verify your account.`
            : "We just sent you an email. Click the link in the email to verify your account."
        }
      />
      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className={BUTTON}
      >
        {resending ? "Sending…" : "Resend email"}
      </button>
      <p className="text-center text-base text-[#71717A]">
        <Link href="/login" className="text-[#2563EB] hover:underline">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
