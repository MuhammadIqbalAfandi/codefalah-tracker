import {
  ArrowRight,
  BookOpenText,
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  CircleDashed,
  Dumbbell,
  Flame,
  Landmark,
  Moon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLoaderData, useRevalidator, useSearchParams } from "react-router";

import type { Route } from "./+types/dashboard";
import { ContributionGraph } from "~/components/contribution-graph";
import { EmptyState } from "~/components/empty-state";
import { MainLayout } from "~/components/main-layout";
import { Button } from "~/components/ui/button";
import { formatLocalDateInputValue } from "~/lib/form-defaults";
import { subscribeToTrackerDataChanges } from "~/lib/tracker-sync";
import { cn } from "~/lib/utils";
import { apiRequest } from "~/services/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | Codefalah Tracker" },
    {
      name: "description",
      content: "Ringkasan aktivitas Personal Modular Tracker App.",
    },
  ];
}

type DashboardSummary = {
  date: string;
  sholat: {
    completed_count: number;
    total_count: number;
  };
  puasa: {
    fast_type: string;
    completed: boolean;
  };
  finance: {
    income: string;
    expense: string;
    balance: string;
  };
  sport: {
    completed_count: number;
    completed_minutes: number;
  };
  journal: {
    written: boolean;
  };
};

type ModuleKey = "sholat" | "puasa" | "keuangan" | "olahraga" | "jurnal";

type ModuleContributionResponse = {
  start_date: string;
  end_date: string;
  modules: Array<{
    module: ModuleKey;
    label: string;
    days: Array<{
      date: string;
      score: number;
    }>;
  }>;
};

type DashboardLoaderData = {
  summary: DashboardSummary;
  moduleContributions: ModuleContributionResponse;
  availableYears: number[];
  selectedYear: number;
  apiError?: string;
};

type InsightDay = {
  date: string;
  score: number;
  activeModules: number;
};

type ModuleStatus = {
  module: ModuleKey;
  label: string;
  value: string;
  detail: string;
  hint: string;
  href: string;
  completed: boolean;
  countsTowardDailyProgress: boolean;
};

const emptySummary: DashboardSummary = {
  date: formatLocalDateInputValue(new Date()),
  sholat: {
    completed_count: 0,
    total_count: 5,
  },
  puasa: {
    fast_type: "",
    completed: false,
  },
  finance: {
    income: "0",
    expense: "0",
    balance: "0",
  },
  sport: {
    completed_count: 0,
    completed_minutes: 0,
  },
  journal: {
    written: false,
  },
};

const emptyModuleContributions: ModuleContributionResponse = {
  start_date: "",
  end_date: "",
  modules: [
    { module: "sholat", label: "Sholat", days: [] },
    { module: "puasa", label: "Puasa", days: [] },
    { module: "keuangan", label: "Keuangan", days: [] },
    { module: "olahraga", label: "Olahraga", days: [] },
    { module: "jurnal", label: "Jurnal", days: [] },
  ],
};

export async function loader({
  request,
}: Route.LoaderArgs): Promise<DashboardLoaderData> {
  const url = new URL(request.url);
  const currentYear = new Date().getFullYear();
  const selectedYear = parseSelectedYear(url.searchParams.get("year"), currentYear);
  const availableYears = buildAvailableYears(currentYear);
  const contributionRange = getContributionRangeForYear(selectedYear, currentYear);
  const contributionPath = `/api/dashboard/module-contributions?start_date=${contributionRange.startDate}&end_date=${contributionRange.endDate}`;

  const [summaryResult, moduleContributionsResult] = await Promise.allSettled([
    apiRequest<DashboardSummary>("/api/dashboard/summary"),
    apiRequest<ModuleContributionResponse>(contributionPath),
  ]);

  const summary =
    summaryResult.status === "fulfilled" ? summaryResult.value : emptySummary;
  const moduleContributions =
    moduleContributionsResult.status === "fulfilled"
      ? moduleContributionsResult.value
      : {
          ...emptyModuleContributions,
          start_date: contributionRange.startDate,
          end_date: contributionRange.endDate,
        };

  return {
    summary,
    moduleContributions,
    availableYears,
    selectedYear,
    apiError:
      summaryResult.status === "rejected" ||
      moduleContributionsResult.status === "rejected"
        ? "Data backend belum tersedia. Dashboard menampilkan nilai kosong sementara."
        : undefined,
  };
}

