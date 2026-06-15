"use client";
import { Briefcase } from "lucide-react";
import { OtpInput } from "@/components/otp-input";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  VerifyResetTokenInput,
  verifyResetTokenSchema,
} from "@/lib/schemas/auth";
import { clientPost } from "@/lib/client-auth";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RESEND_COOLDOWN = 60;
const STORAGE_KEY = "otp_expires_at";

export default function VerifyResetOtpPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [resendOtpMessage, setResendOtpMessage] = useState("");
  const [resendOtpServerError, setResendOtpServerError] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyResetTokenInput>({
    resolver: zodResolver(verifyResetTokenSchema),
    defaultValues: {
      email: email,
      token: "",
    },
  });

  const onSubmit = async (values: VerifyResetTokenInput) => {
    setServerError("");
    setMessage("");
    if (!email) return;
    try {
      const res = await clientPost<{ message?: string; expires_in?: string }>(
        "/api/auth/verify-reset-password-token",
        {
          email: email,
          token: values.token,
        },
      );
      setMessage(res.message || "Email verification successful");
      router.push("/reset-password");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Email verification failed",
      );
    }
  };

  useEffect(() => {
    const expiresAt = localStorage.getItem(STORAGE_KEY);
    if (!expiresAt) return;

    const diff = Math.max(0, Math.ceil(Number(expiresAt) - Date.now()) / 1000);
    setSecondsLeft(diff);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      const expiresAt = localStorage.getItem(STORAGE_KEY);
      if (!expiresAt) {
        setSecondsLeft(0);
        clearInterval(timer);
        return;
      }
      const diff = Math.max(
        0,
        Math.ceil(Number(expiresAt) - Date.now()) / 1000,
      );
      setSecondsLeft(diff);

      if (diff <= 0) {
        localStorage.removeItem(STORAGE_KEY);
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    setEmail(sessionStorage.getItem("verify_reset_otp") || "");
  }, []);

  const handleResendOtp = async (e: React.FormEvent) => {
    if (secondsLeft > 0 || isResending) return;
    if (!email) return;
    e.preventDefault();
    setResendOtpServerError("");
    setResendOtpMessage("");
    setIsResending(true);
    try {
      const res = await clientPost<{ message: string; success: boolean }>(
        "api/auth/resend-otp",
        { email: email },
      );
      setResendOtpMessage(res.message || "Otp resend successfully");
      const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;
      localStorage.setItem(STORAGE_KEY, expiresAt.toString());
      setSecondsLeft(RESEND_COOLDOWN);
    } catch (error) {
      setResendOtpServerError(
        error instanceof Error ? error.message : "Otp resend failed failed",
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-card p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-primary blur-3xl" />
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
            Verify your reset code
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-md">
            Enter the 6-digit verification code sent to your email to continue
            resetting your password.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-4">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "50K+", label: "Jobs Tracked" },
              { value: "85%", label: "Success Rate" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-lg bg-secondary/50 p-4">
          <p className="text-sm text-muted-foreground italic">
            &quot;JobTracker helped me organize my job search and I landed my
            dream role in just 3 weeks!&quot;
          </p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">SK</span>
            </div>
            <div>
              <div className="text-xs font-medium text-foreground">
                Sarah K.
              </div>
              <div className="text-xs text-muted-foreground">
                Software Engineer at Google
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
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
              Enter verification code
            </h2>
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">
                {watch("email") || "your email"}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <div className="relative space-y-2">
                <Controller
                  name="token"
                  control={control}
                  render={({ field }) => (
                    <OtpInput
                      value={field.value}
                      onChange={field.onChange}
                      length={6}
                    />
                  )}
                />
                {errors.token && (
                  <p className="text-center text-xs text-destructive">
                    {errors.token.message}
                  </p>
                )}
              </div>
            </div>
            {/* Submit Button */}
            <div className="space-y-2">
              {
                <Button type="submit" className="w-full" size="lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify code
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              }{" "}
              {message && (
                <p className="text-xs text-center text-green-600">{message}</p>
              )}
              {serverError && (
                <p className="text-xs text-center text-red-600">
                  {serverError}
                </p>
              )}
            </div>
            <Button
              type="button"
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              size="lg"
              onClick={handleResendOtp}
              disabled={secondsLeft > 0 || isResending}
            >
              {isResending
                ? "Resending..."
                : secondsLeft > 0
                  ? `Resend OTP in ${secondsLeft}s`
                  : "Resend OTP"}
            </Button>
            {resendOtpServerError && (
              <p className="text-center text-xs text-destructive">
                {resendOtpServerError}
              </p>
            )}
            {resendOtpMessage && (
              <p className="mt-2 text-center text-xs text-green-600">
                {resendOtpMessage}
              </p>
            )}
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Didn&apos;t receive the code? Check your spam folder or resend it.
            Wrong email?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Change email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
