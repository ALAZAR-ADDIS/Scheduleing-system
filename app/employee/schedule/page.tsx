"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, CalendarDays, Clock } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
type Day = typeof DAYS[number];

const TIMES = [
  "06:00 AM","06:30 AM","07:00 AM","07:30 AM","08:00 AM","08:30 AM",
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM",
  "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM",
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["SU","MO","TU","WE","TH","FR","SA"];

type DaySchedule = { start: string; end: string };
type ExceptionalDay = { id: number; date: string; available: boolean; start: string; end: string };

function mockKey(offset: number) {
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
// Booked slots relative to today
const BOOKED: Record<string, string[]> = {
  [mockKey(0)]:  ["09:00 AM","10:00 AM","11:30 AM","02:00 PM","04:30 PM"],
  [mockKey(1)]:  ["09:30 AM","11:00 AM","01:30 PM","03:00 PM","05:00 PM"],
  [mockKey(2)]:  ["09:00 AM","10:30 AM","01:00 PM","03:30 PM","04:00 PM"],
  [mockKey(3)]:  ["10:00 AM","12:00 PM","02:30 PM","05:30 PM"],
  [mockKey(4)]:  ["09:30 AM","11:30 AM","03:00 PM"],
  [mockKey(5)]:  ["10:00 AM","12:30 PM","02:30 PM","04:00 PM","06:00 PM"],
  [mockKey(6)]:  ["09:00 AM","01:00 PM","05:00 PM"],
  [mockKey(7)]:  ["09:00 AM","10:30 AM","11:00 AM","03:30 PM","05:30 PM"],
  [mockKey(8)]:  ["10:00 AM","02:00 PM","04:30 PM"],
  [mockKey(9)]:  ["09:30 AM","01:00 PM","03:00 PM","04:00 PM"],
  [mockKey(10)]: ["10:30 AM","12:00 PM","01:00 PM","05:00 PM"],
  [mockKey(11)]: ["09:00 AM","11:30 AM","02:30 PM","06:00 PM"],
  [mockKey(12)]: ["09:00 AM","10:00 AM","03:00 PM","04:30 PM"],
  [mockKey(14)]: ["09:00 AM","11:00 AM","02:00 PM","04:30 PM","05:30 PM"],
};
// All days in window get a fixed set of available slots (09:00 AM – 06:00 PM)
const ALL_DAY_SLOTS = [
  "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM",
];

function pad(n: number) { return String(n).padStart(2, "0"); }
function toKey(y: number, m: number, d: number) { return `${y}-${pad(m+1)}-${pad(d)}`; }

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<Record<Day, DaySchedule>>({
    Monday:    { start: "09:00 AM", end: "05:00 PM" },
    Tuesday:   { start: "09:00 AM", end: "05:00 PM" },
    Wednesday: { start: "09:00 AM", end: "05:00 PM" },
    Thursday:  { start: "09:00 AM", end: "05:00 PM" },
    Friday:    { start: "09:00 AM", end: "05:00 PM" },
    Saturday:  { start: "10:00 AM", end: "02:00 PM" },
  });

  const [exceptions, setExceptions] = useState<ExceptionalDay[]>([
    { id: 1, date: "2024-01-20", available: true,  start: "10:00 AM", end: "03:00 PM" },
    { id: 2, date: "2024-01-27", available: false, start: "09:00 AM", end: "05:00 PM" },
  ]);
  const [newEx, setNewEx] = useState<{ date: string; available: boolean; start: string; end: string }>({
    date: "", available: true, start: "09:00 AM", end: "05:00 PM",
  });

  // Calendar state
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selDate,   setSelDate]   = useState(toKey(today.getFullYear(), today.getMonth(), today.getDate()));

  const windowEnd = new Date(today); windowEnd.setDate(today.getDate() + 29);
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11); } else setViewMonth(m => m-1); }
  function nextMonth() { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0); } else setViewMonth(m => m+1); }

  function updateDay(day: Day, field: keyof DaySchedule, value: string) {
    setSchedule(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  }

  function addException() {
    if (!newEx.date) return;
    setExceptions(prev => [...prev, { ...newEx, id: Date.now() }]);
    setNewEx({ date: "", available: true, start: "09:00 AM", end: "05:00 PM" });
  }

  function removeException(id: number) {
    setExceptions(prev => prev.filter(e => e.id !== id));
  }

  const selKey = selDate;
  const bookedSlots = BOOKED[selKey] || [];
  const selDateObj = new Date(selDate + "T00:00:00");
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][selDateObj.getDay()] as Day;
  const exMatch = exceptions.find(e => e.date === selDate);
  const dayConfig = exMatch ?? (DAYS.includes(dayName as Day) ? { available: true, start: schedule[dayName as Day].start, end: schedule[dayName as Day].end } : { available: false, start: "", end: "" });
  const selDateParsed = new Date(selDate + "T00:00:00");
  const inWindow = selDateParsed >= today && selDateParsed <= windowEnd;
  const availableSlots = inWindow && dayConfig.available ? ALL_DAY_SLOTS : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white border-b border-gray-100 px-6 py-4 shrink-0">
        <h1 className="text-lg font-bold text-gray-800">Schedule & Availability</h1>
        <p className="text-xs text-gray-400 mt-0.5">Set your weekly availability and manage exceptional days</p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5 space-y-5">

        {/* Weekly Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Clock size={15} className="text-orange-500" /> Weekly Availability
            </h2>
            <button type="button"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">
              Save Schedule
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {DAYS.map(day => {
              const cfg = schedule[day];
              const short = day.slice(0, 3).toUpperCase();
              return (
                <div key={day} className="flex flex-col gap-2 p-3 rounded-xl border border-orange-100 bg-orange-50/30">
                  <p className="text-xs font-bold text-orange-500 text-center tracking-wide">{short}</p>
                  <p className="text-[10px] text-gray-400 text-center">{day}</p>
                  <div className="border-t border-orange-100 pt-2 space-y-2">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Start</p>
                      <select value={cfg.start} onChange={e => updateDay(day, "start", e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg px-1.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 bg-white">
                        {TIMES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">End</p>
                      <select value={cfg.end} onChange={e => updateDay(day, "end", e.target.value)}
                        className="w-full text-xs border border-gray-200 rounded-lg px-1.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 bg-white">
                        {TIMES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exceptional Days */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CalendarDays size={15} className="text-orange-500" /> Exceptional Days
            <span className="text-xs text-gray-400 font-normal ml-1">Override your weekly schedule for specific dates</span>
          </h2>

          {/* Add new exception */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl border border-dashed border-orange-200 bg-orange-50/30 mb-4">
            <input type="date" value={newEx.date} onChange={e => setNewEx(p => ({ ...p, date: e.target.value }))}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 bg-white" />

            <div className="flex items-center gap-2">
              <input type="checkbox" id="newex-avail" checked={newEx.available}
                onChange={e => setNewEx(p => ({ ...p, available: e.target.checked }))}
                className="w-4 h-4 accent-orange-500 cursor-pointer" />
              <label htmlFor="newex-avail" className="text-sm text-gray-600 cursor-pointer">Available</label>
            </div>

            <div className={`flex items-center gap-2 flex-1 ${!newEx.available ? "opacity-40 pointer-events-none" : ""}`}>
              <select value={newEx.start} onChange={e => setNewEx(p => ({ ...p, start: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 bg-white">
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
              <span className="text-gray-300">—</span>
              <select value={newEx.end} onChange={e => setNewEx(p => ({ ...p, end: e.target.value }))}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 bg-white">
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            <button type="button" onClick={addException}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shrink-0">
              <Plus size={14} /> Add
            </button>
          </div>

          {/* Exception list */}
          {exceptions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No exceptional days added yet.</p>
          ) : (
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "200px" }}>
              {exceptions.map(ex => (
                <div key={ex.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${ex.available ? "border-green-100 bg-green-50/40" : "border-red-100 bg-red-50/30"}`}>
                  <CalendarDays size={14} className={ex.available ? "text-green-500" : "text-red-400"} />
                  <span className="text-sm font-semibold text-gray-700 w-28 shrink-0">{ex.date}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ex.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                    {ex.available ? "Available" : "Unavailable"}
                  </span>
                  {ex.available && (
                    <span className="text-xs text-gray-500">{ex.start} — {ex.end}</span>
                  )}
                  <button type="button" onClick={() => removeException(ex.id)} className="ml-auto p-1 rounded-full hover:bg-gray-100 text-gray-400">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability Calendar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-800 mb-5 flex items-center gap-2">
            <CalendarDays size={15} className="text-orange-500" /> Availability Calendar
          </h2>

          <div className="flex flex-col sm:flex-row gap-10">
            {/* Calendar */}
            <div className="w-full sm:w-[520px] shrink-0">
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
                  const isSel    = key === selDate;
                  const isToday  = cellDate.getTime() === today.getTime();
                  const inWindow = cellDate >= today && cellDate <= windowEnd;
                  return (
                    <button key={i} type="button" onClick={() => inWindow && setSelDate(key)}
                      className={`mx-auto w-14 h-14 rounded-full text-sm font-medium flex items-center justify-center transition-colors
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

            {/* Slots panel */}
            <div className="w-full sm:w-44 shrink-0 flex flex-col" style={{ maxHeight: "260px" }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Slots</p>
              <p className="text-[10px] text-orange-500 font-medium mb-2 flex items-center gap-1">
                <CalendarDays size={10} />
                {new Date(selDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              </p>
              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" /> Booked</span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400"><span className="w-2.5 h-2.5 rounded-sm bg-orange-50 border border-orange-200 inline-block" /> Free</span>
              </div>
              {!inWindow || !dayConfig.available ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-gray-400 text-center">{!inWindow ? "Out of range" : "Unavailable"}</p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 space-y-1.5 pr-1">
                  {availableSlots.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No slots</p>
                  ) : availableSlots.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <div key={slot}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium border
                          ${isBooked ? "bg-orange-500 text-white border-orange-500" : "bg-orange-50 text-orange-700 border-orange-100"}`}>
                        {slot}
                        {isBooked && <span className="ml-1 text-[10px] opacity-80">(Booked)</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
