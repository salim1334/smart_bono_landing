import { useEffect, useMemo, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import {
  Users,
  Filter,
  Loader2,
  Phone,
  Mail,
  Package,
} from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import { leadService } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import type { Lead, LeadStatus, PlanTier } from "@/lib/types";

const STATUS_OPTIONS: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "demo_scheduled",
  "follow_up_needed",
  "converted",
  "lost",
  "spam",
];

const STATUS_STYLES: Record<string, string> = {
  new: "bg-[oklch(0.78_0.16_75)]/20 text-[oklch(0.45_0.12_70)]",
  contacted: "bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)]",
  interested: "bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)]",
  demo_scheduled: "bg-[oklch(0.45_0.16_25)]/15 text-[oklch(0.45_0.16_25)]",
  follow_up_needed: "bg-orange-100 text-orange-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-600",
  spam: "bg-gray-100 text-gray-500",
};

const TIER_LABELS: Record<PlanTier, string> = {
  entry: "Entry",
  professional: "Professional",
  full: "Full",
  hybrid: "Hybrid",
};

function formatDate(lead: Lead): string {
  const ts = lead.createdAt;
  if (!ts?.toDate) return "—";
  return ts.toDate().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AdminLeadsPage() {
  const { profile } = useAuth();
  const search = useSearch({ strict: false }) as {
    status?: string;
    source?: string;
    tier?: string;
  };
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(search.status || "all");
  const [sourceFilter, setSourceFilter] = useState(
    search.source === "pricing" ? "pricing" : "all",
  );
  const [tierFilter, setTierFilter] = useState(search.tier || "all");

  useEffect(() => {
    if (search.status) setStatusFilter(search.status);
    if (search.source === "pricing") setSourceFilter("pricing");
    if (search.tier) setTierFilter(search.tier);
  }, [search.status, search.source, search.tier]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    setLoading(true);
    const unsub = leadService.subscribeToAll((list) => {
      setLeads(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (sourceFilter === "pricing" && lead.source !== "pricing_selection")
        return false;
      if (sourceFilter === "demo" && lead.source !== "demo_booking") return false;
      if (tierFilter !== "all" && lead.interestedTier !== tierFilter)
        return false;
      return true;
    });
  }, [leads, statusFilter, sourceFilter, tierFilter]);

  const handleStatus = async (id: string, status: LeadStatus) => {
    if (!profile?.uid) return;
    setUpdatingId(id);
    try {
      await leadService.updateStatus(id, status, profile.uid);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const notes = notesDraft[id];
    if (notes === undefined) return;
    setUpdatingId(id);
    try {
      await leadService.update(id, { adminNotes: notes });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <AdminTopBar
        title="Leads"
        subtitle="All inbound leads including pricing plan selections"
        actions={
          <div className="flex flex-wrap items-center gap-2 text-sm">
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
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All sources</option>
              <option value="pricing">Plan inquiries</option>
              <option value="demo">Demo bookings</option>
            </select>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="all">All plans</option>
              {(Object.keys(TIER_LABELS) as PlanTier[]).map((tier) => (
                <option key={tier} value={tier}>
                  {TIER_LABELS[tier]}
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
            <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No leads match your filters.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Business</th>
                  <th className="px-4 py-3 font-semibold">Plan</th>
                  <th className="px-4 py-3 font-semibold">Term</th>
                  <th className="px-4 py-3 font-semibold">Quoted</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-4">
                      <div className="font-medium text-foreground">
                        {lead.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        {lead.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {lead.businessName || "—"}
                      {lead.city ? (
                        <div className="text-xs">{lead.city}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      {lead.interestedTier ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)] capitalize">
                          <Package className="h-3 w-3" />
                          {TIER_LABELS[lead.interestedTier]}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {lead.billingTermMonths
                        ? `${lead.billingTermMonths} mo`
                        : "—"}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                      {lead.quotedMonthlyEtb != null ? (
                        <div>
                          <div className="font-medium text-foreground">
                            {lead.quotedMonthlyEtb.toLocaleString()} /mo
                          </div>
                          {lead.quotedTotalEtb != null && (
                            <div className="text-xs">
                              {lead.quotedTotalEtb.toLocaleString()} total
                            </div>
                          )}
                        </div>
                      ) : lead.interestedTier === "hybrid" ? (
                        <span className="text-xs">Custom</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs capitalize text-muted-foreground">
                        {lead.source.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) =>
                          handleStatus(lead.id, e.target.value as LeadStatus)
                        }
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full border-0 capitalize cursor-pointer ${
                          STATUS_STYLES[lead.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(lead)}
                    </td>
                    <td className="px-4 py-4 min-w-[180px]">
                      <input
                        type="text"
                        defaultValue={lead.adminNotes || ""}
                        placeholder="Admin notes…"
                        onChange={(e) =>
                          setNotesDraft((d) => ({
                            ...d,
                            [lead.id]: e.target.value,
                          }))
                        }
                        onBlur={() => handleSaveNotes(lead.id)}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
