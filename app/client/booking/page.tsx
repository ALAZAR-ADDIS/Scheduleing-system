"use client";
import { useState } from "react";
import { Search, ChevronDown, CalendarDays, Star, X, ChevronLeft, ChevronRight, Video, Users, Clock } from "lucide-react";
import ClientNotificationDropdown from "@/components/client/shared/ClientNotificationDropdown";
import { useRouter } from "next/navigation";

type Employee = {
  id: number; name: string; role: string; department: string;
  tag: string; rating: number; team: string; initials: string;
  color: string; online: boolean;
};

const EMPLOYEES: Employee[] = [
  { id: 1, name: "Alex Rivera",   role: "Senior Engineer",    department: "Engineering", tag: "Team Lead",  rating: 4.8, team: "Engineering", initials: "AR", color: "bg-teal-500",  online: true  },
  { id: 2, name: "Sarah Chen",    role: "HR Manager",         department: "HR",          tag: "People Ops", rating: 4.9, team: "HR",          initials: "SC", color: "bg-pink-400",  online: true  },
  { id: 3, name: "Jordan Smith",  role: "Financial Analyst",  department: "Finance",     tag: "Auditing",   rating: 4.7, team: "Finance",     initials: "JS", color: "bg-slate-600", online: true  },
  { id: 4, name: "Taylor Vane",   role: "Sales Director",     department: "Sales",       tag: "Enterprise", rating: 4.6, team: "Sales",       initials: "TV", color: "bg-rose-400",  online: false },
  { id: 5, name: "Morgan Lee",    role: "Project Manager",    department: "Management",  tag: "Operations", rating: 4.9, team: "Management",  initials: "ML", color: "bg-amber-500", online: false },
  { id: 6, name: "Casey Wright",  role: "Software Developer", department: "Engineering", tag: "Frontend",   rating: 4.5, team: "Engineering", initials: "CW", color: "bg-cyan-600",  online: false },
];

