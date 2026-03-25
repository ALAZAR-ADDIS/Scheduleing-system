"use client";
import { useState } from "react";
import { X, User, Calendar, Star, ChevronLeft, ChevronRight, Mail } from "lucide-react";

type ClientStatus = "Active" | "Inactive";

export type Client = {
  id: string;
  name: string;
  email: string;
  totalAppts: number;
  lastAppointment: string;
  status: ClientStatus;
  avatarColor: string;
};

type Feedback = {
  service: string;
  date: string;
  rating: number;
  comment: string;
};

type ApptHistory = {
  date: string;
  time: string;
  employee: string;
  employeeInitials: string;
  employeeColor: string;
  department: string;
  status: "Completed" | "Scheduled" | "Cancelled";
};

const CLIENT_EXTRA: Record<string, { memberSince: string; feedbackScore: string }> = {
  "#CL-0824": { memberSince: "January 12, 2023",  feedbackScore: "4.8/5" },
  "#CL-0791": { memberSince: "March 05, 2023",    feedbackScore: "4.5/5" },
  "#CL-0785": { memberSince: "February 18, 2023", feedbackScore: "4.2/5" },
  "#CL-0744": { memberSince: "April 22, 2023",    feedbackScore: "4.9/5" },
  "#CL-0615": { memberSince: "May 10, 2023",      feedbackScore: "4.6/5" },
  "#CL-0598": { memberSince: "June 01, 2023",     feedbackScore: "4.3/5" },
  "#CL-0572": { memberSince: "July 14, 2023",     feedbackScore: "3.9/5" },
  "#CL-0541": { memberSince: "August 20, 2023",   feedbackScore: "4.7/5" },
  "#CL-0520": { memberSince: "September 03, 2023",feedbackScore: "4.4/5" },
  "#CL-0498": { memberSince: "September 18, 2023",feedbackScore: "4.1/5" },
  "#CL-0475": { memberSince: "October 02, 2023",  feedbackScore: "4.6/5" },
  "#CL-0450": { memberSince: "October 10, 2023",  feedbackScore: "4.8/5" },
};

const FEEDBACK_DATA: Record<string, Feedback[]> = {
  "#CL-0824": [
    { service: "Full System Audit",    date: "Oct 25, 2023", rating: 5, comment: "Excellent service and very professional staff. Highly recommend for any corporate audits. The team was punctual and the reporting was comprehensive." },
    { service: "Maintenance Check",    date: "Oct 13, 2023", rating: 4, comment: "Good experience overall. Very detailed report provided after the check. There was a slight delay in the arrival of the specialist, but they made up for it with quality work." },
    { service: "Quarterly Strategy",   date: "Aug 05, 2023", rating: 5, comment: "Amazing insights. This session transformed our workflow. Mulugeta is always impressed with the expertise shown." },
    { service: "Technical Support",    date: "Jul 18, 2023", rating: 5, comment: "The support team was very patient and solved our issue within an hour." },
    { service: "Initial Consultation", date: "Jun 10, 2023", rating: 4, comment: "Very informative session. Would have liked more follow-up materials." },
    { service: "Design Review",        date: "May 22, 2023", rating: 5, comment: "Outstanding design feedback. Helped us refine our product significantly." },
    { service: "HR Advisory",          date: "Apr 15, 2023", rating: 3, comment: "Decent session but felt a bit rushed. Could be more thorough." },
    { service: "Finance Planning",     date: "Mar 08, 2023", rating: 5, comment: "Exceptional financial planning advice. Very actionable recommendations." },
  ],
  default: [
    { service: "Initial Consultation", date: "Oct 20, 2023", rating: 5, comment: "Great experience overall. Very professional and knowledgeable team." },
    { service: "Follow-up Session",    date: "Sep 15, 2023", rating: 4, comment: "Good follow-up. Addressed all our concerns effectively." },
    { service: "Technical Review",     date: "Aug 10, 2023", rating: 5, comment: "Excellent technical insights. Highly recommended." },
    { service: "Strategy Meeting",     date: "Jul 05, 2023", rating: 4, comment: "Very productive strategy session with clear action items." },
  ],
};

