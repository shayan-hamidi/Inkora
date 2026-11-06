import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/features/authentication/components/register-form";

export const metadata: Metadata = {
  title: "Join",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-20 sm:px-6">
      <div className="space-y-3">
        <p className="text-meta">Account</p>
        <h1 className="font-heading text-4xl text-ink">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Already have one?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
