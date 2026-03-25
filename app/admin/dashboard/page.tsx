"use client";
import { useState } from "react";
import StatsGrid from "@/components/admin/dashboard/StatsGrid";
import AppointmentTable from "@/components/admin/dashboard/AppointmentTable";
import AppointmentDetailModal from "@/components/admin/dashboard/AppointmentDetailModal";
import { MOCK_APPOINTMENTS, Appointment } from "@/state/slices/appointments/types";

export default function DashboardPage() {
  const [selected, setSelected] = useState<Appointment | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded grid place-items-center">
          <span className="text-white text-xs font-bold">D</span>
        </div>
        <h1 className="text-lg md:text-xl font-bold text-gray-800">Dashboard Overview</h1>
      </div>

      <StatsGrid />

      <AppointmentTable
        appointments={MOCK_APPOINTMENTS}
        onRowClick={setSelected}
      />

      {selected && (
        <AppointmentDetailModal
          appointment={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
