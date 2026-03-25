type Stat = { label: string; value: string; highlight?: boolean };

const stats: Stat[] = [
  { label: "Total Clients",           value: "185" },
  { label: "Total Active Clients",    value: "142" },
  { label: "Total Employees",         value: "54"  },
  { label: "Total Active Employees",  value: "48"  },
  { label: "Total Appointments",      value: "1,284" },
  { label: "Cancelled Appts",         value: "32"  },
  { label: "Pending Appts",           value: "15 ↑", highlight: true },
];

export default function StatsGrid() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.slice(0, 4).map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.slice(4).map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
        <div className="hidden md:block" />
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: Stat) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold mt-1 text-orange-500">
        {value}
      </p>
    </div>
  );
}
