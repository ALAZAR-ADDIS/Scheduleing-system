"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ClientNotificationDropdown from "@/components/client/shared/ClientNotificationDropdown";
import { CalendarDays, Users, Video, TrendingUp, Search, ChevronLeft, ChevronRight, X, MapPin, Star, ArrowUp, ArrowDown, ArrowUpDown, Clock } from "lucide-react";

const ALL_SLOTS = ["09:00 AM - 10:00 AM","10:15 AM - 11:15 AM","12:00 PM - 01:00 PM","01:30 PM - 02:30 PM","03:00 PM - 04:00 PM","04:15 PM - 05:15 PM"];
const MONTHS    = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["SU","MO","TU","WE","TH","FR","SA"];
function pad(n: number) { return String(n).padStart(2, "0"); }
function toKey(y: number, m: number, d: number) { return `${y}-${pad(m+1)}-${pad(d)}`; }

type AppStatus = "Scheduled" | "Completed" | "Cancelled";
type AppType   = "Google Meet" | "In-person";

type Appointment = {
  id: number;
  date: string;
  employee: string;
  department: string;
  type: AppType;
  status: AppStatus;
  notes: string;
  meetLink?: string;
  location?: string;
};

const APPOINTMENTS: Appointment[] = [
  { id: 1,  date: "Nov 10, 10:00 AM", employee: "Sarah Johnson", department: "Human Resources",      type: "Google Meet", status: "Scheduled",  notes: "Discuss onboarding process and HR policies for new team members.", meetLink: "https://meet.google.com/abc-defg-hij" },
  { id: 2,  date: "Nov 08, 02:00 PM", employee: "Michael Chen",  department: "Financial Consulting", type: "In-person",   status: "Scheduled",  notes: "Q4 budget planning and financial forecast review.", location: "Room 204, Finance Building" },
  { id: 3,  date: "Nov 06, 09:30 AM", employee: "David Ross",    department: "IT Support",           type: "Google Meet", status: "Scheduled",  notes: "Cloud migration strategy and infrastructure planning.", meetLink: "https://meet.google.com/xyz-uvwx-yz1" },
  { id: 4,  date: "Nov 03, 11:00 AM", employee: "Alex Rivera",   department: "Engineering",          type: "In-person",   status: "Scheduled",  notes: "Sprint planning and architecture review for Q4 roadmap.", location: "Engineering Lab, Floor 3" },
  { id: 5,  date: "Oct 30, 03:00 PM", employee: "Sarah Chen",    department: "HR",                   type: "Google Meet", status: "Scheduled",  notes: "Performance review and career development discussion.", meetLink: "https://meet.google.com/pqr-stuv-wx2" },
  { id: 6,  date: "Oct 28, 10:00 AM", employee: "Jordan Smith",  department: "Finance",              type: "In-person",   status: "Completed",  notes: "Investment portfolio analysis and risk assessment.", location: "Conference Room A" },
  { id: 7,  date: "Oct 25, 01:30 PM", employee: "Taylor Vane",   department: "Sales",                type: "Google Meet", status: "Completed",  notes: "Enterprise client pitch preparation and strategy alignment.", meetLink: "https://meet.google.com/lmn-opqr-st3" },
  { id: 8,  date: "Oct 22, 02:00 PM", employee: "Morgan Lee",    department: "Management",           type: "In-person",   status: "Completed",  notes: "Project milestone review and team performance evaluation.", location: "Executive Suite, Floor 5" },
  { id: 9,  date: "Oct 20, 11:00 AM", employee: "Casey Wright",  department: "Engineering",          type: "Google Meet", status: "Completed",  notes: "Frontend architecture discussion and code review session.", meetLink: "https://meet.google.com/efg-hijk-lm4" },
  { id: 10, date: "Oct 18, 09:00 AM", employee: "Sarah Johnson", department: "Human Resources",      type: "In-person",   status: "Completed",  notes: "Annual benefits review and policy update briefing.", location: "HR Office, Floor 2" },
  { id: 11, date: "Oct 15, 04:00 PM", employee: "Michael Chen",  department: "Financial Consulting", type: "Google Meet", status: "Completed",  notes: "Tax planning strategy for the upcoming fiscal year.", meetLink: "https://meet.google.com/nop-qrst-uv5" },
  { id: 12, date: "Oct 12, 10:00 AM", employee: "David Ross",    department: "IT Support",           type: "In-person",   status: "Completed",  notes: "Network infrastructure upgrade planning and security audit.", location: "IT Department, Basement" },
  { id: 13, date: "Oct 10, 02:30 PM", employee: "Alex Rivera",   department: "Engineering",          type: "Google Meet", status: "Cancelled",  notes: "System design review — cancelled due to team conflict.", meetLink: "https://meet.google.com/aaa-bbbb-cc1" },
  { id: 14, date: "Oct 08, 11:00 AM", employee: "Jordan Smith",  department: "Finance",              type: "In-person",   status: "Cancelled",  notes: "Budget reconciliation meeting — rescheduled by finance team.", location: "Conference Room B" },
  { id: 15, date: "Oct 05, 09:00 AM", employee: "Taylor Vane",   department: "Sales",                type: "Google Meet", status: "Cancelled",  notes: "Client onboarding call — client requested cancellation.", meetLink: "https://meet.google.com/ddd-eeee-ff2" },
  { id: 16, date: "Oct 03, 03:30 PM", employee: "Casey Wright",  department: "Engineering",          type: "In-person",   status: "Completed",  notes: "Backend API design and database schema review.", location: "Engineering Lab, Floor 3" },
  { id: 17, date: "Sep 30, 10:00 AM", employee: "Morgan Lee",    department: "Management",           type: "Google Meet", status: "Completed",  notes: "Quarterly OKR review and goal alignment session.", meetLink: "https://meet.google.com/ggg-hhhh-ii3" },
  { id: 18, date: "Sep 27, 01:00 PM", employee: "Sarah Chen",    department: "HR",                   type: "In-person",   status: "Completed",  notes: "Employee wellness program planning and policy updates.", location: "HR Office, Floor 2" },
  { id: 19, date: "Sep 25, 11:30 AM", employee: "David Ross",    department: "IT Support",           type: "Google Meet", status: "Cancelled",  notes: "Security audit follow-up — postponed pending report.", meetLink: "https://meet.google.com/jjj-kkkk-ll4" },
  { id: 20, date: "Sep 22, 09:00 AM", employee: "Michael Chen",  department: "Financial Consulting", type: "In-person",   status: "Completed",  notes: "Annual financial health check and investment review.", location: "Room 204, Finance Building" },
];