const APPT_HISTORY_DATA: Record<string, ApptHistory[]> = {
  "#CL-0824": [
    { date: "Oct 28, 2023", time: "10:30 AM", employee: "John Doe",      employeeInitials: "JD", employeeColor: "bg-orange-400", department: "Quality Assurance", status: "Completed" },
    { date: "Nov 05, 2023", time: "02:15 PM", employee: "Sarah Miller",  employeeInitials: "SM", employeeColor: "bg-blue-400",   department: "Technical Support", status: "Scheduled" },
    { date: "Oct 12, 2023", time: "09:00 AM", employee: "Robert Wilson", employeeInitials: "RW", employeeColor: "bg-purple-400", department: "Consulting",        status: "Cancelled" },
    { date: "Sep 25, 2023", time: "11:00 AM", employee: "John Doe",      employeeInitials: "JD", employeeColor: "bg-orange-400", department: "Technical Support", status: "Completed" },
    { date: "Aug 30, 2023", time: "03:30 PM", employee: "Sarah Miller",  employeeInitials: "SM", employeeColor: "bg-blue-400",   department: "Customer Success",  status: "Completed" },
    { date: "Aug 10, 2023", time: "10:00 AM", employee: "Amy Lee",       employeeInitials: "AL", employeeColor: "bg-green-400",  department: "Design",            status: "Completed" },
    { date: "Jul 22, 2023", time: "01:00 PM", employee: "Mike Smith",    employeeInitials: "MS", employeeColor: "bg-teal-400",   department: "Sales",             status: "Completed" },
    { date: "Jun 15, 2023", time: "09:30 AM", employee: "John Doe",      employeeInitials: "JD", employeeColor: "bg-orange-400", department: "Quality Assurance", status: "Cancelled" },
    { date: "May 28, 2023", time: "02:00 PM", employee: "Sarah Miller",  employeeInitials: "SM", employeeColor: "bg-blue-400",   department: "Technical Support", status: "Completed" },
    { date: "Apr 10, 2023", time: "11:30 AM", employee: "Robert Wilson", employeeInitials: "RW", employeeColor: "bg-purple-400", department: "Consulting",        status: "Completed" },
    { date: "Mar 05, 2023", time: "03:00 PM", employee: "Amy Lee",       employeeInitials: "AL", employeeColor: "bg-green-400",  department: "Design",            status: "Scheduled" },
    { date: "Feb 18, 2023", time: "10:00 AM", employee: "Mike Smith",    employeeInitials: "MS", employeeColor: "bg-teal-400",   department: "Sales",             status: "Completed" },
  ],
  default: [
    { date: "Oct 20, 2023", time: "09:00 AM", employee: "John Doe",     employeeInitials: "JD", employeeColor: "bg-orange-400", department: "Design",            status: "Completed" },
    { date: "Sep 15, 2023", time: "02:00 PM", employee: "Amy Lee",      employeeInitials: "AL", employeeColor: "bg-green-400",  department: "Engineering",       status: "Scheduled" },
    { date: "Aug 10, 2023", time: "11:00 AM", employee: "Mike Smith",   employeeInitials: "MS", employeeColor: "bg-blue-400",   department: "Sales",             status: "Completed" },
    { date: "Jul 05, 2023", time: "03:30 PM", employee: "Sarah Miller", employeeInitials: "SM", employeeColor: "bg-purple-400", department: "Technical Support", status: "Cancelled" },
  ],
};

const APPT_STATUS_STYLE: Record<string, string> = {
  Completed: "text-green-600",
  Scheduled: "text-orange-500",
  Cancelled: "text-red-500",
};

const APPT_FILTERS = ["All", "Scheduled", "Completed", "Cancelled"];
const FB_PAGE_SIZE   = 4;
const APPT_PAGE_SIZE = 5;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
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

type Props = { client: Client; onClose: () => void };

