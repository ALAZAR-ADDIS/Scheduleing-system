"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { registerThunk, clearError, ROLE_REDIRECT } from "@/state/slices/auth/authSlice";

export default function RegisterPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector(s => s.auth);

  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [fieldErr, setFieldErr] = useState("");

  // Redirect once registered & logged in
  useEffect(() => {
    if (user) router.push(ROLE_REDIRECT[user.role]);
  }, [user, router]);

  function validate() {
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim())    return "Email address is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setFieldErr(err); return; }
    setFieldErr("");
    dispatch(clearError());
    dispatch(registerThunk(fullName.trim(), email.trim(), password) as any);
  }

  const displayError = fieldErr || error;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed right-0 top-0 h-full w-1.5 bg-gradient-to-b from-orange-400 via-indigo-500 to-indigo-700" />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm px-8 py-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mb-5 shadow-md">
          <UserPlus size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
        <p className="text-sm text-gray-500 text-center mb-7 leading-snug">
          Join AppointManager to manage your appointments seamlessly.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" placeholder="John Doe" value={fullName}
              onChange={e => { setFullName(e.target.value); setFieldErr(""); }}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input type="email" placeholder="name@example.com" value={email}
              onChange={e => { setEmail(e.target.value); setFieldErr(""); }}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} placeholder="Min. 6 characters" value={password}
                onChange={e => { setPassword(e.target.value); setFieldErr(""); }}
                className="w-full px-3 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {displayError && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{displayError}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-sm">
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><UserPlus size={15} /> Create Account</>}
          </button>
        </form>

        <div className="w-full border-t border-gray-100 mt-6 mb-4" />
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-orange-500 font-medium hover:underline">Sign in</Link>
        </p>
      </div>

      <p className="text-xs text-gray-400 mt-5">© 2025 AppointManager. All rights reserved.</p>
    </div>
  );
}
