"use client";
import { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import ClientDetailModal, { Client } from "@/components/admin/clients/ClientDetailModal";

type ClientStatus = "Active" | "Inactive";

const MOCK_CLIENTS: Client[] = [
  { id: "#CL-0824", name: "Mulugeta Kebede",  email: "mulugeta.k@example.com",  totalAppts: 12, lastAppointment: "Oct 24, 2023", status: "Active",   avatarColor: "bg-teal-400"   },
  { id: "#CL-0791", name: "Sarah Jenkins",    email: "s.jenkins@domain.com",    totalAppts: 8,  lastAppointment: "Oct 21, 2023", status: "Active",   avatarColor: "bg-blue-400"   },
  { id: "#CL-0785", name: "Robert Wilson",    email: "rwilson@outlook.com",     totalAppts: 5,  lastAppointment: "Oct 19, 2023", status: "Inactive", avatarColor: "bg-purple-400" },
  { id: "#CL-0744", name: "Kevin Baker",      email: "kbaker_design@gmail.com", totalAppts: 21, lastAppointment: "Oct 15, 2023", status: "Active",   avatarColor: "bg-yellow-400" },
  { id: "#CL-0615", name: "TechCorp Inc.",    email: "billing@techcorp.io",     totalAppts: 14, lastAppointment: "Sep 28, 2023", status: "Inactive", avatarColor: "bg-orange-400" },
  { id: "#CL-0598", name: "Linda Moore",      email: "l.moore@example.com",     totalAppts: 9,  lastAppointment: "Sep 25, 2023", status: "Active",   avatarColor: "bg-green-400"  },
  { id: "#CL-0572", name: "James Carter",     email: "j.carter@example.com",    totalAppts: 3,  lastAppointment: "Sep 20, 2023", status: "Inactive", avatarColor: "bg-red-400"    },
  { id: "#CL-0541", name: "Olivia Brown",     email: "o.brown@example.com",     totalAppts: 17, lastAppointment: "Sep 18, 2023", status: "Active",   avatarColor: "bg-indigo-400" },
  { id: "#CL-0520", name: "Ethan Davis",      email: "e.davis@example.com",     totalAppts: 6,  lastAppointment: "Sep 10, 2023", status: "Active",   avatarColor: "bg-cyan-400"   },
  { id: "#CL-0498", name: "Sophia White",     email: "s.white@example.com",     totalAppts: 11, lastAppointment: "Sep 05, 2023", status: "Inactive", avatarColor: "bg-pink-400"   },
  { id: "#CL-0475", name: "Liam Johnson",     email: "l.johnson@example.com",   totalAppts: 7,  lastAppointment: "Aug 30, 2023", status: "Active",   avatarColor: "bg-lime-400"   },
  { id: "#CL-0450", name: "Emma Wilson",      email: "e.wilson@example.com",    totalAppts: 19, lastAppointment: "Aug 25, 2023", status: "Active",   avatarColor: "bg-blue-300"   },
];

const PAGE_SIZE = 8;
const STATUS_FILTERS = ["All", "Active", "Inactive"];

const statusStyle: Record<ClientStatus, string> = {
  Active:   "bg-green-100 text-green-600",
  Inactive: "bg-gray-100 text-gray-500",
};

export default function ClientsPage() {
  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState<Client | null>(null);

  const filtered = MOCK_CLIENTS.filter((c) => {
    const matchFilter = activeFilter === "All" || c.status === activeFilter;
    const matchSearch =
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6 space-y-5">
      {/* Page title */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded grid place-items-center">
          <span className="text-white text-xs font-bold">C</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800">Client Management</h1>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-orange-500 placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => { setActiveFilter(f); setPage(1); }}
              className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${
                activeFilter === f ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Client
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase">
              <th className="px-6 py-3 text-left font-medium">Name</th>
              <th className="px-6 py-3 text-left font-medium">Email</th>
              <th className="px-6 py-3 text-left font-medium text-orange-400">Total Appts</th>
              <th className="px-6 py-3 text-left font-medium text-orange-400">Last Appointment</th>
              <th className="px-6 py-3 text-left font-medium text-orange-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((client) => (
              <tr
                key={client.id}
                onClick={() => setSelected(client)}
                className="border-b border-gray-50 hover:bg-orange-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${client.avatarColor} grid place-items-center text-white text-sm font-bold shrink-0`}>
                      {client.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">{client.email}</td>
                <td className="px-6 py-4 font-semibold text-orange-500">
                  {String(client.totalAppts).padStart(2, "0")}
                </td>
                <td className="px-6 py-4 text-gray-600">{client.lastAppointment}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusStyle[client.status]}`}>
                    {client.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 text-xs text-gray-400 border-t border-gray-100">
          <span>Showing {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} clients</span>
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

      {/* Client Detail Modal */}
      {selected && (
        <ClientDetailModal client={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