export default function ClientDetailModal({ client, onClose }: Props) {
  const [tab,        setTab]        = useState<"personal" | "history">("personal");
  const [apptFilter, setApptFilter] = useState("All");
  const [fbPage,     setFbPage]     = useState(1);
  const [apptPage,   setApptPage]   = useState(1);

  const extra       = CLIENT_EXTRA[client.id] ?? { memberSince: "N/A", feedbackScore: "N/A" };
  const feedbacks   = FEEDBACK_DATA[client.id]     ?? FEEDBACK_DATA["default"];
  const apptHistory = APPT_HISTORY_DATA[client.id] ?? APPT_HISTORY_DATA["default"];

  const filteredAppts  = apptHistory.filter((a) => apptFilter === "All" || a.status === apptFilter);
  const fbTotalPages   = Math.max(1, Math.ceil(feedbacks.length / FB_PAGE_SIZE));
  const apptTotalPages = Math.max(1, Math.ceil(filteredAppts.length / APPT_PAGE_SIZE));
  const paginatedFb    = feedbacks.slice((fbPage - 1) * FB_PAGE_SIZE, fbPage * FB_PAGE_SIZE);
  const paginatedAppt  = filteredAppts.slice((apptPage - 1) * APPT_PAGE_SIZE, apptPage * APPT_PAGE_SIZE);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 flex flex-col max-h-[92vh]" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-full grid place-items-center">
              <User size={13} className="text-white" />
            </div>
            <h2 className="text-base font-bold text-gray-800">Client Detail View</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-3 border-b border-gray-100 shrink-0">
          <button type="button" onClick={() => setTab("personal")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === "personal" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <User size={14} /> Personal Details
          </button>
          <button type="button" onClick={() => setTab("history")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === "history" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <Calendar size={14} /> Appointment History
          </button>
        </div>

        {/* Personal Details Tab */}
        {tab === "personal" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-4">

              {/* Client Info Card */}
              <div className="border border-gray-100 rounded-xl p-4 flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl ${client.avatarColor} grid place-items-center text-white text-2xl font-bold shrink-0`}>
                  {client.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{client.name}</h3>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs font-semibold text-orange-500">CLIENT ID: {client.id}</span>
                        <span className={`text-xs font-semibold flex items-center gap-1 ${client.status === "Active" ? "text-green-500" : "text-gray-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${client.status === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
                          {client.status.toUpperCase()} STATUS
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Total Appts</p>
                        <p className="text-xl font-bold text-gray-800">{client.totalAppts}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Feedback Score</p>
                        <p className="text-xl font-bold text-orange-500">{extra.feedbackScore}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-3">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email Address</p>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Mail size={12} className="text-gray-400" />
                        {client.email}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Member Since</p>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Calendar size={12} className="text-gray-400" />
                        {extra.memberSince}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedbacks header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-orange-100 rounded grid place-items-center">
                    <Star size={11} className="text-orange-500 fill-orange-500" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Feedbacks Provided</span>
                </div>
                <span className="text-xs text-gray-400">Total: {feedbacks.length} Feedbacks</span>
              </div>

              {/* Feedback items */}
              {paginatedFb.map((fb, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <StarRating rating={fb.rating} />
                    <span className="text-xs text-gray-400">{fb.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide">Service: {fb.service}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">&quot;{fb.comment}&quot;</p>
                </div>
              ))}

              {/* Pagination inside scroll */}
              <div className="flex items-center justify-between pt-2 pb-4">
                <span className="text-xs text-gray-400">Showing {Math.min(fbPage * FB_PAGE_SIZE, feedbacks.length)} of {feedbacks.length} feedbacks</span>
                <PageButtons page={fbPage} total={fbTotalPages} onChange={setFbPage} />
              </div>

              </div>
            </div>

          </div>
        )}

        {/* Appointment History Tab */}
        {tab === "history" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-1 px-6 py-3 shrink-0">
              {APPT_FILTERS.map((f) => (
                <button key={f} type="button" onClick={() => { setApptFilter(f); setApptPage(1); }}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                    apptFilter === f ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white">
                  <tr className="border-y border-gray-100 text-xs text-gray-400 uppercase">
                    <th className="px-6 py-2 text-left font-medium">Date & Time</th>
                    <th className="px-6 py-2 text-left font-medium">Employee</th>
                    <th className="px-6 py-2 text-left font-medium">Department</th>
                    <th className="px-6 py-2 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedAppt.map((a, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-800">{a.date}</p>
                        <p className="text-xs text-gray-400">{a.time}</p>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full ${a.employeeColor} grid place-items-center text-white text-xs font-bold shrink-0`}>
                            {a.employeeInitials}
                          </div>
                          <span className="text-gray-700">{a.employee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{a.department}</td>
                      <td className={`px-6 py-3 font-semibold ${APPT_STATUS_STYLE[a.status]}`}>{a.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 shrink-0">
              <span className="text-xs text-gray-400">Showing {Math.min(apptPage * APPT_PAGE_SIZE, filteredAppts.length)} of {filteredAppts.length} appointments</span>
              <PageButtons page={apptPage} total={apptTotalPages} onChange={setApptPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
