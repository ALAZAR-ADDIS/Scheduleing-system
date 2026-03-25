"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays, Users, Clock, Search,
  ChevronLeft, ChevronRight, X, MapPin, Video,
  CheckCircle, ArrowUp, ArrowDown, ArrowUpDown,
} from "lucide-react";
import EmployeeNotificationDropdown from "@/components/employee/shared/EmployeeNotificationDropdown";

type AppStatus = "Scheduled" | "Completed" | "Cancelled";
type AppType   = "Google Meet" | "In-person";

type Appointment = {
  id: number;
  date: string;
  time: string;
  client: string;
  department: string;
  type: AppType;
  status: AppStatus;
  notes: string;
  meetLink?: string;
  location?: string;
  feedback?: { rating: number; comment: string };
};

const STATUS_STYLE: Record<AppStatus, string> = {
  Scheduled: "bg-orange-50 text-orange-500",
  Completed: "bg-green-50 text-green-600",
  Cancelled: "bg-red-50 text-red-500",
};

const APPOINTMENTS: Appointment[] = [
  { id: 1,  date: "Nov 15, 2023", time: "9:00 AM",  client: "Sarah Jenkins",   department: "Human Resources",      type: "Google Meet", status: "Scheduled", notes: "Onboarding process discussion and HR policy walkthrough.", meetLink: "https://meet.google.com/abc-defg-hij" },
  { id: 2,  date: "Nov 14, 2023", time: "11:30 AM", client: "David Miller",    department: "Financial Consulting", type: "In-person",   status: "Scheduled", notes: "Q4 budget planning and financial forecast review.", location: "Room 204, Finance Building" },
  { id: 3,  date: "Nov 13, 2023", time: "2:00 PM",  client: "Elena Rodriguez", department: "Engineering",          type: "Google Meet", status: "Scheduled", notes: "Sprint planning and architecture review for Q4 roadmap.", meetLink: "https://meet.google.com/xyz-uvwx-yz1" },
  { id: 4,  date: "Nov 12, 2023", time: "10:00 AM", client: "Alex Thompson",   department: "IT Support",           type: "In-person",   status: "Scheduled", notes: "Cloud migration strategy and infrastructure planning.", location: "IT Department, Basement" },
  { id: 5,  date: "Nov 11, 2023", time: "3:30 PM",  client: "Tom Baker",       department: "HR",                   type: "Google Meet", status: "Scheduled", notes: "Performance review and career development discussion.", meetLink: "https://meet.google.com/pqr-stuv-wx2" },
  { id: 6,  date: "Nov 10, 2023", time: "9:00 AM",  client: "Sara Ali",        department: "Finance",              type: "In-person",   status: "Completed", notes: "Investment portfolio analysis and risk assessment.", location: "Conference Room A", feedback: { rating: 5, comment: "Excellent session! Very thorough and professional." } },
  { id: 7,  date: "Nov 09, 2023", time: "1:00 PM",  client: "Chris Evans",     department: "Sales",                type: "Google Meet", status: "Completed", notes: "Enterprise client pitch preparation and strategy alignment.", meetLink: "https://meet.google.com/lmn-opqr-st3", feedback: { rating: 4, comment: "Great meeting, covered all key points effectively." } },
  { id: 8,  date: "Nov 08, 2023", time: "2:30 PM",  client: "Nina Patel",      department: "Management",           type: "In-person",   status: "Completed", notes: "Project milestone review and team performance evaluation.", location: "Executive Suite, Floor 5" },
  { id: 9,  date: "Nov 07, 2023", time: "11:00 AM", client: "Mike Johnson",    department: "Engineering",          type: "Google Meet", status: "Completed", notes: "Frontend architecture discussion and code review session.", meetLink: "https://meet.google.com/efg-hijk-lm4", feedback: { rating: 5, comment: "Very insightful, helped clarify the architecture decisions." } },
  { id: 10, date: "Nov 06, 2023", time: "9:00 AM",  client: "Amy Lee",         department: "Human Resources",      type: "In-person",   status: "Completed", notes: "Annual benefits review and policy update briefing.", location: "HR Office, Floor 2" },
  { id: 11, date: "Nov 05, 2023", time: "4:00 PM",  client: "Jake Paul",       department: "Financial Consulting", type: "Google Meet", status: "Completed", notes: "Tax planning strategy for the upcoming fiscal year.", meetLink: "https://meet.google.com/nop-qrst-uv5", feedback: { rating: 3, comment: "Meeting was okay but could have been more focused." } },
  { id: 12, date: "Nov 04, 2023", time: "10:00 AM", client: "Mia Wong",        department: "IT Support",           type: "In-person",   status: "Completed", notes: "Network infrastructure upgrade planning and security audit.", location: "IT Department, Basement" },
  { id: 13, date: "Nov 03, 2023", time: "2:00 PM",  client: "Lisa Wang",       department: "Engineering",          type: "Google Meet", status: "Cancelled", notes: "System design review — cancelled due to team conflict.", meetLink: "https://meet.google.com/aaa-bbbb-cc1" },
  { id: 14, date: "Nov 02, 2023", time: "11:00 AM", client: "Jane Smith",      department: "Finance",              type: "In-person",   status: "Cancelled", notes: "Budget reconciliation meeting — rescheduled by finance team.", location: "Conference Room B" },
  { id: 15, date: "Nov 01, 2023", time: "9:30 AM",  client: "Tom Baker",       department: "Sales",                type: "Google Meet", status: "Cancelled", notes: "Client onboarding call — client requested cancellation.", meetLink: "https://meet.google.com/ddd-eeee-ff2" },
  { id: 16, date: "Oct 31, 2023", time: "3:00 PM",  client: "Mark Davis",      department: "Engineering",          type: "In-person",   status: "Completed", notes: "Backend API design and database schema review.", location: "Engineering Lab, Floor 3", feedback: { rating: 4, comment: "Productive session, clear action items defined." } },
  { id: 17, date: "Oct 30, 2023", time: "10:00 AM", client: "Sara Ali",        department: "Management",           type: "Google Meet", status: "Completed", notes: "Quarterly OKR review and goal alignment session.", meetLink: "https://meet.google.com/ggg-hhhh-ii3" },
  { id: 18, date: "Oct 29, 2023", time: "1:00 PM",  client: "Chris Evans",     department: "HR",                   type: "In-person",   status: "Scheduled", notes: "Employee wellness program planning and policy updates.", location: "HR Office, Floor 2" },
  { id: 19, date: "Oct 28, 2023", time: "11:30 AM", client: "Nina Patel",      department: "IT Support",           type: "Google Meet", status: "Cancelled", notes: "Security audit follow-up — postponed pending report.", meetLink: "https://meet.google.com/jjj-kkkk-ll4" },
  { id: 20, date: "Oct 27, 2023", time: "9:00 AM",  client: "Amy Lee",         department: "Financial Consulting", type: "In-person",   status: "Completed", notes: "Annual financial health check and investment review.", location: "Room 204, Finance Building" },
  { id: 21, date: "Oct 26, 2023", time: "2:00 PM",  client: "David Miller",    department: "Sales",                type: "Google Meet", status: "Completed", notes: "Sales pipeline review and Q4 target alignment.", meetLink: "https://meet.google.com/mmm-nnnn-oo5" },
  { id: 22, date: "Oct 25, 2023", time: "10:30 AM", client: "Elena Rodriguez", department: "Engineering",          type: "In-person",   status: "Completed", notes: "Code quality review and deployment pipeline discussion.", location: "Engineering Lab, Floor 3" },
  { id: 23, date: "Oct 24, 2023", time: "3:00 PM",  client: "Jake Paul",       department: "Finance",              type: "Google Meet", status: "Scheduled", notes: "Year-end financial planning and audit preparation.", meetLink: "https://meet.google.com/ppp-qqqq-rr6" },
  { id: 24, date: "Oct 23, 2023", time: "9:00 AM",  client: "Mia Wong",        department: "HR",                   type: "In-person",   status: "Completed", notes: "Recruitment strategy and talent pipeline review.", location: "HR Office, Floor 2" },
  { id: 25, date: "Oct 22, 2023", time: "1:30 PM",  client: "Mike Johnson",    department: "IT Support",           type: "Google Meet", status: "Cancelled", notes: "Server maintenance planning — postponed by IT team.", meetLink: "https://meet.google.com/sss-tttt-uu7" },
  { id: 26, date: "Oct 21, 2023", time: "11:00 AM", client: "Lisa Wang",       department: "Management",           type: "In-person",   status: "Completed", notes: "Leadership development and succession planning session.", location: "Executive Suite, Floor 5" },
  { id: 27, date: "Oct 20, 2023", time: "4:00 PM",  client: "Sarah Jenkins",   department: "Human Resources",      type: "Google Meet", status: "Completed", notes: "Employee engagement survey results and action planning.", meetLink: "https://meet.google.com/vvv-wwww-xx8" },
  { id: 28, date: "Oct 19, 2023", time: "9:30 AM",  client: "Alex Thompson",   department: "Engineering",          type: "In-person",   status: "Completed", notes: "System architecture review and tech debt discussion.", location: "Engineering Lab, Floor 3" },
  { id: 29, date: "Oct 18, 2023", time: "2:00 PM",  client: "Jane Smith",      department: "Sales",                type: "Google Meet", status: "Cancelled", notes: "Client demo preparation — cancelled due to client conflict.", meetLink: "https://meet.google.com/yyy-zzzz-aa9" },
  { id: 30, date: "Oct 17, 2023", time: "10:00 AM", client: "Mark Davis",      department: "Financial Consulting", type: "In-person",   status: "Completed", notes: "Investment strategy review and portfolio rebalancing.", location: "Room 204, Finance Building" },
];