const TEAMS = ["All Teams", "Engineering", "HR", "Finance", "Sales", "Management"];
const ALL_SLOTS = ["09:00 AM - 10:00 AM","10:15 AM - 11:15 AM","12:00 PM - 01:00 PM","01:30 PM - 02:30 PM","03:00 PM - 04:00 PM","04:15 PM - 05:15 PM"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["SU","MO","TU","WE","TH","FR","SA"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function toKey(y: number, m: number, d: number) { return `${y}-${pad(m+1)}-${pad(d)}`; }

// ── Confirmation Sheet ────────────────────────────────────────────────────────
function ConfirmSheet({ emp, date, slot, onClose, onConfirm }: {
  emp: Employee; date: string; slot: string; onClose: () => void; onConfirm: () => void;
}) {
  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-7 text-center" onClick={e => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400"><X size={15} /></button>
        {/* Check icon */}
        <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">Booking Confirmed!</h2>
        <p className="text-sm text-gray-400 mb-6">Your appointment with <span className="font-semibold text-gray-600">{emp.name}</span> has been successfully scheduled.</p>
        {/* Details */}
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
          <CalendarDays size={15} /> Confirm Appointment
        </button>
        <p className="text-xs text-gray-400 mt-3">A calendar invitation will be sent to your official email</p>
      </div>
    </div>
  );
}

// ── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({ emp, onClose, onConfirm }: { emp: Employee; onClose: () => void; onConfirm: (date: string, slot: string) => void }) {
  const today = new Date(); today.setHours(0,0,0,0);
  const windowEnd = new Date(today); windowEnd.setDate(today.getDate() + 29);
  const initKey = toKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]   = useState(initKey);
  const [selSlot,   setSelSlot]   = useState("");
  const [meetType,  setMeetType]  = useState<"in-person" | "google-meet">("in-person");
  const [note,      setNote]      = useState("");

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); }

  const selDateLabel = new Date(selDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={e => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col md:flex-row overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>

        {/* ── Left panel ── */}
        <div className="w-full md:w-64 shrink-0 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-row md:flex-col items-center md:items-stretch p-4 md:p-6 gap-4 md:gap-0">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center md:mb-6">
            <div className="relative mb-3">
              <div className={`w-16 md:w-20 h-16 md:h-20 rounded-full ${emp.color} grid place-items-center text-white text-xl md:text-2xl font-bold`}>
                {emp.initials}
              </div>
              {emp.online && <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />}
            </div>
            <p className="text-base font-bold text-gray-800">{emp.name}</p>
            <p className="text-xs text-orange-500 font-semibold mt-0.5">{emp.role}</p>
            <p className="text-xs text-gray-400 mt-0.5">{emp.department}</p>
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="text-orange-400 fill-orange-400" />
              <span className="text-xs font-semibold text-gray-700">{emp.rating}</span>
              <span className="text-xs text-gray-400">/5.0</span>
            </div>
          </div>

          {/* Details */}
          <div className="hidden md:block space-y-3 text-xs">
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Department</p>
              <p className="text-gray-700 font-medium">{emp.department}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Duration</p>
              <p className="text-gray-700 font-medium">60 minutes</p>
            </div>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-base font-bold text-gray-800">Book Appointment</h2>
              <p className="text-xs text-gray-400 mt-0.5">Select a date, time slot and meeting type</p>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Calendar + Slots row */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Calendar */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Date</p>
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
                    const key      = toKey(viewYear, viewMonth, day);
                    const cellDate = new Date(viewYear, viewMonth, day);
                    const isToday  = cellDate.getTime() === today.getTime();
                    const isSel    = key === selDate;
                    const inWindow = cellDate >= today && cellDate <= windowEnd;
                    return (
                      <button key={i} type="button" onClick={() => inWindow && setSelDate(key)}
                        className={`mx-auto w-8 h-8 rounded-full text-xs font-medium transition-colors flex items-center justify-center
                          ${isSel   ? "bg-orange-500 text-white" :
                            isToday ? "bg-orange-100 text-orange-600 font-bold" :
                            inWindow ? "hover:bg-orange-50 text-gray-700 cursor-pointer" :
                                       "text-gray-300 cursor-default"}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slots */}
              <div className="w-full sm:w-48 shrink-0 flex flex-col" style={{maxHeight: "260px"}}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Available Slots</p>
                <p className="text-[10px] text-orange-500 font-medium mb-2 flex items-center gap-1">
                  <CalendarDays size={10} /> {selDateLabel}
                </p>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" /> Selected</span>
                  <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-orange-50 border border-orange-200 inline-block" /> Available</span>
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
                {([["in-person", "In-person", Users], ["google-meet", "Google Meet", Video]] as const).map(([val, label, Icon]) => {
                  const active = meetType === val;
                  return (
                    <button key={val} type="button" onClick={() => setMeetType(val)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                        active
                          ? "border-orange-500 bg-orange-50 text-orange-600"
                          : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                      }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        active ? "bg-orange-500" : "bg-gray-100"
                      }`}>
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

            {/* Note field */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Appointment Note <span className="text-gray-300 normal-case font-normal">(optional)</span></p>
              <textarea rows={3} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Describe the purpose of your appointment or anything the employee should know beforehand..."
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300 resize-none" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            <button type="button"
              disabled={!selSlot}
              onClick={() => { onConfirm(selDate, selSlot); }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors shadow-md hover:shadow-orange-200">
              <CalendarDays size={16} /> Confirm & Book Appointment
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">A calendar invitation will be sent to your official email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const [search,    setSearch]    = useState("");
  const [team,      setTeam]      = useState("All Teams");
  const [teamOpen,  setTeamOpen]  = useState(false);
  const [booking,   setBooking]   = useState<Employee | null>(null);
  const [confirm,   setConfirm]   = useState<{ emp: Employee; date: string; slot: string } | null>(null);
  const [toast,     setToast]     = useState(false);
  const router = useRouter();

  function handleSchedule(date: string, slot: string) {
    setConfirm({ emp: booking!, date, slot });
  }
  function handleFinalConfirm() {
    setConfirm(null);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const filtered = EMPLOYEES.filter(e => {
    const matchTeam   = team === "All Teams" || e.team === team;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                        e.role.toLowerCase().includes(search.toLowerCase());
    return matchTeam && matchSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      {booking && <BookingModal emp={booking} onClose={() => setBooking(null)} onConfirm={handleSchedule} />}
      {confirm && <ConfirmSheet emp={confirm.emp} date={confirm.date} slot={confirm.slot} onClose={() => setConfirm(null)} onConfirm={handleFinalConfirm} />}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>✓</span> Appointment booked successfully!
        </div>
      )}

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
        <div />
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

      <main className="px-4 md:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Employee Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Find and book appointments with our specialized team members.</p>
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search employees by name or role..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
          </div>
          <div className="relative">
            <button type="button" onClick={() => setTeamOpen(v => !v)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 bg-white min-w-[130px] justify-between">
              {team} <ChevronDown size={14} className={`transition-transform ${teamOpen ? "rotate-180" : ""}`} />
            </button>
            {teamOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-20 min-w-[130px] py-1">
                {TEAMS.map(t => (
                  <button key={t} type="button" onClick={() => { setTeam(t); setTeamOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${team === t ? "text-orange-500 font-medium bg-orange-50" : "text-gray-600 hover:bg-gray-50"}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow">
              <div className="relative mb-3">
                <div className={`w-16 h-16 rounded-full ${emp.color} grid place-items-center text-white text-xl font-bold`}>{emp.initials}</div>
                {emp.online && <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />}
              </div>
              <p className="text-sm font-bold text-gray-800">{emp.name}</p>
              <p className="text-xs text-orange-500 font-medium mt-0.5">{emp.role}</p>
              <p className="text-xs text-gray-400 mt-0.5">{emp.department} • {emp.tag}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star size={12} className="text-orange-400 fill-orange-400" />
                <span className="text-xs font-semibold text-gray-700">{emp.rating}</span>
                <span className="text-xs text-gray-400">/5.0</span>
              </div>
              <button type="button" onClick={() => setBooking(emp)}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-orange-500 hover:bg-orange-600 text-white transition-colors">
                <CalendarDays size={14} /> Book
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 text-center py-16 text-gray-400 text-sm">No employees found.</div>
          )}
        </div>
      </main>
    </div>
  );
}
