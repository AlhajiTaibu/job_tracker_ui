"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/schemas/auth";
import { clientPost } from "@/lib/client-auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const onSubmit = async (values: ResetPasswordInput) => {
    setMessage("");
    setServerError("");
    try {
      const res = await clientPost<{ message?: string }>(
        "/api/auth/reset-password",
        values,
      );
      setMessage(res.message || "Password Reset Successfully");
      router.replace("/login");
    } catch (error) {
      setServerError(
        error instanceof Error ? error?.message : "Password reset failed",
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
        <div
          onClick={() => router.push("/")}
          className="relative z-10 flex items-center gap-3 cursor-pointer"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Briefcase className="h-5 w-5 shrink-0 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            JobTracker
          </span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-foreground text-balance">
            Create a new password
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-md">
            Choose a strong new password for your account so you can securely
            get back to tracking applications and managing your job search.
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
        <div
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-3 lg:hidden cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
            <Briefcase className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">
            JobTracker
          </span>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">
              Reset password
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your new password below to complete your password reset.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  New password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  {...register("password")}
                  className="pl-10 pr-10"
                  required
                />
                {errors.password && (
                  <p className="text-center text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {errors.password && (
                  <p className="text-center text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="confirm_password"
                  className="text-sm font-medium text-foreground"
                >
                  Confirm password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  {...register("confirmPassword")}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-center text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
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
                  Updating password...
                </>
              ) : (
                <>
                  Update password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            {message && (
              <p className="text-xs text-center text-green-600">{message}</p>
            )}
            {serverError && (
              <p className="text-xs text-center text-red-600">{serverError}</p>
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
