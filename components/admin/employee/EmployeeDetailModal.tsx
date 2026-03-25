"use client";
import { useState } from "react";
import { X, User, Calendar, MessageSquare, Star, ChevronLeft, ChevronRight, Shield } from "lucide-react";

type EmployeeStatus = "Active" | "Inactive";

export type Employee = {
  id: string;
  name: string;
  joinedDate: string;
  email: string;
  department: string;
  role: string;
  status: EmployeeStatus;
  avatarColor: string;
};

type Feedback = {
  reviewer: string;
  date: string;
  time: string;
  rating: number;
  comment: string;
};

type SlotMap = Record<string, string[]>;
type BookedMap = Record<string, string[]>;

// ── Static data ───────────────────────────────────────────────────────────────

const ALL_SLOTS = [
  "09:00 AM - 10:00 AM", "10:30 AM - 11:30 AM", "12:00 PM - 01:00 PM",
  "01:30 PM - 02:30 PM", "03:00 PM - 04:00 PM", "04:30 PM - 05:30 PM",
];

function buildSlotData() {
  const slots: SlotMap  = {};
  const booked: BookedMap = {};
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  // offsets (from today) that have slots
  const offsets = [0, 1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16, 18, 20, 22, 25, 28];
  offsets.forEach((offset) => {
    const d = new Date(base);
    d.setDate(base.getDate() + offset);
    const key = toKey(d.getFullYear(), d.getMonth(), d.getDate());
    slots[key]  = ALL_SLOTS;
    // mark some slots as booked per day
    booked[key] = offset % 3 === 0
      ? [ALL_SLOTS[1], ALL_SLOTS[3]]
      : offset % 3 === 1
      ? [ALL_SLOTS[0]]
      : [ALL_SLOTS[2], ALL_SLOTS[4], ALL_SLOTS[5]];
  });
  return { slots, booked };
}

const { slots: DEFAULT_SLOTS, booked: DEFAULT_BOOKED } = buildSlotData();

const FEEDBACK_DATA: Record<string, Feedback[]> = {
  E001: [
    { reviewer: "Sarah Klein",       date: "Oct 17, 2023", time: "11:15 AM", rating: 4, comment: "Great collaborator! Always open to feedback and provides high-fidelity prototypes that make the handoff process seamless. Looking forward to more projects together." },
    { reviewer: "Marcus Richardson", date: "Sep 28, 2023", time: "09:45 AM", rating: 5, comment: "The user feedback from our beta testers has been overwhelmingly positive thanks to the UX improvements suggested by Jane. A true professional." },
    { reviewer: "Emma Lawson",       date: "Sep 15, 2023", time: "04:30 PM", rating: 5, comment: "Highly skilled and proactive. Jane doesn't just design what she's told; she thinks about the business impact and user flow deeply." },
    { reviewer: "David Park",        date: "Aug 30, 2023", time: "02:00 PM", rating: 4, comment: "Excellent attention to detail. Delivered the design system ahead of schedule." },
    { reviewer: "Lisa Chen",         date: "Aug 12, 2023", time: "10:30 AM", rating: 5, comment: "Jane's work on the mobile app redesign was outstanding. User retention improved by 30%." },
    { reviewer: "Tom Bradley",       date: "Jul 25, 2023", time: "03:15 PM", rating: 4, comment: "Very collaborative and receptive to feedback. Great team player." },
    { reviewer: "Anna White",        date: "Jul 08, 2023", time: "11:00 AM", rating: 5, comment: "Exceptional design skills. The new dashboard UI received rave reviews from clients." },
    { reviewer: "Chris Morgan",      date: "Jun 20, 2023", time: "09:00 AM", rating: 4, comment: "Solid work on the component library. Well-documented and easy to use." },
    { reviewer: "Rachel Green",      date: "Jun 05, 2023", time: "02:45 PM", rating: 5, comment: "Jane transformed our brand identity. The new visual language is cohesive and modern." },
    { reviewer: "Kevin Hart",        date: "May 18, 2023", time: "04:00 PM", rating: 4, comment: "Great communication throughout the project. Always kept stakeholders informed." },
    { reviewer: "Sophie Turner",     date: "May 02, 2023", time: "10:15 AM", rating: 5, comment: "The accessibility improvements Jane implemented exceeded our compliance requirements." },
    { reviewer: "James Wilson",      date: "Apr 15, 2023", time: "01:30 PM", rating: 4, comment: "Delivered high-quality mockups on tight deadlines. Very reliable." },
  ],
  "default": [
    { reviewer: "Alex Johnson",  date: "Oct 10, 2023", time: "10:00 AM", rating: 4, comment: "Great team member. Always delivers on time and with high quality." },
    { reviewer: "Maria Garcia",  date: "Sep 22, 2023", time: "02:30 PM", rating: 5, comment: "Exceptional work ethic and technical skills. A real asset to the team." },
    { reviewer: "John Smith",    date: "Sep 05, 2023", time: "11:45 AM", rating: 4, comment: "Very professional and collaborative. Excellent communication skills." },
    { reviewer: "Emily Davis",   date: "Aug 18, 2023", time: "03:00 PM", rating: 5, comment: "Outstanding performance. Consistently exceeds expectations." },
    { reviewer: "Michael Brown", date: "Aug 01, 2023", time: "09:30 AM", rating: 4, comment: "Reliable and skilled. Great addition to any project team." },
    { reviewer: "Sarah Lee",     date: "Jul 14, 2023", time: "01:00 PM", rating: 5, comment: "Excellent problem-solving skills. Always finds creative solutions." },
  ],
};

