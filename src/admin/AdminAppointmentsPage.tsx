import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import {
  Calendar,
  Check,
  X,
  Loader2,
  Filter,
  Phone,
  Mail,
} from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import { appointmentService } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const STATUS_OPTIONS: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-[oklch(0.78_0.16_75)]/20 text-[oklch(0.45_0.12_70)]",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
  rescheduled: "bg-blue-100 text-blue-700",
  completed: "bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)]",
  no_show: "bg-gray-100 text-gray-600",
};

export function AdminAppointmentsPage() {
  const { profile } = useAuth();
  const search = useSearch({ strict: false }) as { status?: string };
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>(
    search.status || "all",
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsub = appointmentService.subscribeToAll((list) => {
      setAppointments(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return appointments;
    return appointments.filter((a) => a.status === statusFilter);
  }, [appointments, statusFilter]);

  const handleStatus = async (
    id: string,
    status: AppointmentStatus,
    extra?: { cancelReason?: string },
  ) => {
    if (!profile?.uid) return;
    setUpdatingId(id);
    try {
      await appointmentService.updateStatus(id, status, profile.uid, extra);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <AdminTopBar
        title="Appointments"
        subtitle="Review demo bookings and confirm or cancel slots"
        actions={
          <div className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <div className="px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            No appointments{statusFilter !== "all" ? ` with status "${statusFilter}"` : ""} yet.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((apt) => (
              <div
                key={apt.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-soft"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4 min-w-0">
                    <div className="h-12 w-12 rounded-xl gradient-burgundy flex items-center justify-center text-background shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-lg font-bold text-ink">
                        {apt.name}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {apt.businessName || apt.businessType || "—"}
                        {apt.businessSize ? ` · ${apt.businessSize} staff` : ""}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm">
                        <span className="font-medium">
                          {apt.date} · {apt.startTime}–{apt.endTime} EAT
                        </span>
                        <span className="capitalize text-muted-foreground">
                          {apt.demoType.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                        {apt.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {apt.phone}
                          </span>
                        )}
                        {apt.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {apt.email}
                          </span>
                        )}
                        {apt.userId && (
                          <span className="text-[oklch(0.5_0.08_195)]">
                            Signed-in user
                          </span>
                        )}
                      </div>
                      {apt.notes && (
                        <p className="mt-2 text-sm text-muted-foreground border-l-2 border-border pl-3">
                          {apt.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        STATUS_STYLES[apt.status] || "bg-gray-100"
                      }`}
                    >
                      {apt.status.replace("_", " ")}
                    </span>
                    {apt.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={updatingId === apt.id}
                          onClick={() => handleStatus(apt.id, "confirmed")}
                          className="flex items-center gap-1 rounded-lg bg-green-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingId === apt.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                          Confirm
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === apt.id}
                          onClick={() =>
                            handleStatus(apt.id, "cancelled", {
                              cancelReason: "Cancelled by admin",
                            })
                          }
                          className="flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted disabled:opacity-50"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      </div>
                    )}
                    {apt.status === "confirmed" && (
                      <button
                        type="button"
                        disabled={updatingId === apt.id}
                        onClick={() => handleStatus(apt.id, "completed")}
                        className="text-xs font-semibold text-[oklch(0.5_0.08_195)] hover:underline disabled:opacity-50"
                      >
                        Mark completed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
