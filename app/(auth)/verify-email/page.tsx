import { VerifyEmailContent } from "@/components/auth/VerifyEmailContent";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;
  return <VerifyEmailContent token={token ?? null} email={email ?? null} />;
}