const DEPARTMENTS = ["Design Department", "Marketing Department", "Sales Department", "Engineering Department", "HR Department", "Finance Department", "IT Department"];
const FB_PAGE_SIZE = 4;
const DAYS_SHORT   = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const MONTHS       = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function toKey(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

// ── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? "text-orange-400 fill-orange-400" : "text-gray-300 fill-gray-200"} />
      ))}
    </div>
  );
}

function PageButtons({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}
        className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronLeft size={12} />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" onClick={() => onChange(p)}
          className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
            page === p ? "bg-orange-500 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}>
          {p}
        </button>
      ))}
      <button type="button" disabled={page === total} onClick={() => onChange(page + 1)}
        className="p-1.5 rounded border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronRight size={12} />
      </button>
    </div>
  );
}

function MiniCalendar({ slotMap, selectedKey, onSelect, windowStart, windowEnd }: {
  slotMap: SlotMap;
  selectedKey: string;
  onSelect: (key: string) => void;
  windowStart: Date;
  windowEnd: Date;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth} className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-semibold text-gray-700">{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" onClick={nextMonth} className="p-1 rounded hover:bg-gray-100 text-gray-500">
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map(d => (
          <div key={d} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key      = toKey(viewYear, viewMonth, day);
          const hasSlots = !!slotMap[key];
          const cellDate = new Date(viewYear, viewMonth, day);
          const isToday   = cellDate.getTime() === today.getTime();
          const isSel     = key === selectedKey;
          const inWindow  = cellDate >= windowStart && cellDate <= windowEnd;
          return (
            <button key={i} type="button"
              onClick={() => inWindow && onSelect(key)}
              className={`mx-auto w-9 h-9 rounded-full text-xs font-medium transition-colors flex items-center justify-center
                ${isSel    ? "bg-orange-500 text-white" :
                  isToday  ? "bg-orange-100 text-orange-600 font-bold" :
                  inWindow && hasSlots ? "hover:bg-orange-50 text-gray-700 cursor-pointer ring-1 ring-orange-200" :
                  inWindow ? "text-gray-600 hover:bg-gray-50 cursor-pointer" :
                             "text-gray-300 cursor-default"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

type Props = { employee: Employee; onClose: () => void };

export default function EmployeeDetailModal({ employee: emp, onClose }: Props) {
  const [tab,            setTab]            = useState<"personal" | "availability" | "feedback">("personal");
  const [fbPage,         setFbPage]         = useState(1);
  const [fullName,       setFullName]       = useState(emp.name);
  const [email,          setEmail]          = useState(emp.email);
  const [dept,           setDept]           = useState(emp.department + " Department");
  const [role,           setRole]           = useState(emp.role);
  const todayDate = new Date(); todayDate.setHours(0,0,0,0);
  const windowEnd = new Date(todayDate); windowEnd.setDate(todayDate.getDate() + 29);
  const initKey = toKey(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
  const [selectedDateKey, setSelectedDateKey] = useState(initKey);
  const [selectedSlot,    setSelectedSlot]    = useState("");

  const feedbacks    = FEEDBACK_DATA[emp.id] ?? FEEDBACK_DATA["default"];
  const fbTotalPages = Math.max(1, Math.ceil(feedbacks.length / FB_PAGE_SIZE));
  const paginatedFb  = feedbacks.slice((fbPage - 1) * FB_PAGE_SIZE, fbPage * FB_PAGE_SIZE);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4 flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${emp.avatarColor} grid place-items-center text-white text-lg font-bold shrink-0`}>
              {emp.name[0]}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-800">{emp.name}</h2>
              <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                {emp.role} • {emp.department} Department
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-gray-100 shrink-0">
          {[
            { key: "personal",     label: "Personal Details",     icon: User },
            { key: "availability", label: "Availability & Slots",  icon: Calendar },
            { key: "feedback",     label: "User Feedback",         icon: MessageSquare },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === key ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* ── Personal Details ── */}
        {tab === "personal" && (
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            <div className="border border-gray-100 rounded-xl p-5 space-y-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Personal Information</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Full Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Department</label>
                  <div className="relative">
                    <select value={dept} onChange={(e) => setDept(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 appearance-none bg-white">
                      {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide block mb-1">Role</label>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <button type="button" className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors">
                  <User size={14} /> Disable User
                </button>
                <button type="button" className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                  <Shield size={14} /> Update Details
                </button>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full grid place-items-center shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">Account Security</p>
                <p className="text-xs text-gray-500 mt-0.5">Changes to email address will require a verification process. Disabling a user will revoke all system access immediately.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Availability & Slots ── */}
        {tab === "availability" && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <p className="px-6 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-widest shrink-0">
              Employee Availability & Daily Slots
            </p>
            <div className="flex flex-1 overflow-hidden">
              {/* Calendar */}
              <div className="w-3/5 px-6 py-4 border-r border-gray-100 overflow-y-auto">
                <p className="text-sm font-semibold text-gray-700 mb-3">Select New Date</p>
                <MiniCalendar
                  slotMap={DEFAULT_SLOTS}
                  selectedKey={selectedDateKey}
                  onSelect={(key) => { setSelectedDateKey(key); setSelectedSlot(""); }}
                  windowStart={todayDate}
                  windowEnd={windowEnd}
                />
              </div>
              {/* Slots */}
              <div className="w-2/5 px-5 py-4 overflow-y-auto flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-700">Daily Slots</p>
                  {selectedDateKey && (
                    <div className="flex items-center gap-1 text-xs text-orange-500 font-medium">
                      <Calendar size={12} />
                      {new Date(selectedDateKey + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Legend */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-orange-500 inline-block" /> Booked
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-200 inline-block" /> Available
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {(DEFAULT_SLOTS[selectedDateKey] ?? []).map((slot) => {
                    const isBooked = DEFAULT_BOOKED[selectedDateKey]?.includes(slot);
                    const isSel    = selectedSlot === slot;
                    return (
                      <button key={slot} type="button"
                        onClick={() => !isBooked && setSelectedSlot(slot)}
                        disabled={isBooked}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors border flex items-center justify-between ${
                          isBooked
                            ? "bg-orange-500 text-white border-orange-500 cursor-not-allowed opacity-90"
                            : isSel
                            ? "bg-orange-200 text-orange-800 border-orange-300 ring-2 ring-orange-400"
                            : "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100"
                        }`}>
                        <span>{slot}</span>
                        {isBooked && <span className="text-xs font-semibold opacity-80 ml-2">Booked</span>}
                      </button>
                    );
                  })}
                  {!DEFAULT_SLOTS[selectedDateKey] && (
                    <p className="text-sm text-gray-400 text-center py-8">No slots for this date</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── User Feedback ── */}
        {tab === "feedback" && (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-3">
              {paginatedFb.map((fb, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{fb.reviewer}</p>
                    <span className="text-xs text-gray-400">{fb.date} • {fb.time}</span>
                  </div>
                  <StarRating rating={fb.rating} />
                  <p className="text-sm text-gray-600 leading-relaxed">{fb.comment}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 pb-2">
                <span className="text-xs text-gray-400">
                  Showing {(fbPage - 1) * FB_PAGE_SIZE + 1}–{Math.min(fbPage * FB_PAGE_SIZE, feedbacks.length)} of {feedbacks.length} feedback entries
                </span>
                <PageButtons page={fbPage} total={fbTotalPages} onChange={setFbPage} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
