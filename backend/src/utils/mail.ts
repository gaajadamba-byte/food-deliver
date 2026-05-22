import { Resend } from "resend";
import { env } from "../config/env";
import { AppError } from "./AppError";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

/**
 * Sends an email through Resend. When no API key is configured (dev), the
 * message is logged to the console so flows stay testable without Resend.
 */
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
  if (!resend) {
    console.log(
      `\n──────── [dev mail] ────────\nTo: ${to}\nSubject: ${subject}\n${html}\n────────────────────────────\n`,
    );
    return;
  }

  const { error } = await resend.emails.send({ from: env.MAIL_FROM, to, subject, html });
  if (error) {
    throw new AppError(502, `Failed to send email: ${error.message}`);
  }
}
