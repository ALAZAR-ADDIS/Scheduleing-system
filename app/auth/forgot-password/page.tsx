"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setError("");
    // TODO: call send-OTP API, then navigate
    router.push("/auth/reset-password");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center">

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-5 shadow-md">
          <Lock size={24} className="text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
        <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
          Enter your registered email address below and we'll send you a 6-digit OTP to verify your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300"
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button type="submit"
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            Send OTP
          </button>
        </form>

        {/* Back to login */}
        <Link href="/auth/login"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-6 transition-colors">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6">© 2024 AppointManager. All rights reserved.</p>
    </div>
  );
}