const PAGE_SIZE = 10;

const STATUS_STYLE: Record<AppStatus, string> = {
  Scheduled: "bg-blue-50 text-blue-600",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

// ── Reschedule Confirm Sheet ──────────────────────────────────────────────────
function RescheduleConfirmSheet({ appt, date, slot, onClose, onConfirm }: {
  appt: Appointment; date: string; slot: string; onClose: () => void; onConfirm: () => void;
}) {
  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-7 text-center relative" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"><X size={15} /></button>
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Reschedule Confirmed!</h2>
        <p className="text-sm text-gray-400 mb-6">Your appointment with <span className="font-semibold text-gray-600">{appt.employee}</span> has been successfully rescheduled.</p>
        <div className="bg-gray-50 rounded-xl divide-y divide-gray-100 mb-6 text-left">
          <div className="flex items-center gap-3 px-4 py-3">
            <CalendarDays size={15} className="text-orange-400 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Date</p>
              <p className="text-sm font-semibold text-gray-700">{dateLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-3">
            <Clock size={15} className="text-orange-400 shrink-0" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Time</p>
              <p className="text-sm font-semibold text-gray-700">{slot} <span className="text-xs text-gray-400 font-normal">(1 Hour)</span></p>
            </div>
          </div>
        </div>
        <button type="button" onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-md">
          <CalendarDays size={15} /> Reschedule Appointment
        </button>
        <p className="text-xs text-gray-400 mt-3">A calendar invitation will be sent to your official email</p>
      </div>
    </div>
  );
}

// ── Reschedule Modal ──────────────────────────────────────────────────────────
function RescheduleModal({ appt, onClose, onConfirm }: {
  appt: Appointment; onClose: () => void; onConfirm: (date: string, slot: string) => void;
}) {
  const today = new Date(); today.setHours(0,0,0,0);
  const windowEnd = new Date(today); windowEnd.setDate(today.getDate() + 29);
  const initKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]   = useState(initKey);
  const [selSlot,   setSelSlot]   = useState("");
  const [meetType,  setMeetType]  = useState<"in-person" | "google-meet">(appt.type === "Google Meet" ? "google-meet" : "in-person");
  const [note,      setNote]      = useState("");

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); }
  const selDateLabel = new Date(selDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={e => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 flex overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>
        {/* Left panel */}
        <div className="w-56 shrink-0 bg-gray-50 border-r border-gray-100 flex flex-col p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-orange-100 grid place-items-center text-orange-500 text-xl font-bold mb-3">
              {appt.employee.split(" ").map(n => n[0]).join("")}
            </div>
            <p className="text-sm font-bold text-gray-800">{appt.employee}</p>
            <p className="text-xs text-gray-400 mt-0.5">{appt.department}</p>
          </div>
          <div className="space-y-3 text-xs">
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Current Date</p>
              <p className="text-gray-700 font-medium">{appt.date}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Duration</p>
              <p className="text-gray-700 font-medium">60 minutes</p>
            </div>
          </div>
        </div>
        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-800">Reschedule Appointment</h2>
              <p className="text-xs text-gray-400 mt-0.5">Pick a new date and time slot</p>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="flex gap-5">
              {/* Calendar */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select New Date</p>
                <div className="flex items-center justify-between mb-3">
                  <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronLeft size={14} /></button>
                  <span className="text-sm font-semibold text-gray-700">{MONTHS[viewMonth]} {viewYear}</span>
                  <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 text-gray-500"><ChevronRight size={14} /></button>
                </div>
                <div className="grid grid-cols-7 mb-1">
                  {DAYS_SHORT.map(d => <div key={d} className="text-center text-[10px] text-gray-400 font-semibold py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {cells.map((day, i) => {
                    if (!day) return <div key={i} />;
                    const key = toKey(viewYear, viewMonth, day);
                    const cellDate = new Date(viewYear, viewMonth, day);
                    const isToday = cellDate.getTime() === today.getTime();
                    const isSel   = key === selDate;
                    const inWindow = cellDate >= today && cellDate <= windowEnd;
                    return (
                      <button key={i} type="button" onClick={() => inWindow && setSelDate(key)}
                        className={`mx-auto w-8 h-8 rounded-full text-xs font-medium transition-colors flex items-center justify-center
                          ${isSel ? "bg-orange-500 text-white" : isToday ? "bg-orange-100 text-orange-600 font-bold" : inWindow ? "hover:bg-orange-50 text-gray-700 cursor-pointer" : "text-gray-300 cursor-default"}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Slots */}
              <div className="w-44 shrink-0 flex flex-col" style={{maxHeight:"260px"}}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Slots</p>
                <p className="text-[10px] text-orange-500 font-medium mb-2 flex items-center gap-1"><CalendarDays size={10} /> {selDateLabel}</p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" /> Selected</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-orange-50 border border-orange-200 inline-block" /> Free</span>
                </div>
                <div className="overflow-y-auto flex-1 space-y-2 pr-1">
                  {ALL_SLOTS.map(slot => {
                    const isSel = selSlot === slot;
                    return (
                      <button key={slot} type="button" onClick={() => setSelSlot(slot)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors
                          ${isSel ? "bg-orange-500 text-white border-orange-500" : "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100"}`}>
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Meeting type */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Meeting Type</p>
              <div className="flex items-center gap-3">
                {([["in-person","In-person",Users],["google-meet","Google Meet",Video]] as const).map(([val, label, Icon]) => {
                  const active = meetType === val;
                  return (
                    <button key={val} type="button" onClick={() => setMeetType(val)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                        active ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? "bg-orange-500" : "bg-gray-100"}`}>
                        <Icon size={14} className={active ? "text-white" : "text-gray-400"} />
                      </div>
                      {label}
                      {active && <span className="ml-auto w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-2.5 h-2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Note */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Note <span className="text-gray-300 normal-case font-normal">(optional)</span></p>
              <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Any additional context for rescheduling..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300 resize-none" />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            <button type="button" disabled={!selSlot} onClick={() => onConfirm(selDate, selSlot)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-md">
              <CalendarDays size={16} /> Confirm Reschedule
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">A calendar invitation will be sent to your official email</p>
          </div>
        </div>
      </div>
    </div>
  );
}


function FeedbackModal({ appt, onClose, onSuccess }: { appt: Appointment; onClose: () => void; onSuccess: () => void }) {
  const [rating,  setRating]  = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-7" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-800">Send Feedback</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-5">
          <p className="text-xs text-gray-500">Reviewing appointment with</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">{appt.employee}</p>
          <p className="text-xs text-orange-500 font-medium mt-0.5">{appt.date}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">How was your experience?</p>
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button"
                  onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)} className="transition-transform hover:scale-110 active:scale-95">
                  <Star size={28} className={`transition-colors ${s <= (hovered || rating) ? "text-orange-400 fill-orange-400" : "text-gray-300 fill-gray-100"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Detailed Comments</label>
            <textarea rows={4} placeholder="Tell us about your service..." value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300 resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-orange-200 hover:shadow-lg">
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Appointment Modal ─────────────────────────────────────────────────────────
function AppointmentModal({ appt, onClose, onFeedback, onCancelSuccess, onReschedule }: {
  appt: Appointment; onClose: () => void; onFeedback: () => void; onCancelSuccess: () => void; onReschedule: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(appt.meetLink!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 p-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Appointment Details</p>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[appt.status]}`}>{appt.status}</span>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Assigned Employee</p>
            <p className="text-sm font-semibold text-gray-800">{appt.employee}</p>
            <p className="text-xs text-gray-400">{appt.department}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Department</p>
            <p className="text-sm font-semibold text-gray-800">{appt.department}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Date & Time</p>
            <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <CalendarDays size={13} className="text-orange-400" /> {appt.date}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Duration: 60 minutes</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{appt.meetLink ? "Meeting Link" : "Location"}</p>
            {appt.meetLink ? (
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-orange-500 truncate">meet.google.com/abc-d...</p>
                <button type="button" onClick={copyLink}
                  className={`text-xs border px-2 py-0.5 rounded-lg transition-all shrink-0 ${copied ? "text-green-600 border-green-300 bg-green-50" : "text-orange-400 hover:text-orange-600 border-orange-200 hover:border-orange-400"}`}>
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                <MapPin size={13} className="text-orange-400 shrink-0" />
                <span className="truncate">{appt.location}</span>
              </p>
            )}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl px-5 py-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> Appointment Notes
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{appt.notes}</p>
        </div>
        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={() => setConfirmCancel(true)}
            className="text-sm text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg font-medium transition-all">
            Cancel Appointment
          </button>
          <div className="flex gap-4">
            {appt.status === "Scheduled" && appt.meetLink && (
              <button type="button"
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-orange-200 hover:shadow-lg">
                <Video size={15} /> Join Meeting
              </button>
            )}
            <button type="button" onClick={onReschedule}
              className="flex items-center gap-2 px-6 py-2 border-2 border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-500 hover:bg-orange-50 active:scale-95 text-sm font-semibold rounded-xl transition-all">
              Reschedule
            </button>
          </div>
        </div>
      </div>

      {/* Cancel Confirm Modal */}
      {confirmCancel && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center" onClick={() => setConfirmCancel(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm mx-4 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-500 text-2xl">⚠</span>
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Cancel Appointment?</h2>
            <p className="text-sm text-gray-500 mb-1">Are you sure you want to cancel your meeting</p>
            <p className="text-sm font-semibold text-gray-800 mb-1">&quot;{appt.notes.split(".")[0]}&quot; with {appt.employee}</p>
            <p className="text-sm text-gray-500 mb-1">on {appt.date}?</p>
            <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <button onClick={() => { setConfirmCancel(false); onClose(); onCancelSuccess(); }}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl mb-3 transition-colors">
              Yes, Cancel Appointment
            </button>
            <button onClick={() => setConfirmCancel(false)}
              className="w-full py-2.5 text-gray-500 hover:bg-gray-100 font-medium rounded-xl transition-colors text-sm">
              Keep Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ClientDashboard() {
  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState<AppStatus | "All">("All");

  const [sortCol,     setSortCol]     = useState<"date" | "employee" | null>(null);
  const [sortDir,     setSortDir]     = useState<"asc" | "desc">("asc");

  function toggleSort(col: "date" | "employee") {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }
  const [page,        setPage]        = useState(1);


  const [selected,    setSelected]    = useState<Appointment | null>(null);
  const [feedback,    setFeedback]    = useState<Appointment | null>(null);
  const [toast,       setToast]       = useState(false);
  const [cancelToast,     setCancelToast]     = useState(false);
  const [rescheduleToast, setRescheduleToast] = useState(false);
  const [reschedule,      setReschedule]      = useState<Appointment | null>(null);
  const [rescheduleConfirm, setRescheduleConfirm] = useState<{ appt: Appointment; date: string; slot: string } | null>(null);
  const router = useRouter();

  function showToast() { setToast(true); setTimeout(() => setToast(false), 3000); }
  function showCancelToast() { setCancelToast(true); setTimeout(() => setCancelToast(false), 3000); }
  function showRescheduleToast() { setRescheduleToast(true); setTimeout(() => setRescheduleToast(false), 3000); }

  const filtered = APPOINTMENTS.filter(a => {
    const matchStatus = status === "All" || a.status === status;
    const matchSearch = a.employee.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (!sortCol) return 0;
    const valA = sortCol === "employee" ? a.employee : a.date;
    const valB = sortCol === "employee" ? b.employee : b.date;
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {selected && <AppointmentModal appt={selected} onClose={() => setSelected(null)} onFeedback={() => { setFeedback(selected); setSelected(null); }} onCancelSuccess={showCancelToast} onReschedule={() => { setReschedule(selected); }} />}
      {reschedule && <RescheduleModal appt={reschedule} onClose={() => setReschedule(null)} onConfirm={(date, slot) => setRescheduleConfirm({ appt: reschedule, date, slot })} />}
      {rescheduleConfirm && <RescheduleConfirmSheet appt={rescheduleConfirm.appt} date={rescheduleConfirm.date} slot={rescheduleConfirm.slot} onClose={() => setRescheduleConfirm(null)} onConfirm={() => { setRescheduleConfirm(null); setReschedule(null); setSelected(null); showRescheduleToast(); }} />}
      {feedback && <FeedbackModal appt={feedback} onClose={() => setFeedback(null)} onSuccess={showToast} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-orange-50 border border-orange-200 text-orange-700 px-5 py-3.5 rounded-2xl shadow-lg">
          <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center shrink-0">
            <Star size={12} className="text-white fill-white" />
          </div>
          <p className="text-sm font-semibold">Feedback submitted successfully!</p>
        </div>
      )}

      {rescheduleToast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>✓</span> Appointment rescheduled successfully.
        </div>
      )}

      {cancelToast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>✓</span> Appointment cancelled successfully.
        </div>
      )}

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Welcome back, Alex</h1>
        <div className="flex items-center gap-3">
          <ClientNotificationDropdown />
          <button type="button" onClick={() => router.push("/client/profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">Alex Thompson</p>
              <p className="text-xs text-gray-400">Premium Member</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-200 grid place-items-center text-sm font-bold text-gray-600">AT</div>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden px-4 md:px-8 py-4 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight">24</p>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1"><TrendingUp size={11} /> +12% from last month</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <Users size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Scheduled Appointments</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight">5</p>
              <p className="text-xs text-gray-400">Next one in 2 days</p>
            </div>
          </div>
          <div className="bg-orange-500 rounded-xl p-4 text-white shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Video size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">Next Appointment</p>
              <p className="text-xs opacity-90 flex items-center gap-1"><CalendarDays size={11} /> Oct 24, 2023 at 10:00 AM</p>
              <p className="text-xs opacity-90 flex items-center gap-1 mb-2"><Users size={11} /> Sarah Johnson</p>
              <button type="button" className="flex items-center gap-1.5 py-1 px-3 bg-white text-orange-500 text-xs font-semibold rounded-lg hover:bg-orange-50 transition-colors">
                <Video size={11} /> Join Meet
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h2 className="text-base font-bold text-gray-800 shrink-0">Appointment History</h2>
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search appointments..." value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
              </div>
              <div className="flex items-center gap-1 flex-wrap shrink-0">
                {(["All", "Scheduled", "Completed", "Cancelled"] as (AppStatus | "All")[]).map(s => (
                  <button key={s} type="button"
                    onClick={() => { setStatus(s); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${status === s ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-auto flex-1">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                {(["DATE & TIME","EMPLOYEE","DEPARTMENT","TYPE","STATUS","ACTIONS"] as const).map(h => {
                  const col = h === "DATE & TIME" ? "date" : h === "EMPLOYEE" ? "employee" : null;
                  const active = col && sortCol === col;
                  return (
                    <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider">
                      {col ? (
                        <button type="button" onClick={() => toggleSort(col)}
                          className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${active ? "text-orange-500" : ""}`}>
                          {h}
                          {active
                            ? sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />
                            : <ArrowUpDown size={11} className="text-gray-300" />}
                        </button>
                      ) : h}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginated.map((a) => (
                <tr key={a.id} onClick={() => setSelected(a)}
                  className="border-b border-gray-50 hover:bg-orange-50/40 cursor-pointer transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700">{a.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{a.employee}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{a.department}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      {a.type === "Google Meet"
                        ? <><span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" /> Google Meet</>
                        : <><Users size={13} className="text-gray-400" /> In-person</>}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                  </td>
                  <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                    <button type="button" onClick={() => setFeedback(a)}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
                      Give Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-400">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex items-center gap-2">
              <button type="button" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed">
                <ChevronLeft size={14} /> Previous
              </button>
              <button type="button" disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
