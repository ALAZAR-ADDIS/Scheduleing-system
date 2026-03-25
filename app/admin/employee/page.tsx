"use client";
import { useState } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import EmployeeDetailModal, { Employee } from "@/components/admin/employee/EmployeeDetailModal";

type EmployeeStatus = "Active" | "Inactive";

const MOCK_EMPLOYEES: Employee[] = [
  { id: "E001", name: "Jane Cooper",    joinedDate: "Joined Oct 2023",  email: "jane.cooper@example.com",  department: "Design",      role: "Sr. UI Designer",    status: "Active",   avatarColor: "bg-orange-300" },
  { id: "E002", name: "Robert Fox",     joinedDate: "Joined Sep 2023",  email: "robert.fox@example.com",   department: "Marketing",   role: "Growth Lead",        status: "Active",   avatarColor: "bg-gray-400"   },
  { id: "E003", name: "Kristin Watson", joinedDate: "Joined Aug 2023",  email: "kristin.w@example.com",    department: "Sales",       role: "Account Manager",    status: "Inactive", avatarColor: "bg-slate-400"  },
  { id: "E004", name: "Cody Fisher",    joinedDate: "Joined July 2023", email: "cody.f@example.com",       department: "Engineering", role: "DevOps Engineer",    status: "Active",   avatarColor: "bg-teal-400"   },
  { id: "E005", name: "Bessie Cooper",  joinedDate: "Joined June 2023", email: "bessie.c@example.com",     department: "Design",      role: "Brand Designer",     status: "Inactive", avatarColor: "bg-gray-300"   },
  { id: "E006", name: "Guy Hawkins",    joinedDate: "Joined May 2023",  email: "guy.h@example.com",        department: "Engineering", role: "Full Stack Dev",     status: "Active",   avatarColor: "bg-slate-500"  },
  { id: "E007", name: "Amy Lee",        joinedDate: "Joined Apr 2023",  email: "amy.lee@example.com",      department: "Engineering", role: "Backend Engineer",   status: "Active",   avatarColor: "bg-purple-400" },
  { id: "E008", name: "Tom Harris",     joinedDate: "Joined Mar 2023",  email: "tom.harris@example.com",   department: "HR",          role: "HR Manager",         status: "Active",   avatarColor: "bg-green-400"  },
  { id: "E009", name: "Sara Ali",       joinedDate: "Joined Feb 2023",  email: "sara.ali@example.com",     department: "Finance",     role: "Financial Analyst",  status: "Inactive", avatarColor: "bg-pink-400"   },
  { id: "E010", name: "Chris Evans",    joinedDate: "Joined Jan 2023",  email: "chris.e@example.com",      department: "IT",          role: "IT Specialist",      status: "Active",   avatarColor: "bg-indigo-400" },
  { id: "E011", name: "Mia Wong",       joinedDate: "Joined Dec 2022",  email: "mia.wong@example.com",     department: "HR",          role: "Recruiter",          status: "Active",   avatarColor: "bg-teal-500"   },
  { id: "E012", name: "Jake Paul",      joinedDate: "Joined Nov 2022",  email: "jake.paul@example.com",    department: "Finance",     role: "Budget Analyst",     status: "Inactive", avatarColor: "bg-red-400"    },
  { id: "E013", name: "Nina Patel",     joinedDate: "Joined Oct 2022",  email: "nina.patel@example.com",   department: "IT",          role: "Network Engineer",   status: "Active",   avatarColor: "bg-cyan-400"   },
  { id: "E014", name: "Mike Smith",     joinedDate: "Joined Sep 2022",  email: "mike.smith@example.com",   department: "Sales",       role: "Sales Executive",    status: "Active",   avatarColor: "bg-blue-400"   },
  { id: "E015", name: "Abebe Reta",     joinedDate: "Joined Aug 2022",  email: "abebe.r@example.com",      department: "Marketing",   role: "Content Strategist", status: "Active",   avatarColor: "bg-yellow-500" },
];

