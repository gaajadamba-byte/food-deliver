import { env } from "../../config/env";
import type { User } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import {
  signAccessToken,
  signActionToken,
  signRefreshToken,
  verifyActionToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import { sendMail } from "../../utils/mail";
import { comparePassword, hashPassword } from "../../utils/password";
import type {
  EmailInput,
  ResetPasswordInput,
  SignInInput,
  SignUpInput,
} from "./auth.schema";

/** Removes sensitive fields before sending a user back to the client. */
function toSafeUser(user: User) {
  const { password, ttl, ...safe } = user;
  return safe;
}

function issueTokens(user: User) {
  const payload = { userId: user.id, role: user.role };
  return {
    user: toSafeUser(user),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

async function sendVerificationEmail(user: User) {
  const token = signActionToken(
    user.id,
    "verify-email",
    env.VERIFY_TOKEN_EXPIRES_MIN,
  );
  await prisma.user.update({
    where: { id: user.id },
    data: { ttl: new Date() },
  });

  const link = `${env.CLIENT_URL}/verify-email?token=${token}`;
  await sendMail(
    user.email,
    "Verify your email",
    `<p>Welcome! Please confirm your email to activate your account.</p>
     <p><a href="${link}">${link}</a></p>`,
  );
}

export async function signUp(input: SignUpInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing) {
    throw new AppError(409, "Email already registered");
  }

  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: await hashPassword(input.password),
      phoneNumber: input.phoneNumber,
      address: input.address,
      isVerified: false,
    },
  });

  // A failed verification email must not orphan the freshly created account —
  // the user can always trigger resend-verification afterwards.
  let emailSent = true;
  try {
    await sendVerificationEmail(user);
  } catch (error) {
    emailSent = false;
    console.error("[sign-up] verification email failed:", error);
  }

  return {
    user: toSafeUser(user),
    message: emailSent
      ? "Account created. Check your email to verify your account."
      : "Account created, but the verification email could not be sent. Use resend-verification to retry.",
  };
}

export async function verifyEmail(token: string) {
  if (!token) {
    throw new AppError(400, "Token is required");
  }

  let payload;
  try {
    payload = verifyActionToken(token, "verify-email");
  } catch {
    throw new AppError(400, "Verification link is invalid or has expired");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AppError(404, "User no longer exists");
  }

  const verifiedUser = user.isVerified
    ? user
    : await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });

  // Log the user in straight after a successful verification.
  return issueTokens(verifiedUser);
}

export async function resendVerification(input: EmailInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (user && !user.isVerified) {
    await sendVerificationEmail(user);
  }
  return {
    message:
      "If that account exists and is unverified, a new link has been sent.",
  };
}

export async function signIn(input: SignInInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, "Incorrect email or password");
  }

  const passwordMatches = await comparePassword(input.password, user.password);
  if (!passwordMatches) {
    throw new AppError(401, "Incorrect email or password");
  }

  if (!user.isVerified) {
    throw new AppError(403, "Please verify your email before signing in");
  }

  return issueTokens(user);
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User no longer exists");
  }
  return toSafeUser(user);
}

export async function refresh(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AppError(401, "User no longer exists");
  }

  return { accessToken: signAccessToken({ userId: user.id, role: user.role }) };
}

export async function requestPasswordReset(input: EmailInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Always respond the same way so we do not leak which emails are registered.
  if (user) {
    const token = signActionToken(
      user.id,
      "reset-password",
      env.RESET_TOKEN_EXPIRES_MIN,
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { ttl: new Date() },
    });

    const link = `${env.CLIENT_URL}/reset-password?token=${token}`;
    await sendMail(
      user.email,
      "Reset your password",
      `<p>You requested a password reset.</p>
       <p>This link expires in ${env.RESET_TOKEN_EXPIRES_MIN} minutes:</p>
       <p><a href="${link}">${link}</a></p>
       <p>If you did not request this, you can ignore this email.</p>`,
    );
  }

  return {
    message: "If that email is registered, a reset link has been sent.",
  };
}

export async function verifyResetToken(token: string) {
  if (!token) {
    throw new AppError(400, "Token is required");
  }
  try {
    verifyActionToken(token, "reset-password");
  } catch {
    throw new AppError(400, "Reset link is invalid or has expired");
  }
  return { valid: true };
}

export async function resetPassword(input: ResetPasswordInput) {
  let payload;
  try {
    payload = verifyActionToken(input.token, "reset-password");
  } catch {
    throw new AppError(400, "Reset link is invalid or has expired");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AppError(404, "User no longer exists");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(input.password) },
  });

  return { message: "Password has been reset successfully." };
}
