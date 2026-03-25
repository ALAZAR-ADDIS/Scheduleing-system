"use client";
import { useState } from "react";
import { UserPlus, RefreshCw, X, Check } from "lucide-react";

const DEPARTMENTS = [
  "Design",
  "Marketing",
  "Sales",
  "Engineering",
  "HR",
  "Finance",
  "IT",
];

const ROLES: Record<string, string[]> = {
  Design:      ["Sr. UI Designer", "Brand Designer", "UX Researcher", "Motion Designer"],
  Marketing:   ["Growth Lead", "Content Strategist", "SEO Specialist", "Campaign Manager"],
  Sales:       ["Sales Executive", "Account Manager", "Business Developer", "Sales Analyst"],
  Engineering: ["Backend Engineer", "Frontend Engineer", "DevOps Engineer", "Full Stack Dev"],
  HR:          ["HR Manager", "Recruiter", "HR Analyst", "Training Coordinator"],
  Finance:     ["Financial Analyst", "Budget Analyst", "Accountant", "Finance Manager"],
  IT:          ["IT Specialist", "Network Engineer", "System Admin", "Security Analyst"],
};

export default function ManageAccountPage() {
  const [fullName,   setFullName]   = useState("");
  const [email,      setEmail]      = useState("");
  const [department, setDepartment] = useState("");
  const [role,       setRole]       = useState("");
  const [success,    setSuccess]    = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const availableRoles = department ? ROLES[department] ?? [] : [];

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim())  e.fullName   = "Full name is required";
    if (!email.trim())     e.email      = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!department)       e.department = "Please select a department";
    if (!role)             e.role       = "Please select a role";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSuccess(true);
    setFullName("");
    setEmail("");
    setDepartment("");
    setRole("");
    setTimeout(() => setSuccess(false), 4000);
  }

  function handleCancel() {
    setFullName("");
    setEmail("");
    setDepartment("");
    setRole("");
    setErrors({});
  }

  return (
    <div className="p-6 space-y-5">
      {/* Page title */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded grid place-items-center">
          <UserPlus size={13} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Add New Employee</h1>
      </div>

      {/* Success toast */}
      {success && (
        <div className="flex items-center justify-between gap-3 bg-white border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl shadow-sm max-w-sm mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full grid place-items-center shrink-0">
              <Check size={11} className="text-white" />
            </div>
            Employee created successfully!
          </div>
          <button type="button" onClick={() => setSuccess(false)} className="text-green-400 hover:text-green-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Form card */}
      <div className="max-w-xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-bold text-gray-800">Add New Employee</h2>
        <p className="text-sm text-gray-400 mt-1 mb-6">Fill in the details below to create a new employee account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-gray-700 placeholder:text-gray-300 ${
                errors.fullName ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="john.doe@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-gray-700 placeholder:text-gray-300 ${
                errors.email ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Department + Role */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => { setDepartment(e.target.value); setRole(""); }}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 bg-white text-gray-700 ${
                  errors.department ? "border-red-300" : "border-gray-200"
                }`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={!department}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.role ? "border-red-300" : "border-gray-200"
                }`}
              >
                <option value="">Select Role</option>
                {availableRoles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
            </div>
          </div>

          {/* Password notice */}
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3">
            <RefreshCw size={14} className="text-orange-400 shrink-0" />
            <p className="text-sm text-orange-500 font-medium">
              Password will be randomly generated and sent via email
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
