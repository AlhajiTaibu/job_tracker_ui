import type { Metadata } from "next";
import RegisterPageClient from "./register-client";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterPage() {
  return <RegisterPageClient />;
}