const DEPARTMENTS = ["All Departments", "Design", "Marketing", "Sales", "Engineering", "HR", "Finance", "IT"];
const STATUS_FILTERS = ["All Users", "Active", "Inactive"];
const PAGE_SIZE = 10;

const statusStyle: Record<EmployeeStatus, string> = {
  Active:   "bg-green-100 text-green-600",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function EmployeePage() {
  const [search,       setSearch]       = useState("");
  const [activeDept,   setActiveDept]   = useState("All Departments");
  const [deptOpen,     setDeptOpen]     = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Users");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState<Employee | null>(null);

  const filtered = MOCK_EMPLOYEES.filter((e) => {
    const matchDept   = activeDept === "All Departments" || e.department === activeDept;
    const matchFilter = activeFilter === "All Users" || e.status === activeFilter;
    const matchSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Page title */}
      <div className="flex items-center gap-2 px-6 py-4 bg-white border-b border-gray-100 shrink-0">
        <div className="w-6 h-6 bg-orange-500 rounded grid place-items-center">
          <span className="text-white text-xs font-bold">U</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">User Management</h1>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden px-4 md:px-6 py-4 gap-4">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <span className="text-orange-500 text-lg font-bold">👥</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Employees</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight">{MOCK_EMPLOYEES.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <span className="text-green-500 text-lg font-bold">✓</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Active</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight">{MOCK_EMPLOYEES.filter(e => e.status === "Active").length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
              <span className="text-gray-500 text-lg font-bold">⏸</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Inactive</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight">{MOCK_EMPLOYEES.filter(e => e.status === "Inactive").length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <span className="text-blue-500 text-lg font-bold">🏢</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Departments</p>
              <p className="text-2xl font-bold text-gray-800 leading-tight">{DEPARTMENTS.length - 1}</p>
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 md:px-6 py-4 border-b border-gray-100 shrink-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-700 placeholder-gray-300"
                />
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDeptOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  {activeDept} <ChevronDown size={14} />
                </button>
                {deptOpen && (
                  <div className="absolute top-full mt-1 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[170px]">
                    {DEPARTMENTS.map((d) => (
                      <button key={d} type="button"
                        onClick={() => { setActiveDept(d); setDeptOpen(false); setPage(1); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          activeDept === d ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-wrap shrink-0">
                {STATUS_FILTERS.map((f) => (
                  <button key={f} type="button"
                    onClick={() => { setActiveFilter(f); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeFilter === f ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Table */}
          <div className="overflow-auto flex-1">
            <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-orange-50 text-xs text-gray-500 uppercase border-b border-gray-100">
              <th className="px-6 py-3 text-left font-semibold">Name <span className="text-orange-400">↕</span></th>
              <th className="px-6 py-3 text-left font-semibold text-orange-400">Email</th>
              <th className="px-6 py-3 text-left font-semibold text-orange-400">Department</th>
              <th className="px-6 py-3 text-left font-semibold text-orange-400">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-orange-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((emp) => (
              <tr key={emp.id} onClick={() => setSelected(emp)}
                className="border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${emp.avatarColor} grid place-items-center text-white text-sm font-bold shrink-0`}>
                      {emp.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{emp.name}</p>
                      <p className="text-xs text-gray-400">{emp.joinedDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                <td className="px-6 py-4 text-gray-700">{emp.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusStyle[emp.status]}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 md:px-6 py-3 text-xs text-gray-400 border-t border-gray-100 shrink-0">
          <span>Showing {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} employees</span>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={12} /> Previous
            </button>
            <span className="px-2 text-gray-500">{page} / {totalPages}</span>
            <button type="button" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ChevronRight size={12} />
            </button>
          </div>
          </div>
        </div>
      </main>

      {selected && (
        <EmployeeDetailModal employee={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
