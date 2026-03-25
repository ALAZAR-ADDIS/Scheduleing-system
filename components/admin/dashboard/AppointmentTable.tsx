"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Appointment, DEPARTMENTS, STATUS_FILTERS, STATUS_STYLE } from "@/features/appointments/types";

type SortKey = "date" | "employee" | "client";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 8;

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ArrowUpDown size={12} className="inline ml-1 opacity-40" />;
  return sortDir === "asc"
    ? <ArrowUp size={12} className="inline ml-1 text-orange-500" />
    : <ArrowDown size={12} className="inline ml-1 text-orange-500" />;
}

type Props = {
  appointments: Appointment[];
  onRowClick: (a: Appointment) => void;
};

export default function AppointmentTable({ appointments, onRowClick }: Props) {
  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeDept,   setActiveDept]   = useState("All Departments");
  const [deptOpen,     setDeptOpen]     = useState(false);
  const [sortKey,      setSortKey]      = useState<SortKey | null>(null);
  const [sortDir,      setSortDir]      = useState<SortDir>("asc");
  const [page,         setPage]         = useState(1);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setPage(1);
  }

  const filtered = appointments
    .filter((a) => {
      const matchStatus = activeFilter === "All" || a.status === activeFilter;
      const matchDept   = activeDept === "All Departments" || a.department === activeDept;
      const matchSearch = search === "" ||
        a.client.toLowerCase().includes(search.toLowerCase()) ||
        a.employee.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchDept && matchSearch;
    })
    .sort((a, b) => {
      if (!sortKey) return 0;
      const va = a[sortKey].toLowerCase(), vb = b[sortKey].toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 px-4 md:px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-800 shrink-0">Appointment Overview</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-orange-500 placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Department dropdown */}
            <div className="relative">
              <button type="button" onClick={() => setDeptOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 whitespace-nowrap">
                <span className="hidden sm:inline">{activeDept}</span>
                <span className="sm:hidden">Dept</span>
                <ChevronDown size={14} />
              </button>
              {deptOpen && (
                <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                  {DEPARTMENTS.map((d) => (
                    <button key={d} type="button"
                      onClick={() => { setActiveDept(d); setDeptOpen(false); setPage(1); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        activeDept === d ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-600 hover:bg-gray-50"
                      }`}>{d}</button>
                  ))}
                </div>
              )}
            </div>
            {/* Status filters */}
            <div className="flex items-center gap-1 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button key={f} type="button"
                  onClick={() => { setActiveFilter(f); setPage(1); }}
                  className={`px-2.5 py-1.5 text-xs rounded-md font-medium transition-colors ${
                    activeFilter === f ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
            <th className="px-5 py-3 text-left font-medium">
              <button type="button" onClick={() => handleSort("date")} className="flex items-center hover:text-orange-500 transition-colors">
                Date <SortIcon col="date" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className="px-5 py-3 text-left font-medium">Time</th>
            <th className="px-5 py-3 text-left font-medium">
              <button type="button" onClick={() => handleSort("employee")} className="flex items-center hover:text-orange-500 transition-colors">
                Employee <SortIcon col="employee" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className="px-5 py-3 text-left font-medium">
              <button type="button" onClick={() => handleSort("client")} className="flex items-center hover:text-orange-500 transition-colors">
                Client <SortIcon col="client" sortKey={sortKey} sortDir={sortDir} />
              </button>
            </th>
            <th className="px-5 py-3 text-left font-medium">Department</th>
            <th className="px-5 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row)}
              className="border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition-colors"
            >
              <td className="px-5 py-3 text-gray-700">{row.date}</td>
              <td className="px-5 py-3 text-gray-500">{row.time}</td>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full ${row.employeeColor} grid place-items-center text-white text-xs font-bold`}>
                    {row.employee[0]}
                  </div>
                  <span className="text-gray-700">{row.employee}</span>
                </div>
              </td>
              <td className="px-5 py-3 text-gray-700">{row.client}</td>
              <td className="px-5 py-3 text-gray-500">{row.department}</td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_STYLE[row.status]}`}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-400">
        <span>Showing {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} results</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={12} /> Previous
          </button>
          <span className="px-2 text-gray-500">{page} / {totalPages}</span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