export default function DashboardRoute() {
  const { summary, moduleContributions, availableYears, selectedYear, apiError } =
    useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const revalidator = useRevalidator();

  useEffect(() => {
    return subscribeToTrackerDataChanges(() => {
      revalidator.revalidate();
    });
  }, [revalidator]);

  const moduleStatuses = getModuleStatuses(summary);
  const dailyStatuses = moduleStatuses.filter(
    (status) => status.countsTowardDailyProgress,
  );
  const completedDailySignals = dailyStatuses.filter((status) => status.completed).length;
  const progressPercent = Math.round(
    (completedDailySignals / Math.max(dailyStatuses.length, 1)) * 100,
  );
  const nextAction = getNextAction(moduleStatuses);
  const combinedContributionDays = getCombinedContributionDays(moduleContributions);
  const contributionStats = getContributionStats(combinedContributionDays);
  const weeklySummary = getWeeklySummary(combinedContributionDays);
  const monthlyInsight = getMonthlyInsight(combinedContributionDays, selectedYear);
  const recommendation = getRecommendation(summary, moduleStatuses, contributionStats);
  const trend = getTrendSummary(combinedContributionDays);
  const selectedRangeLabel = formatRangeLabel(
    moduleContributions.start_date,
    moduleContributions.end_date,
  );

  return (
    <MainLayout
      title="Dashboard"
      description="Dashboard yang menyorot progres hari ini, insight singkat, dan contribution tahunan supaya langkah berikutnya lebih cepat terbaca."
    >
      {apiError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {apiError}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="border-b border-border/60 bg-[linear-gradient(135deg,rgba(14,116,144,0.12),rgba(251,191,36,0.16),rgba(255,255,255,0.92))] px-6 py-6 dark:bg-[linear-gradient(135deg,rgba(14,116,144,0.18),rgba(251,191,36,0.12),rgba(24,24,27,0.94))]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Progress Hari Ini
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                  {progressPercent}% progres harian sudah bergerak.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {completedDailySignals} dari {dailyStatuses.length} sinyal utama sudah
                  selesai. Fokus berikutnya diarahkan ke aktivitas yang paling dekat
                  untuk dilanjutkan hari ini.
                </p>
              </div>
              <div className="min-w-52 rounded-3xl border border-border/70 bg-background/80 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Tanggal acuan
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">{summary.date}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Contribution sedang dibaca untuk rentang {selectedRangeLabel}.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>Progress inti harian</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-background/80">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e,#f59e0b)] transition-[width]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to={nextAction.href}>
                  {nextAction.ctaLabel}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to={buildYearHref(searchParams, selectedYear)}>
                  Lihat contribution {selectedYear}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 px-6 py-5 md:grid-cols-2 xl:grid-cols-3">
            {moduleStatuses.map((status) => (
              <ModuleProgressPill key={status.module} status={status} />
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">Quick Summary</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Ringkasan singkat supaya kondisi tiap area cepat terbaca tanpa membuka
                detail module.
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Scan cepat
            </span>
          </div>
          <div className="mt-5 grid gap-3">
            {moduleStatuses.map((status) => (
              <QuickSummaryRow key={status.module} status={status} />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title={selectedYear === new Date().getFullYear() ? "Streak saat ini" : "Streak akhir rentang"}
          value={`${contributionStats.currentStreak} hari`}
          detail={`Rekor terbaik ${contributionStats.longestStreak} hari aktif.`}
          tone={contributionStats.currentStreak > 0 ? "good" : "muted"}
          icon={Flame}
        />
        <InsightCard
          title="Weekly Summary"
          value={`${weeklySummary.currentWeekActiveDays} hari aktif`}
          detail={weeklySummary.deltaLabel}
          tone={weeklySummary.delta >= 0 ? "good" : "warn"}
          icon={CalendarClock}
        />
        <InsightCard
          title={`Insight ${monthlyInsight.label}`}
          value={`${monthlyInsight.activeDays} hari aktif`}
          detail={`${monthlyInsight.consistency}% konsisten, ${monthlyInsight.emptyDays} hari kosong.`}
          tone={monthlyInsight.activeDays > 0 ? "good" : "muted"}
          icon={Sparkles}
        />
        <InsightCard
          title="Arah berikutnya"
          value={recommendation.title}
          detail={recommendation.description}
          tone={recommendation.tone}
          icon={recommendation.icon}
        />
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">Contribution yang lebih ringan</h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {selectedRangeLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Contribution tetap jadi fondasi dashboard, tetapi sekarang dipadukan
              dengan insight aktif, filter tahun, dan kartu module yang lebih singkat
              agar pola konsistensi lebih cepat dipahami.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableYears.map((year) => (
              <Button
                key={year}
                asChild
                variant={year === selectedYear ? "default" : "outline"}
                size="sm"
              >
                <Link to={buildYearHref(searchParams, year)}>{year}</Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ContributionStatCard
            label="Hari aktif"
            value={String(contributionStats.activeDays)}
            detail={`${contributionStats.totalDays} hari dipantau`}
          />
          <ContributionStatCard
            label="Konsistensi"
            value={`${contributionStats.consistencyRate}%`}
            detail={`${contributionStats.emptyDays} hari tanpa aktivitas`}
          />
          <ContributionStatCard
            label="Trend"
            value={trend.label}
            detail={trend.detail}
          />
          <ContributionStatCard
            label="Bulan terbaik"
            value={contributionStats.bestMonth.label}
            detail={`${contributionStats.bestMonth.activeDays} hari aktif`}
          />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {moduleContributions.modules.map((module) => (
            <ModuleContributionCard
              key={module.module}
              module={module}
              summary={summary}
              rangeLabel={selectedRangeLabel}
            />
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

function ModuleContributionCard({
  module,
  summary,
  rangeLabel,
}: {
  module: ModuleContributionResponse["modules"][number];
  summary: DashboardSummary;
  rangeLabel: string;
}) {
  const metadata = moduleMeta[module.module];
  const activeDays = module.days.length;
  const latestHighlight = getModuleHighlights(module.module, summary);

  return (
    <article className="rounded-[1.75rem] border border-border bg-background/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <metadata.icon className="size-3.5" aria-hidden="true" />
            {module.label}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            Contribution {module.label}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {metadata.description}
          </p>
        </div>
        <div className="grid gap-2 text-right text-xs text-muted-foreground">
          <span>{activeDays} hari aktif</span>
          <span>Rentang {rangeLabel}</span>
        </div>
      </div>

      {module.days.length === 0 ? (
        <div className="mt-4 space-y-3">
          <EmptyState
            icon={metadata.icon}
            title={`Belum ada contribution ${module.label.toLowerCase()}`}
            description="Mulai isi module ini supaya contribution dan insight bulanannya langsung terbentuk."
          />
          <Button asChild className="w-full">
            <Link to={metadata.href}>
              Mulai dari module {module.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <ContributionGraph
            compact
            title={`Ringkasan ${module.label}`}
            description={`Contribution ${module.label.toLowerCase()} untuk ${rangeLabel}.`}
            days={module.days}
          />
        </div>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="grid gap-2">
          {latestHighlight.map((item) => (
            <div key={item} className="rounded-2xl bg-muted/60 px-3 py-2 text-sm leading-6 text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button asChild variant="outline" className="sm:w-fit">
            <Link to={metadata.contributionHref}>
              Detail contribution
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild className="sm:w-fit">
            <Link to={metadata.href}>Buka module {module.label}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ModuleProgressPill({ status }: { status: ModuleStatus }) {
  const tone = status.completed ? "good" : "warn";

  return (
    <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{status.label}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">{status.value}</p>
        </div>
        <StatusBadge tone={tone} label={status.detail} />
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{status.hint}</p>
    </div>
  );
}

function QuickSummaryRow({ status }: { status: ModuleStatus }) {
  const tone = status.completed ? "good" : "warn";

  return (
    <Link
      to={status.href}
      className="flex items-center justify-between gap-3 rounded-3xl border border-border/70 bg-muted/35 px-4 py-3 transition-colors hover:bg-muted/60"
    >
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">{status.label}</p>
          <StatusBadge tone={tone} label={status.detail} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{status.hint}</p>
      </div>
      <div className="text-right">
        <p className="text-base font-semibold text-foreground">{status.value}</p>
        <p className="mt-1 text-xs text-muted-foreground">Lihat module</p>
      </div>
    </Link>
  );
}

function InsightCard({
  title,
  value,
  detail,
  tone,
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  tone: "good" | "warn" | "muted";
  icon: typeof Flame;
}) {
  return (
    <article className="rounded-[1.75rem] border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div
          className={cn(
            "rounded-2xl p-2",
            tone === "good" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
            tone === "warn" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
            tone === "muted" && "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
    </article>
  );
}

function ContributionStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/35 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function StatusBadge({
  tone,
  label,
}: {
  tone: "good" | "warn";
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "good" &&
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
        tone === "warn" &&
          "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
      )}
    >
      {tone === "good" ? (
        <CircleCheckBig className="size-3" aria-hidden="true" />
      ) : (
        <CircleAlert className="size-3" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

function getModuleStatuses(summary: DashboardSummary): ModuleStatus[] {
  const sholatComplete =
    summary.sholat.total_count > 0 &&
    summary.sholat.completed_count >= summary.sholat.total_count;
  const puasaValue = getPuasaSummaryValue(summary);
  const financeBalance = formatCurrency(summary.finance.balance);
  const sportComplete = summary.sport.completed_count > 0;

  return [
    {
      module: "sholat",
      label: "Sholat",
      value: `${summary.sholat.completed_count}/${summary.sholat.total_count}`,
      detail: sholatComplete ? "good" : "warning",
      hint: sholatComplete
        ? "Semua waktu sholat hari ini sudah tercatat."
        : `${summary.sholat.total_count - summary.sholat.completed_count} waktu sholat masih menunggu catatan.`,
      href: "/sholat",
      completed: sholatComplete,
      countsTowardDailyProgress: true,
    },
    {
      module: "puasa",
      label: "Puasa",
      value: puasaValue,
      detail: summary.puasa.completed ? "good" : "warning",
      hint: summary.puasa.fast_type
        ? summary.puasa.completed
          ? "Puasa hari ini sudah selesai tercatat."
          : "Catatan puasa sudah ada, tinggal pastikan statusnya selesai."
        : "Belum ada catatan puasa hari ini.",
      href: "/puasa",
      completed: summary.puasa.completed,
      countsTowardDailyProgress: true,
    },
    {
      module: "keuangan",
      label: "Keuangan",
      value: financeBalance,
      detail: Number(summary.finance.balance) >= 0 ? "good" : "warning",
      hint:
        Number(summary.finance.income) === 0 && Number(summary.finance.expense) === 0
          ? "Belum ada transaksi tercatat bulan ini."
          : `${formatCurrency(summary.finance.income)} pemasukan dan ${formatCurrency(summary.finance.expense)} pengeluaran bulan ini.`,
      href: "/keuangan",
      completed: Number(summary.finance.income) > 0 || Number(summary.finance.expense) > 0,
      countsTowardDailyProgress: false,
    },
    {
      module: "olahraga",
      label: "Olahraga",
      value: `${summary.sport.completed_minutes} menit`,
      detail: sportComplete ? "good" : "warning",
      hint: sportComplete
        ? `${summary.sport.completed_count} sesi selesai tercatat minggu ini.`
        : "Belum ada sesi olahraga selesai minggu ini.",
      href: "/olahraga",
      completed: sportComplete,
      countsTowardDailyProgress: true,
    },
    {
      module: "jurnal",
      label: "Jurnal",
      value: summary.journal.written ? "Sudah ditulis" : "Belum ditulis",
      detail: summary.journal.written ? "good" : "warning",
      hint: summary.journal.written
        ? "Refleksi hari ini sudah tercatat."
        : "Tambahkan satu catatan singkat untuk menutup hari dengan refleksi.",
      href: "/jurnal",
      completed: summary.journal.written,
      countsTowardDailyProgress: true,
    },
  ];
}

function getNextAction(statuses: ModuleStatus[]) {
  const unfinished = statuses.find(
    (status) => status.countsTowardDailyProgress && !status.completed,
  );

  if (unfinished) {
    return {
      href: unfinished.href,
      ctaLabel: `Lanjutkan ${unfinished.label.toLowerCase()}`,
    };
  }

  return {
    href: "/",
    ctaLabel: "Hari ini sudah rapi",
  };
}

function getCombinedContributionDays(
  moduleContributions: ModuleContributionResponse,
): InsightDay[] {
  const start = parseDateOnly(moduleContributions.start_date);
  const end = parseDateOnly(moduleContributions.end_date);

  if (!start || !end || start >= end) {
    return [];
  }

  const scoresByDate = new Map<string, { score: number; activeModules: number }>();
  for (const module of moduleContributions.modules) {
    for (const day of module.days) {
      const current = scoresByDate.get(day.date) ?? { score: 0, activeModules: 0 };
      scoresByDate.set(day.date, {
        score: Math.max(current.score, day.score),
        activeModules: current.activeModules + 1,
      });
    }
  }

  const days: InsightDay[] = [];
  const cursor = new Date(start);

  while (cursor < end) {
    const date = formatDateOnly(cursor);
    const value = scoresByDate.get(date);
    days.push({
      date,
      score: value?.score ?? 0,
      activeModules: value?.activeModules ?? 0,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function getContributionStats(days: InsightDay[]) {
  const activeDays = days.filter((day) => day.score > 0).length;
  const totalDays = days.length;
  const emptyDays = Math.max(totalDays - activeDays, 0);
  const consistencyRate =
    totalDays === 0 ? 0 : Math.round((activeDays / totalDays) * 100);
  const { currentStreak, longestStreak } = getStreaks(days);
  const bestMonth = getBestMonth(days);

  return {
    activeDays,
    totalDays,
    emptyDays,
    consistencyRate,
    currentStreak,
    longestStreak,
    bestMonth,
  };
}

function getWeeklySummary(days: InsightDay[]) {
  const currentWeek = days.slice(-7);
  const previousWeek = days.slice(-14, -7);
  const currentWeekActiveDays = currentWeek.filter((day) => day.score > 0).length;
  const previousWeekActiveDays = previousWeek.filter((day) => day.score > 0).length;
  const delta = currentWeekActiveDays - previousWeekActiveDays;

  return {
    currentWeekActiveDays,
    delta,
    deltaLabel:
      previousWeek.length === 0
        ? "Belum ada pembanding minggu sebelumnya."
        : delta >= 0
          ? `Naik ${delta} hari aktif dibanding minggu sebelumnya.`
          : `Turun ${Math.abs(delta)} hari aktif dibanding minggu sebelumnya.`,
  };
}

function getMonthlyInsight(days: InsightDay[], selectedYear: number) {
  const monthMap = new Map<
    string,
    {
      activeDays: number;
      totalDays: number;
      label: string;
    }
  >();

  for (const day of days) {
    const monthKey = day.date.slice(0, 7);
    const current = monthMap.get(monthKey) ?? {
      activeDays: 0,
      totalDays: 0,
      label: formatMonthLabel(day.date),
    };
    monthMap.set(monthKey, {
      ...current,
      activeDays: current.activeDays + (day.score > 0 ? 1 : 0),
      totalDays: current.totalDays + 1,
    });
  }

  const orderedMonths = Array.from(monthMap.entries()).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const activeMonthEntry = [...orderedMonths].reverse().find(([, month]) => month.activeDays > 0);
  const fallbackKey = `${selectedYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const fallbackMonth = monthMap.get(fallbackKey);
  const [, month] =
    activeMonthEntry ??
    (fallbackMonth ? [fallbackKey, fallbackMonth] : orderedMonths.at(-1) ?? ["", { activeDays: 0, totalDays: 0, label: "Bulan ini" }]);

  const consistency = month.totalDays === 0 ? 0 : Math.round((month.activeDays / month.totalDays) * 100);

  return {
    label: month.label,
    activeDays: month.activeDays,
    emptyDays: Math.max(month.totalDays - month.activeDays, 0),
    consistency,
  };
}

function getTrendSummary(days: InsightDay[]) {
  const currentWindow = days.slice(-14);
  const previousWindow = days.slice(-28, -14);
  const currentActive = currentWindow.filter((day) => day.score > 0).length;
  const previousActive = previousWindow.filter((day) => day.score > 0).length;

  if (currentWindow.length === 0 || previousWindow.length === 0) {
    return {
      label: "Belum cukup data",
      detail: "Trend akan muncul setelah rentang aktivitas lebih panjang.",
    };
  }

  if (currentActive > previousActive) {
    return {
      label: "Meningkat",
      detail: `${currentActive} hari aktif pada 14 hari terakhir, naik dari ${previousActive}.`,
    };
  }

  if (currentActive < previousActive) {
    return {
      label: "Menurun",
      detail: `${currentActive} hari aktif pada 14 hari terakhir, turun dari ${previousActive}.`,
    };
  }

  return {
    label: "Stabil",
    detail: `${currentActive} hari aktif pada dua periode 14 hari terakhir.`,
  };
}

function getRecommendation(
  summary: DashboardSummary,
  statuses: ModuleStatus[],
  contributionStats: ReturnType<typeof getContributionStats>,
) {
  const unfinished = statuses.find(
    (status) => status.countsTowardDailyProgress && !status.completed,
  );

  if (unfinished) {
    return {
      title: `Fokus ke ${unfinished.label.toLowerCase()}`,
      description: unfinished.hint,
      tone: "warn" as const,
      icon: CircleAlert,
    };
  }

  if (contributionStats.consistencyRate < 35) {
    return {
      title: "Jaga ritme harian",
      description: "Coba isi minimal satu module setiap hari agar pola konsistensi mulai terbentuk.",
      tone: "warn" as const,
      icon: TrendingDown,
    };
  }

  if (Number(summary.finance.income) === 0 && Number(summary.finance.expense) === 0) {
    return {
      title: "Catat transaksi pertama",
      description: "Satu pemasukan atau pengeluaran kecil sudah cukup untuk membuat ringkasan keuangan lebih hidup.",
      tone: "muted" as const,
      icon: CircleDashed,
    };
  }

  return {
    title: "Pertahankan momentumnya",
    description: "Mayoritas sinyal utama sudah selesai. Gunakan waktu sisanya untuk merapikan detail atau menambah catatan singkat.",
    tone: "good" as const,
    icon: TrendingUp,
  };
}

function getStreaks(days: InsightDay[]) {
  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;

  for (const day of days) {
    if (day.score > 0) {
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 0;
    }
  }

  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index]?.score > 0) {
      currentStreak += 1;
      continue;
    }
    break;
  }

  return { currentStreak, longestStreak };
}

function getBestMonth(days: InsightDay[]) {
  const monthMap = new Map<string, number>();

  for (const day of days) {
    if (day.score === 0) {
      continue;
    }
    const monthKey = day.date.slice(0, 7);
    monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + 1);
  }

  let best = { label: "Belum ada data", activeDays: 0 };
  for (const [monthKey, activeDays] of monthMap.entries()) {
    if (activeDays > best.activeDays) {
      best = {
        label: formatMonthLabel(`${monthKey}-01`),
        activeDays,
      };
    }
  }

  return best;
}

function parseSelectedYear(value: string | null, fallbackYear: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < fallbackYear - 3 || parsed > fallbackYear) {
    return fallbackYear;
  }

  return parsed;
}

function buildAvailableYears(currentYear: number) {
  return Array.from({ length: 4 }, (_, index) => currentYear - index);
}

function getContributionRangeForYear(selectedYear: number, currentYear: number) {
  const startDate = `${selectedYear}-01-01`;
  const endDate =
    selectedYear === currentYear
      ? formatLocalDateInputValue(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
      : `${selectedYear + 1}-01-01`;

  return { startDate, endDate };
}

function buildYearHref(searchParams: URLSearchParams, year: number) {
  const next = new URLSearchParams(searchParams);
  next.set("year", String(year));
  return `/?${next.toString()}`;
}

function formatRangeLabel(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    return "rentang terbaru";
  }

  const inclusiveEnd = parseDateOnly(endDate);
  if (!inclusiveEnd) {
    return `${startDate} sampai ${endDate}`;
  }

  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);
  return `${startDate} sampai ${formatDateOnly(inclusiveEnd)}`;
}

function getPuasaSummaryValue(summary: DashboardSummary) {
  if (!summary.puasa.fast_type) {
    return "Tidak puasa";
  }

  return summary.puasa.completed
    ? `${summary.puasa.fast_type} selesai`
    : `${summary.puasa.fast_type} berjalan`;
}

const moduleMeta = {
  sholat: {
    icon: Landmark,
    href: "/sholat",
    contributionHref: "/dashboard/contributions/sholat",
    description: "Melihat pola ibadah harian tanpa tenggelam dalam detail yang terlalu panjang.",
  },
  puasa: {
    icon: Moon,
    href: "/puasa",
    contributionHref: "/dashboard/contributions/puasa",
    description: "Menjaga ritme puasa agar hari aktif dan hari kosong cepat terbaca.",
  },
  keuangan: {
    icon: WalletCards,
    href: "/keuangan",
    contributionHref: "/dashboard/contributions/keuangan",
    description: "Membaca konsistensi pencatatan transaksi dengan tampilan yang tetap ringan.",
  },
  olahraga: {
    icon: Dumbbell,
    href: "/olahraga",
    contributionHref: "/dashboard/contributions/olahraga",
    description: "Menunjukkan hari latihan aktif sekaligus memudahkan mencari celah kosong.",
  },
  jurnal: {
    icon: BookOpenText,
    href: "/jurnal",
    contributionHref: "/dashboard/contributions/jurnal",
    description: "Membantu melihat kontinuitas refleksi harian dari waktu ke waktu.",
  },
} as const;

function getModuleHighlights(module: ModuleKey, summary: DashboardSummary) {
  switch (module) {
    case "sholat":
      return [
        `${summary.sholat.completed_count} dari ${summary.sholat.total_count} waktu sholat sudah tercatat hari ini.`,
        summary.sholat.completed_count >= summary.sholat.total_count
          ? "Ritme ibadah hari ini sudah lengkap."
          : "Masih ada waktu sholat yang perlu ditutup.",
      ];
    case "puasa":
      return [
        summary.puasa.fast_type
          ? `Puasa ${summary.puasa.fast_type} ${summary.puasa.completed ? "sudah selesai" : "masih menunggu penyelesaian"}.`
          : "Belum ada catatan puasa hari ini.",
        summary.puasa.fast_type
          ? "Status contribution akan menguat saat catatan puasa rutin diisi."
          : "Mulai dari satu catatan puasa untuk membentuk pola konsistensi.",
      ];
    case "keuangan":
      return [
        `Saldo bulan ini ${formatCurrency(summary.finance.balance)}.`,
        Number(summary.finance.income) === 0 && Number(summary.finance.expense) === 0
          ? "Belum ada transaksi yang membentuk contribution keuangan bulan ini."
          : `${formatCurrency(summary.finance.income)} pemasukan dan ${formatCurrency(summary.finance.expense)} pengeluaran tercatat.`,
      ];
    case "olahraga":
      return [
        `${summary.sport.completed_count} sesi selesai dengan total ${summary.sport.completed_minutes} menit minggu ini.`,
        summary.sport.completed_count > 0
          ? "Pertahankan ritme latihan agar streak tetap hidup."
          : "Cukup satu sesi pendek untuk mulai mengisi contribution olahraga.",
      ];
    case "jurnal":
      return [
        summary.journal.written
          ? "Jurnal hari ini sudah ditulis."
          : "Jurnal hari ini belum ditulis.",
        summary.journal.written
          ? "Refleksi harian sudah ikut memperkuat contribution personal."
          : "Tambahkan satu refleksi singkat agar hari ini terasa lebih selesai.",
      ];
    default:
      return ["Belum ada ringkasan tambahan."];
  }
}

function formatCurrency(value: string) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return "Rp 0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(parsed);
}

function parseDateOnly(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function formatDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatMonthLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}
