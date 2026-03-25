"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { loginThunk, clearError, ROLE_REDIRECT } from "@/state/slices/auth/authSlice";

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(s => s.auth);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [fieldErr, setFieldErr] = useState("");

  // Redirect once logged in
  useEffect(() => {
    if (user) router.push(ROLE_REDIRECT[user.role]);
  }, [user, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setFieldErr("Please fill in all fields."); return; }
    setFieldErr("");
    dispatch(clearError());
    dispatch(loginThunk(email, password) as any);
  }

  const displayError = fieldErr || error;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed right-0 top-0 h-full w-1.5 bg-gradient-to-b from-orange-400 via-indigo-500 to-indigo-700" />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-5 shadow-md">
          <Lock size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
        <p className="text-sm text-orange-500 text-center mb-7 leading-snug">
          Sign in to access your portal.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setFieldErr(""); }}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPw ? "text" : "password"} placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setFieldErr(""); }}
                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link href="/auth/forgot-password" className="text-xs text-orange-500 hover:underline">Forgot Password?</Link>
            </div>
          </div>

          {displayError && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{displayError}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><LogIn size={15} /> Sign In</>}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="w-full mt-5 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Demo Accounts</p>
          {[
            { label: "Admin",    email: "admin@appointmanager.com", pw: "admin123"    },
            { label: "Employee", email: "sarah@appointmanager.com",  pw: "employee123" },
            { label: "Client",   email: "client@example.com",        pw: "client123"   },
          ].map(({ label, email: e, pw }) => (
            <button key={label} type="button"
              onClick={() => { setEmail(e); setPassword(pw); setFieldErr(""); dispatch(clearError()); }}
              className="w-full text-left hover:bg-orange-50 rounded-lg px-2 py-1 transition-colors">
              <p className="text-xs font-medium text-orange-500">{label}</p>
              <p className="text-xs text-gray-400">{e} · {pw}</p>
            </button>
          ))}
        </div>

        <div className="w-full border-t border-gray-100 mt-6 mb-4" />
        <p className="text-xs text-gray-400 tracking-widest uppercase text-center">AppointManager Portal</p>
      </div>

      <p className="text-xs text-gray-400 mt-5">© 2025 AppointManager. All rights reserved.</p>
      <p className="text-xs text-gray-400 mt-1">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-orange-500 hover:underline font-medium">Create one</Link>
      </p>
    </div>
  );
}
