import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/features/authentication/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-20 sm:px-6">
      <div className="space-y-3">
        <p className="text-meta">Account</p>
        <h1 className="font-heading text-4xl text-ink">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
