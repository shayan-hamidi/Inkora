import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/features/authentication/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-20 sm:px-6">
      <div className="space-y-3">
        <p className="text-meta">Account</p>
        <h1 className="font-heading text-4xl text-ink">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
      <ResetPasswordForm />
    </div>
  );
}
