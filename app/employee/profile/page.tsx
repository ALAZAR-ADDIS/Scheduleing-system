"use client";
import { useState, useRef } from "react";
import { Info } from "lucide-react";

const GOOGLE_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function EmployeeProfilePage() {
  const [form, setForm] = useState({
    fullName:   "Sarah Johnson",
    email:      "sarah.johnson@appointmanager.enterprise",
    role:       "HR Manager",
    department: "Human Resources",
  });
  const [photo,           setPhoto]           = useState<string | null>(null);
  const [saved,           setSaved]           = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    e.target.value = "";
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>✓</span> Changes saved successfully!
        </div>
      )}

      <header className="bg-white border-b border-gray-100 px-6 py-4 shrink-0">
        <h1 className="text-base font-bold text-gray-800">Personal Settings</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your personal information and profile settings</p>
      </header>

      <main className="flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-xl">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gray-200 grid place-items-center text-2xl font-bold text-gray-500 mb-3 overflow-hidden shrink-0">
              {photo ? <img src={photo} alt="avatar" className="w-full h-full object-cover" /> : "SJ"}
            </div>
            <p className="text-base font-bold text-gray-800 mb-0.5">{form.fullName}</p>
            <p className="text-xs text-gray-400 mb-3">Upload a professional headshot. Recommended size is 256×256px.</p>
            <div className="flex items-center gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              <button type="button" onClick={() => fileRef.current?.click()}
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
                Upload New Photo
              </button>
              <button type="button" onClick={() => setPhoto(null)} disabled={!photo}
                className="px-4 py-1.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-semibold rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                Remove
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
              <input type="text" value={form.fullName}
                onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
              <input type="email" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 bg-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
              <input type="text" value={form.role} readOnly
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Department</label>
              <input type="text" value={form.department} readOnly
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg text-gray-400 bg-gray-50 cursor-not-allowed" />
            </div>
          </div>

          {/* Info notice */}
          <div className="flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
            <Info size={15} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-500">
              Enterprise Policy: Role and Department assignments can only be modified by the IT or HR departments. Please contact support for changes.
            </p>
          </div>

          {/* Google Account */}
          <div className="border border-gray-100 rounded-xl px-4 py-4 mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center shrink-0 bg-white">
                {GOOGLE_ICON}
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
                {GOOGLE_ICON} Connect Google
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button type="button"
              onClick={() => setForm({ fullName: "Sarah Johnson", email: "sarah.johnson@appointmanager.enterprise", role: "HR Manager", department: "Human Resources" })}
              className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg transition-colors">
              Discard Changes
            </button>
            <button type="button" onClick={handleSave}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
              Save Changes
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
