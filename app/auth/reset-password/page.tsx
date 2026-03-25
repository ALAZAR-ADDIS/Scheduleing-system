"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, XCircle, ArrowRight } from "lucide-react";

type Toast = { type: "success" | "error"; message: string };

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew,   setShowNew]   = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [toasts,    setToasts]    = useState<Toast[]>([]);

  function addToast(t: Toast) {
    setToasts((prev) => [...prev, t]);
    setTimeout(() => setToasts((prev) => prev.slice(1)), 3500);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newPw || !confirmPw) { addToast({ type: "error", message: "Please fill in all fields." }); return; }
    if (newPw.length < 8)     { addToast({ type: "error", message: "Password must be at least 8 characters." }); return; }
    if (newPw !== confirmPw)  { addToast({ type: "error", message: "Passwords do not match" }); return; }
    addToast({ type: "success", message: "Password reset successfully!" });
    setNewPw(""); setConfirmPw("");
    // TODO: call reset-password API
    setTimeout(() => router.push("/auth/login"), 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">

      {/* Toasts */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t, i) => (
          <div key={i} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg shadow text-sm font-medium border ${
            t.type === "success"
              ? "bg-white border-green-200 text-green-700"
              : "bg-white border-red-200 text-red-600"
          }`}>
            {t.type === "success"
              ? <CheckCircle size={15} className="text-green-500 shrink-0" />
              : <XCircle    size={15} className="text-red-500 shrink-0" />}
            {t.message}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center">

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-5 shadow-md">
          <Lock size={24} className="text-white" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
        <p className="text-sm text-gray-500 text-center mb-7 leading-relaxed">
          Create a strong password to protect your account. Use at least 8 characters with a mix of letters and numbers.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300"
              />
              <button type="button" onClick={() => setShowNew(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConf ? "text" : "password"}
                placeholder="Confirm your new password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300"
              />
              <button type="button" onClick={() => setShowConf(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button type="submit"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            Reset Password <ArrowRight size={15} />
          </button>
        </form>

        {/* Back to login */}
        <Link href="/auth/login"
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mt-6 transition-colors">
          <ArrowLeft size={14} /> Back to Login
        </Link>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6">© 2024 Super Admin Portal. All rights reserved.</p>
      <div className="flex gap-4 mt-1">
        <Link href="#" className="text-xs text-gray-400 hover:underline">Privacy Policy</Link>
        <Link href="#" className="text-xs text-gray-400 hover:underline">Terms of Service</Link>
      </div>
    </div>
  );
}
