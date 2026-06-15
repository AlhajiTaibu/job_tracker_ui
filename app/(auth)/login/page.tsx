import type { Metadata } from "next";
import LoginPageClient from "./login-client";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return <LoginPageClient />;
}