const PAGE_SIZE = 10;

function FeedbackModal({ appt, onClose }: { appt: Appointment; onClose: () => void }) {
  const stars = appt.feedback?.rating ?? 0;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Client Feedback</h3>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X size={15} /></button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 grid place-items-center text-xs font-bold text-orange-600 shrink-0">
            {appt.client.split(" ").map(w => w[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{appt.client}</p>
            <p className="text-xs text-gray-400">{appt.date}</p>
          </div>
        </div>
        {appt.feedback ? (
          <>
            <div className="flex items-center gap-1 mb-3">
              {[1,2,3,4,5].map(s => (
                <svg key={s} viewBox="0 0 24 24" className={`w-5 h-5 ${s <= stars ? "fill-orange-400 text-orange-400" : "fill-gray-200 text-gray-200"}`}>
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="none" />
                </svg>
              ))}
              <span className="text-xs text-gray-500 ml-1">{stars}/5</span>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">&ldquo;{appt.feedback.comment}&rdquo;</p>
          </>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-gray-400">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-600">No Feedback Yet</p>
            <p className="text-xs text-gray-400 mt-1">The client hasn&apos;t submitted feedback for this appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CancelConfirmModal({ appt, onClose, onConfirm }: {
  appt: Appointment; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-5">
          <svg viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Cancel Appointment?</h2>
        <p className="text-sm text-gray-500 mb-1">
          Are you sure you want to cancel your meeting
        </p>
        <p className="text-sm text-gray-700 font-semibold mb-1">
          &ldquo;{appt.notes.split(".")[0]}&rdquo; with {appt.client}
        </p>
        <p className="text-sm text-gray-500 mb-1">on {appt.date}?</p>
        <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
        <button type="button" onClick={onConfirm}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors mb-3">
          Yes, Cancel Appointment
        </button>
        <button type="button" onClick={onClose}
          className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-colors">
          Keep Appointment
        </button>
      </div>
    </div>
  );
}

function AppointmentModal({ appt, onClose, onComplete, onCancel }: {
  appt: Appointment; onClose: () => void; onComplete: () => void; onCancel: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(appt.meetLink!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${STATUS_STYLE[appt.status]}`}>{appt.status}</span>
          <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">{appt.notes.split(".")[0]}</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <Users size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Client</p>
              <p className="text-sm font-semibold text-gray-800">{appt.client}</p>
              <p className="text-xs text-gray-500">{appt.department}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              {appt.type === "Google Meet" ? <Video size={16} className="text-orange-500" /> : <MapPin size={16} className="text-orange-500" />}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Meeting Type</p>
              <p className="text-sm font-semibold text-gray-800">{appt.type}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <CalendarDays size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Date & Time</p>
              <p className="text-sm font-semibold text-gray-800">{appt.date} at {appt.time}</p>
              <p className="text-xs text-gray-500">Duration: 60 minutes</p>
            </div>
          </div>

          {appt.meetLink && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-orange-500">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Meeting Link</p>
                <p className="text-sm font-semibold text-orange-500 truncate">meet.google.com/abc-def...</p>
                <button type="button" onClick={copyLink} className="text-xs text-orange-500 hover:text-orange-600 font-medium mt-0.5">
                  {copied ? "✓ Copied!" : "Copy link"}
                </button>
              </div>
            </div>
          )}

          {appt.location && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Location</p>
                <p className="text-sm font-semibold text-gray-800">{appt.location}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-gray-300" />
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Appointment Notes</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{appt.notes}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button type="button" onClick={onCancel} className="text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-colors">
            Cancel Appointment
          </button>
          {appt.status === "Scheduled" && (
            <button type="button" onClick={() => { onComplete(); onClose(); }}
              className="px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-lg transition-colors">
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const router = useRouter();
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState<AppStatus | "All">("All");
  const [sortCol,  setSortCol]  = useState<"date" | "client" | null>(null);
  const [sortDir,  setSortDir]  = useState<"asc" | "desc">("asc");
  const [page,     setPage]     = useState(1);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [feedback, setFeedback] = useState<Appointment | null>(null);
  const [toast,    setToast]    = useState("");

  function toggleSort(col: "date" | "client") {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const filtered = APPOINTMENTS.filter(a => {
    const matchStatus = status === "All" || a.status === status;
    const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }).sort((a, b) => {
    if (!sortCol) return 0;
    const valA = sortCol === "client" ? a.client : a.date;
    const valB = sortCol === "client" ? b.client : b.date;
    return sortDir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const scheduled    = APPOINTMENTS.filter(a => a.status === "Scheduled").length;
  const upcomingToday = scheduled;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {feedback && <FeedbackModal appt={feedback} onClose={() => setFeedback(null)} />}

      {selected && (
        <AppointmentModal appt={selected} onClose={() => setSelected(null)}
          onComplete={() => showToast("Appointment marked as completed!")}
          onCancel={() => { setCancelling(selected); setSelected(null); }} />
      )}

      {cancelling && (
        <CancelConfirmModal appt={cancelling} onClose={() => setCancelling(null)}
          onConfirm={() => { setCancelling(null); showToast("Appointment cancelled successfully."); }} />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
          <span>✓</span> {toast}
        </div>
      )}

      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
        <h1 className="text-base md:text-lg font-bold text-gray-800">Welcome back, Sarah</h1>
        <div className="flex items-center gap-3">
          <EmployeeNotificationDropdown />
          <button type="button" onClick={() => router.push("/employee/profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">Sarah Johnson</p>
              <p className="text-xs text-gray-400">Human Resources</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 grid place-items-center text-sm font-bold text-orange-600">SJ</div>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden px-4 md:px-8 py-4 gap-4">
        {/* 3 cards side by side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 shrink-0">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <CalendarDays size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Upcoming Today</p>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{upcomingToday}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
              <CheckCircle size={18} className="text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{APPOINTMENTS.length}</p>
            </div>
          </div>

          <div className="bg-orange-500 rounded-xl p-4 text-white shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Video size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest opacity-80">Upcoming Now</p>
              <p className="text-xs font-semibold truncate">Product Demo Strategy Session</p>
              <p className="text-xs opacity-80 flex items-center gap-1 mt-0.5"><CalendarDays size={10} /> Today, Oct 24 · 2:00 PM</p>
            </div>
            <button type="button"
              className="shrink-0 flex items-center gap-1 py-1.5 px-3 bg-white text-orange-500 text-xs font-semibold rounded-lg hover:bg-orange-50 transition-colors">
              <Video size={11} /> Join
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-base font-bold text-gray-800 shrink-0">My Appointments</h2>
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search in table..." value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-8 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 placeholder-gray-300" />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {(["All", "Scheduled", "Completed", "Cancelled"] as (AppStatus | "All")[]).map(s => (
                    <button key={s} type="button" onClick={() => { setStatus(s); setPage(1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${status === s ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                      {s === "All" ? "All Statuses" : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-auto flex-1">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {(["DATE & TIME", "CLIENT NAME", "MEETING TYPE", "STATUS", "ACTIONS"] as const).map(h => {
                    const col = h === "DATE & TIME" ? "date" : h === "CLIENT NAME" ? "client" : null;
                    const active = col && sortCol === col;
                    return (
                      <th key={h} className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 tracking-wider">
                        {col ? (
                          <button type="button" onClick={() => toggleSort(col)}
                            className={`flex items-center gap-1 hover:text-gray-700 transition-colors ${active ? "text-orange-500" : ""}`}>
                            {h}
                            {active ? sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} /> : <ArrowUpDown size={11} className="text-gray-300" />}
                          </button>
                        ) : h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginated.map(a => (
                  <tr key={a.id} onClick={() => setSelected(a)}
                    className="border-b border-gray-50 hover:bg-orange-50/40 cursor-pointer transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-800">{a.date}</p>
                      <p className="text-xs text-gray-500">{a.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users size={14} className="text-gray-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-800">{a.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {a.type === "Google Meet"
                        ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium"><Video size={12} /> Google Meet</span>
                        : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-600 text-xs font-medium"><MapPin size={12} /> In-person</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[a.status]}`}>
                        ● {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      {a.status === "Completed" && (
                        <button type="button" onClick={() => setFeedback(a)}
                          className="text-sm text-orange-500 hover:text-orange-600 font-medium border border-orange-200 hover:border-orange-400 px-3 py-1 rounded-lg transition-colors">
                          View Feedback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 md:px-6 py-3 border-t border-gray-100 shrink-0">
            <p className="text-xs text-gray-500">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} appointments
            </p>
            <div className="flex items-center gap-1">
              <button type="button" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2 py-1 text-xs text-gray-500 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                <ChevronLeft size={14} /> Previous
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => safePage <= 2 ? i + 1 : safePage - 1 + i).filter(n => n >= 1 && n <= totalPages).map(n => (
                <button key={n} type="button" onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded text-xs font-medium ${n === safePage ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  {n}
                </button>
              ))}
              {totalPages > 3 && <span className="px-1 text-gray-400 text-xs">...</span>}
              {totalPages > 3 && (
                <button type="button" onClick={() => setPage(totalPages)}
                  className={`w-7 h-7 rounded text-xs font-medium ${safePage === totalPages ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  {totalPages}
                </button>
              )}
              <button type="button" disabled={safePage >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-2 py-1 text-xs text-orange-500 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1">
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
