"use client";
import { useState, useRef } from "react";
import { Upload, Info } from "lucide-react";
import ClientNotificationDropdown from "@/components/client/shared/ClientNotificationDropdown";
import Link from "next/link";

export default function ProfilePage() {
  const [name,  setName]  = useState("Alex Johnson");
  const [email, setEmail] = useState("alex.johnson@appointmanager.enterprise");
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);

  function confirmRemove() {
    setAvatar(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowConfirm(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500 grid place-items-center shrink-0">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="text-sm font-bold text-gray-800">ProfileManager</span>
        </div>
        <div className="flex items-center gap-3">
          <ClientNotificationDropdown />
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">Alex Johnson</p>
              <p className="text-xs text-gray-400">Senior Designer</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-500 grid place-items-center text-xs font-bold text-white">AJ</div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="px-4 md:px-12 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Personal Settings</h1>
        <p className="text-sm text-gray-400 mb-8">Manage your personal information and profile settings.</p>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

          {/* Avatar row */}
          <div className="flex items-center gap-6 mb-8">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-20 h-20 rounded-full object-cover shrink-0" />
              : <div className="w-20 h-20 rounded-full bg-gray-200 grid place-items-center text-2xl font-bold text-gray-500 shrink-0">AJ</div>
            }
            <div>
              <p className="text-base font-bold text-gray-800 mb-1">Alex Johnson</p>
              <p className="text-xs text-gray-400 mb-3">Upload a professional headshot. Recommended size is 256×256px.</p>
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
                  <Upload size={13} /> Upload New Photo
                </button>
                <button type="button" onClick={() => setShowConfirm(true)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/client/dashboard"
              className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
              Discard Changes
            </Link>
            <button type="button"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-orange-200">
              Save Changes
            </button>
          </div>
        </div>

        {/* Policy notice */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 mt-5">
          <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Enterprise Policy: Role and Department assignments can only be modified by the IT or HR departments. Please contact support for changes.
          </p>
        </div>

        {/* Google Account */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 bg-white">
              <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Google Account</p>
              <p className="text-xs text-gray-400">
                {googleConnected ? "Connected — Google Calendar & Meet enabled" : "Connect to enable Google Calendar & Meet integration"}
              </p>
            </div>
          </div>
          {googleConnected ? (
            <span className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 border border-green-200 bg-green-50 text-green-600 text-xs font-semibold rounded-lg">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Connected
            </span>
          ) : (
            <button type="button" onClick={() => setGoogleConnected(true)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg transition-colors shadow-sm">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Connect Google
            </button>
          )}
        </div>
      </main>
      {/* Confirm Remove Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 text-2xl">⚠</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Remove Photo?</h2>
            <p className="text-sm text-gray-500 mb-1">Are you sure you want to remove your profile photo?</p>
            <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <button onClick={confirmRemove}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl mb-3 transition-colors">
              Yes, Remove Photo
            </button>
            <button onClick={() => setShowConfirm(false)}
              className="w-full py-2.5 text-gray-500 hover:bg-gray-100 font-medium rounded-xl transition-colors text-sm">
              Keep Photo
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>✓</span> Profile photo removed successfully.
        </div>
      )}
    </div>
  );
}
