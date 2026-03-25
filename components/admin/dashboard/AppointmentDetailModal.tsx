"use client";
import { X, Link as LinkIcon, Copy } from "lucide-react";
import { Appointment, STATUS_STYLE, STATUS_DOT } from "@/features/appointments/types";
import { useState } from "react";

type Props = {
  appointment: Appointment;
  onClose: () => void;
};

export default function AppointmentDetailModal({ appointment: a, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(a.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-7 pb-5 border-b border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
          <p className="text-xs text-orange-500 font-medium mt-0.5">{a.id}</p>
        </div>

        <div className="px-8 py-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Appointment Overview */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Appointment Overview
            </p>
            <div className="grid grid-cols-5 gap-5 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date</p>
                <p className="font-semibold text-gray-800">{a.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Time</p>
                <p className="font-semibold text-gray-800">{a.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Meeting Type</p>
                <p className="font-semibold text-gray-800">{a.meetingType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Department</p>
                <p className="font-semibold text-gray-800">{a.department}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Status</p>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                  {a.status}
                </span>
              </div>
            </div>
          </section>

          {/* Client & Employee */}
          <section className="grid grid-cols-2 gap-4">
            {/* Client */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Client Information
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${a.clientColor} grid place-items-center text-white text-base font-bold shrink-0`}>
                  {a.client[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{a.client}</p>
                  <p className="text-xs text-gray-400">{a.clientEmail}</p>
                </div>
              </div>
            </div>

            {/* Employee */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Employee Information
              </p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${a.employeeColor} grid place-items-center text-white text-base font-bold shrink-0`}>
                  {a.employee[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{a.employee}</p>
                  <p className="text-xs text-gray-400">{a.employeeEmail}</p>
                  <p className="text-xs text-orange-500 font-medium">{a.department} Department</p>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Details */}
          <section>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              Additional Details
            </p>

            {/* Notes */}
            <div className="bg-gray-50 rounded-lg p-5 mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Notes / Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{a.notes}</p>
            </div>

            {/* Meeting Link */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-5 py-4">
              <LinkIcon size={14} className="text-orange-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Meeting Link</p>
                <a
                  href={a.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-500 hover:underline truncate block"
                >
                  {a.meetingLink}
                </a>
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-orange-500 transition-colors shrink-0"
              >
                <Copy size={12} />
                {copied ? "COPIED!" : "COPY"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
