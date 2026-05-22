import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Calendar,
  TrendingUp,
  Mail,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/admin/AdminLayout";
import { statsService } from "@/lib/firestore";
import type { Lead } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-[oklch(0.78_0.16_75)]/20 text-[oklch(0.45_0.12_70)]",
  contacted: "bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)]",
  interested: "bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)]",
  demo_scheduled: "bg-[oklch(0.45_0.16_25)]/15 text-[oklch(0.45_0.16_25)]",
  follow_up_needed: "bg-orange-100 text-orange-700",
  converted: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-600",
  spam: "bg-gray-100 text-gray-500",
};

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  convertedLeads: number;
  demoScheduled: number;
  conversionRate: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalCompanies: number;
  newsletterSubscribers: number;
  planInquiries: number;
  recentLeads: Lead[];
}

const TIER_LABELS: Record<string, string> = {
  entry: "Entry",
  professional: "Professional",
  full: "Full",
  hybrid: "Hybrid",
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService.getDashboardStats().then((s) => {
      setStats(s as DashboardStats);
      setLoading(false);
    });
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Leads",
          value: stats.totalLeads,
          sub: `${stats.newLeads} new today`,
          icon: Users,
          color: "gradient-teal",
          trend: "+12%",
        },
        {
          label: "Demos Booked",
          value: stats.totalAppointments,
          sub: `${stats.pendingAppointments} pending confirmation`,
          icon: Calendar,
          color: "gradient-burgundy",
          trend: "+8%",
        },
        {
          label: "Conversion Rate",
          value: `${stats.conversionRate}%`,
          sub: `${stats.convertedLeads} converted`,
          icon: TrendingUp,
          color: "bg-[oklch(0.78_0.16_75)]",
          trend: "+3%",
        },
        {
          label: "Plan Inquiries",
          value: stats.planInquiries,
          sub: `${stats.newsletterSubscribers} newsletter subscribers`,
          icon: Package,
          color: "bg-ink",
          trend: "",
        },
      ]
    : [];

  return (
    <AdminLayout>
      <AdminTopBar
        title="Dashboard"
        subtitle="Smart bono website admin overview"
        actions={
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </div>
        }
      />

      <div className="px-8 py-8 space-y-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card h-28 animate-pulse"
                />
              ))
            : statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center text-background ${card.color}`}
                    >
                      <card.icon className="h-5 w-5" />
                    </div>
                    {card.trend ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {card.trend}
                      </span>
                    ) : null}
                  </div>
                  <div className="font-display text-3xl font-bold text-ink">
                    {card.value}
                  </div>
                  <div className="text-sm font-medium text-foreground mt-0.5">
                    {card.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {card.sub}
                  </div>
                </motion.div>
              ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent leads */}
          <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-bold text-ink">
                Recent Leads
              </h2>
              <a
                href="/admin/leads"
                className="text-sm text-[oklch(0.5_0.08_195)] font-medium flex items-center gap-1 hover:underline"
              >
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
            <div className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-32 bg-muted rounded animate-pulse" />
                      <div className="h-3 w-48 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : stats?.recentLeads.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                  No leads yet. They'll appear here when visitors submit forms.
                </div>
              ) : (
                stats?.recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition"
                  >
                    <div className="h-9 w-9 rounded-full gradient-teal flex items-center justify-center text-background font-bold text-sm shrink-0">
                      {lead.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground">
                        {lead.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {lead.businessName ||
                          lead.businessType ||
                          "Unknown business"}
                        {lead.city ? ` · ${lead.city}` : ""}
                        {lead.interestedTier ? (
                          <span className="ml-1 text-[oklch(0.5_0.08_195)]">
                            · {TIER_LABELS[lead.interestedTier] || lead.interestedTier}
                            {lead.billingTermMonths
                              ? ` (${lead.billingTermMonths}mo)`
                              : ""}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {lead.interestedTier && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[oklch(0.5_0.08_195)]/15 text-[oklch(0.3_0.08_195)] capitalize">
                          {TIER_LABELS[lead.interestedTier]}
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                          STATUS_COLORS[lead.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick actions + funnel */}
          <div className="space-y-5">
            {/* Pending actions */}
            <div className="rounded-2xl border border-border bg-card shadow-soft p-5">
              <h2 className="font-display text-lg font-bold text-ink mb-4">
                Needs Attention
              </h2>
              <div className="space-y-3">
                <ActionRow
                  icon={Clock}
                  color="bg-[oklch(0.78_0.16_75)]"
                  label="Demo requests"
                  count={stats?.pendingAppointments || 0}
                  href="/admin/appointments"
                />
                <ActionRow
                  icon={AlertCircle}
                  color="bg-[oklch(0.45_0.16_25)]"
                  label="New leads"
                  count={stats?.newLeads || 0}
                  href="/admin/leads?status=new"
                />
                <ActionRow
                  icon={Package}
                  color="bg-ink"
                  label="Plan inquiries"
                  count={stats?.planInquiries || 0}
                  href="/admin/leads?source=pricing"
                />
                <ActionRow
                  icon={CheckCircle2}
                  color="bg-[oklch(0.5_0.08_195)]"
                  label="Confirmed demos"
                  count={stats?.confirmedAppointments || 0}
                  href="/admin/appointments?status=confirmed"
                />
              </div>
            </div>

            {/* Conversion funnel mini */}
            <div className="rounded-2xl border border-border bg-card shadow-soft p-5">
              <h2 className="font-display text-lg font-bold text-ink mb-4">
                Sales Funnel
              </h2>
              <FunnelBar
                label="Total leads"
                value={stats?.totalLeads || 0}
                max={stats?.totalLeads || 1}
                color="bg-[oklch(0.78_0.16_75)]"
              />
              <FunnelBar
                label="Demo booked"
                value={stats?.demoScheduled || 0}
                max={stats?.totalLeads || 1}
                color="bg-[oklch(0.5_0.08_195)]"
              />
              <FunnelBar
                label="Converted"
                value={stats?.convertedLeads || 0}
                max={stats?.totalLeads || 1}
                color="bg-[oklch(0.35_0.14_25)]"
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function ActionRow({
  icon: Icon,
  color,
  label,
  count,
  href,
}: {
  icon: typeof Clock;
  color: string;
  label: string;
  count: number;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition group"
    >
      <div
        className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center text-background shrink-0`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 text-sm text-foreground group-hover:text-ink transition">
        {label}
      </span>
      <span className="font-bold text-sm text-ink">{count}</span>
    </a>
  );
}

function FunnelBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-ink">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
