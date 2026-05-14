"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/schemas/auth";
import { clientPost } from "@/lib/client-auth";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const onSubmit = async (values: ForgotPasswordInput) => {
    setMessage("");
    setServerError("");

    try {
      const res = await clientPost<{ message?: string }>(
        "/api/auth/forgot-password",
        values,
      );
      setMessage(res.message || "Forgot Password verification code sent");
      sessionStorage.setItem("verify_reset_otp", values.email);
      router.push("/verify-reset-otp");
    } catch (error) {
      setServerError(
        error instanceof Error ? error?.message : "Forgot Password Send failed",
      );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-card p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-primary blur-3xl" />
          <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-accent blur-3xl" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            JobTracker
          </span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-foreground text-balance">
            Forgot your password?
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-md">
            Enter your email address and we’ll send you a 6-digit verification
            code to reset your password.
          </p>

          {/* Feature List */}
          <div className="space-y-4 pt-4">
            {[
              "Kanban board to visualize your pipeline",
              "Analytics to track your success rate",
              "Contact management for networking",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-muted-foreground">
          Trusted by thousands of job seekers worldwide
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-24">
        {/* Mobile Logo */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            JobTracker
          </span>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Reset your password
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter the email associated with your account and we&apos;ll send
              you a one-time verification code.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="pl-10"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending verification code ...
                </>
              ) : (
                <>
                  Send verification code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {message && <p className="text-xs text-green-600">{message}</p>}
            {serverError && (
              <p className="text-xs text-red-600">{serverError}</p>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
