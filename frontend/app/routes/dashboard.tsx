import {
  ArrowRight,
  BookOpenText,
  CalendarClock,
  CircleAlert,
  CircleCheckBig,
  CircleDashed,
  Dumbbell,
  Flame,
  Info,
  Landmark,
  Moon,
  Sparkles,
  TrendingDown,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import type { Route } from "./+types/dashboard";
import { ContributionGraph } from "~/components/contribution-graph";
import { EmptyState } from "~/components/empty-state";
import { MainLayout } from "~/components/main-layout";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import {
  SelectField,
  type SelectFieldOption,
} from "~/components/ui/select-field";
import {
  getContributionGuide,
  type ModuleKey,
} from "~/lib/dashboard-contribution";
import {
  formatCurrencyForDisplay,
  formatDateOnlyForDisplay,
  formatLocalDateInputValue,
  formatUtcMonthYearForDisplay,
  getTodayDateInputValue,
} from "~/lib/form-defaults";
import { useLocale } from "~/lib/localization";
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

type ModuleContributionResponse = {
  start_date: string;
  end_date: string;
  available_years: number[];
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
  badgeLabel: string;
  tone: "good" | "warn" | "muted";
  hint: string;
  sourceLabel: string;
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
  available_years: [],
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
  const currentYear = Number(getTodayDateInputValue().slice(0, 4));
  const requestedYear = parseRequestedYear(url.searchParams.get("year"), currentYear);

  const [summaryResult, initialContributionsResult] = await Promise.allSettled([
    apiRequest<DashboardSummary>("/api/dashboard/summary"),
    fetchModuleContributions(requestedYear, currentYear),
  ]);

  const summary =
    summaryResult.status === "fulfilled" ? summaryResult.value : emptySummary;

  if (initialContributionsResult.status !== "fulfilled") {
    return {
      summary,
      moduleContributions: {
        ...emptyModuleContributions,
        start_date: `${currentYear}-01-01`,
        end_date: getContributionRangeForYear(currentYear, currentYear).endDate,
      },
      availableYears: [currentYear],
      selectedYear: currentYear,
      apiError:
        summaryResult.status === "rejected" ||
        initialContributionsResult.status === "rejected"
          ? "Data backend belum tersedia. Dashboard menampilkan nilai kosong sementara."
          : undefined,
    };
  }

  const initialContributions = initialContributionsResult.value;
  const availableYears = normalizeAvailableYears(
    initialContributions.available_years,
    currentYear,
  );
  const selectedYear = selectClosestValidYear(
    requestedYear,
    availableYears,
    currentYear,
  );

  const moduleContributions =
    selectedYear === requestedYear
      ? initialContributions
      : await fetchModuleContributions(selectedYear, currentYear);

  return {
    summary,
    moduleContributions,
    availableYears,
    selectedYear,
    apiError:
      summaryResult.status === "rejected"
        ? "Data backend belum tersedia. Dashboard menampilkan nilai kosong sementara."
        : undefined,
  };
}

export default function DashboardRoute() {
  const { language } = useLocale();
  const { summary, moduleContributions, availableYears, selectedYear, apiError } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const navigate = useNavigate();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    return subscribeToTrackerDataChanges(() => {
      revalidator.revalidate();
    });
  }, [revalidator]);

  const moduleStatuses = getModuleStatuses(summary, language);
  const dailyStatuses = moduleStatuses.filter(
    (status) => status.countsTowardDailyProgress,
  );
  const completedDailySignals = dailyStatuses.filter(
    (status) => status.completed,
  ).length;
  const progressPercent = Math.round(
    (completedDailySignals / Math.max(dailyStatuses.length, 1)) * 100,
  );
  const nextAction = getNextAction(moduleStatuses, language);
  const combinedContributionDays = getCombinedContributionDays(moduleContributions);
  const contributionStats = getContributionStats(
    combinedContributionDays,
    language,
  );
  const weeklySummary = getWeeklySummary(combinedContributionDays, language);
  const monthlyInsight = getMonthlyInsight(
    combinedContributionDays,
    selectedYear,
    language,
  );
  const recommendation = getRecommendation(
    summary,
    moduleStatuses,
    contributionStats,
    language,
  );
  const trend = getTrendSummary(combinedContributionDays, language);
  const selectedRangeLabel = formatRangeLabel(
    moduleContributions.start_date,
    moduleContributions.end_date,
    language,
  );
  const currentYear = Number(getTodayDateInputValue().slice(0, 4));
  const yearOptions: SelectFieldOption[] = availableYears.map((year) => ({
    value: String(year),
    label: String(year),
  }));
  const isEnglish = language === "en";
  const summaryDateLabel = formatDateOnlyForDisplay(summary.date, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }, language);

  return (
    <MainLayout
      title="Dashboard"
      description={
        isEnglish
          ? "A daily overview focused on core progress, contribution, and the next step."
          : "Ringkasan harian yang fokus pada progres inti, contribution, dan langkah berikutnya."
      }
    >
      {apiError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {isEnglish
            ? "Backend data is not available yet. The dashboard is showing temporary empty values."
            : apiError}
        </div>
      ) : null}

      <section className="grid gap-4">
        <article className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="border-b border-border/60 bg-[linear-gradient(135deg,rgba(14,116,144,0.12),rgba(251,191,36,0.16),rgba(255,255,255,0.92))] px-6 py-6 dark:bg-[linear-gradient(135deg,rgba(14,116,144,0.18),rgba(251,191,36,0.12),rgba(24,24,27,0.94))]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {isEnglish ? "Today's Progress" : "Progress Hari Ini"}
                </span>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                  {isEnglish
                    ? `${progressPercent}% of today's progress is already moving.`
                    : `${progressPercent}% progres harian sudah bergerak.`}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  {isEnglish
                    ? "The dashboard still focuses on 4 core daily signals: prayer, fasting, workout, and journal."
                    : "Fokus utama dashboard tetap di 4 sinyal harian: sholat, puasa, olahraga, dan jurnal."}
                </p>
              </div>
              <div className="min-w-52 rounded-3xl border border-border/70 bg-background/80 p-4 backdrop-blur">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {isEnglish ? "Reference date" : "Tanggal acuan"}
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {summaryDateLabel}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isEnglish
                    ? `The summary reads this date. Contribution reads the range ${selectedRangeLabel}.`
                    : `Summary membaca tanggal ini. Contribution membaca rentang ${selectedRangeLabel}.`}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{isEnglish ? "Core daily progress" : "Progress inti harian"}</span>
                <span>
                  {completedDailySignals}/{dailyStatuses.length}{" "}
                  {isEnglish ? "signals" : "sinyal"}
                </span>
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
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => setIsHelpOpen(true)}
              >
                {isEnglish ? "Show help" : "Buka panduan"}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 px-6 py-5 md:grid-cols-2 xl:grid-cols-3">
            {moduleStatuses.map((status) => (
              <ModuleProgressPill key={status.module} status={status} />
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title={
            selectedYear === currentYear
              ? isEnglish
                ? "Current streak"
                : "Streak hari ini"
              : isEnglish
                ? "Archived streak"
                : "Streak akhir arsip"
          }
          value={`${contributionStats.currentStreak} ${isEnglish ? "days" : "hari"}`}
          detail={
            isEnglish
              ? `Best run ${contributionStats.longestStreak} active days. A streak is counted from consecutive days with at least one active contribution.`
              : `Rekor terbaik ${contributionStats.longestStreak} hari aktif. Streak dihitung dari hari yang punya minimal satu contribution aktif.`
          }
          tone={contributionStats.currentStreak > 0 ? "good" : "muted"}
          icon={Flame}
        />
        <InsightCard
          title={isEnglish ? "This week" : "Minggu ini"}
          value={`${weeklySummary.currentWeekActiveDays} ${isEnglish ? "active days" : "hari aktif"}`}
          detail={weeklySummary.deltaLabel}
          tone={weeklySummary.delta >= 0 ? "good" : "warn"}
          icon={CalendarClock}
        />
        <InsightCard
          title={monthlyInsight.label}
          value={`${monthlyInsight.activeDays} ${isEnglish ? "active days" : "hari aktif"}`}
          detail={
            isEnglish
              ? `${monthlyInsight.consistency}% consistent, ${monthlyInsight.emptyDays} empty days in the most relevant month for the selected range.`
              : `${monthlyInsight.consistency}% konsisten, ${monthlyInsight.emptyDays} hari kosong pada bulan yang paling relevan di rentang terpilih.`
          }
          tone={monthlyInsight.activeDays > 0 ? "good" : "muted"}
          icon={Sparkles}
        />
        <InsightCard
          title={isEnglish ? "Next focus" : "Arah berikutnya"}
          value={recommendation.title}
          detail={recommendation.description}
          tone={recommendation.tone}
          icon={recommendation.icon}
        />
      </section>

      <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {isEnglish ? "Contribution" : "Contribution"}
              </h2>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {selectedRangeLabel}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {isEnglish
                ? "Contribution helps you read consistency per module without overloading the main page with explanation."
                : "Contribution membantu membaca konsistensi per module tanpa menumpuk penjelasan di halaman utama."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {isEnglish ? "Year" : "Tahun"}
            </span>
            <div className="w-full sm:w-36">
              <SelectField
                compact
                value={String(selectedYear)}
                options={yearOptions}
                onValueChange={(value) => {
                  navigate(`/?year=${value}`);
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <ContributionStatCard
            label={isEnglish ? "Active days" : "Hari aktif"}
            value={String(contributionStats.activeDays)}
            detail={`${contributionStats.totalDays} ${isEnglish ? "tracked days" : "hari dipantau"}`}
          />
          <ContributionStatCard
            label={isEnglish ? "Consistency" : "Konsistensi"}
            value={`${contributionStats.consistencyRate}%`}
            detail={`${contributionStats.emptyDays} ${isEnglish ? "days without activity" : "hari tanpa aktivitas"}`}
          />
          <ContributionStatCard
            label={isEnglish ? "Trend" : "Trend"}
            value={trend.label}
            detail={trend.detail}
          />
          <ContributionStatCard
            label={isEnglish ? "Best month" : "Bulan terbaik"}
            value={contributionStats.bestMonth.label}
            detail={`${contributionStats.bestMonth.activeDays} ${isEnglish ? "active days" : "hari aktif"}`}
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

      <Dialog
        open={isHelpOpen}
        onOpenChange={setIsHelpOpen}
        title={isEnglish ? "How to read the dashboard" : "Cara membaca dashboard"}
        description={
          isEnglish
            ? "This guide explains progress, the reference date, streaks, and contribution without overloading the main layout."
            : "Panduan ini menjelaskan arti progress, tanggal acuan, streak, dan contribution tanpa membebani layout utama."
        }
      >
        <div className="grid gap-5">
          <div className="rounded-3xl border border-border/70 bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
            {isEnglish ? "Current active range:" : "Rentang aktif saat ini:"}{" "}
            <span className="font-medium text-foreground">{selectedRangeLabel}</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ExplanationCard
              icon={Sparkles}
              title={isEnglish ? "Today's Progress" : "Progress Hari Ini"}
              description={
                isEnglish
                  ? "Calculated from the 4 daily signals that matter most for daily rhythm. Finance is still shown, but it does not count toward the progress score."
                  : "Dihitung dari 4 sinyal harian yang paling relevan untuk ritme harian. Keuangan tetap ditampilkan, tetapi tidak ikut skor progres."
              }
            />
            <ExplanationCard
              icon={Info}
              title={isEnglish ? "Reference Date" : "Tanggal Acuan"}
              description={`${
                isEnglish ? "The daily dashboard reads the date" : "Dashboard harian membaca tanggal"
              } ${formatDateOnlyForDisplay(summary.date, {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }, language)}, ${
                isEnglish
                  ? "so an empty value can simply mean no record has been saved for that date yet."
                  : "jadi nilai kosong bisa berarti record untuk tanggal itu memang belum tersimpan."
              }`}
            />
            <ExplanationCard
              icon={Flame}
              title="Streak"
              description={
                isEnglish
                  ? `Calculated from consecutive days that have at least one active module in the ${selectedYear} contribution range.`
                  : `Dihitung dari jumlah hari beruntun yang memiliki minimal satu module aktif di rentang contribution ${selectedYear}.`
              }
            />
            <ExplanationCard
              icon={CalendarClock}
              title="Contribution"
              description={
                isEnglish
                  ? "Contribution tiles show activity per module and per day. Color meaning can differ by module, so not every module uses the same scale."
                  : "Kotak contribution menunjukkan aktivitas per module dan per hari. Arti warna bisa berbeda antar module, jadi tidak semua module memakai skala yang sama."
              }
            />
          </div>

          <div className="rounded-3xl border border-border/70 bg-background/70 p-4">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {isEnglish ? "Contribution rules per module" : "Aturan contribution per module"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isEnglish
                    ? "This section is especially important for Prayer, because the highest level is now truly reachable when all 5/5 prayer times are recorded."
                    : "Bagian ini penting terutama untuk Sholat, karena level tertinggi sekarang benar-benar bisa dicapai saat 5/5 waktu tercatat."}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {moduleContributions.modules.map((module) => {
                const guide = getContributionGuide(module.module, language);
                return (
                  <div
                    key={`guide-${module.module}`}
                    className="rounded-2xl border border-border/70 bg-muted/35 p-4"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {guide.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {guide.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Dialog>
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
  const { language } = useLocale();
  const isEnglish = language === "en";
  const metadata = getModuleMeta(module.module, language);
  const guide = getContributionGuide(module.module, language);
  const moduleLabel = getModuleLabel(module.module, language);
  const activeDays = module.days.length;
  const latestHighlight = getModuleHighlights(module.module, summary, language);

  return (
    <article className="rounded-[1.75rem] border border-border bg-background/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <metadata.icon className="size-3.5" aria-hidden="true" />
            {moduleLabel}
          </span>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            {isEnglish ? `${moduleLabel} contribution` : `Contribution ${moduleLabel}`}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {metadata.description}
          </p>
        </div>
        <div className="grid gap-2 text-right text-xs text-muted-foreground">
          <span>{activeDays} {isEnglish ? "active days" : "hari aktif"}</span>
          <span>{isEnglish ? `Range ${rangeLabel}` : `Rentang ${rangeLabel}`}</span>
        </div>
      </div>

      {module.days.length === 0 ? (
        <div className="mt-4 space-y-3">
          <EmptyState
            icon={metadata.icon}
            title={
              isEnglish
                ? `No ${moduleLabel.toLowerCase()} contribution yet`
                : `Belum ada contribution ${moduleLabel.toLowerCase()}`
            }
            description={
              isEnglish
                ? "Start filling this module so its contribution and monthly insights can form right away."
                : "Mulai isi module ini supaya contribution dan insight bulanannya langsung terbentuk."
            }
          />
          <Button asChild className="w-full">
            <Link to={metadata.href}>
              {isEnglish
                ? `Start with ${moduleLabel}`
                : `Mulai dari module ${moduleLabel}`}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <ContributionGraph
            compact
            module={module.module}
            title={isEnglish ? `${moduleLabel} summary` : `Ringkasan ${moduleLabel}`}
            description={
              isEnglish
                ? `${moduleLabel} contribution for ${rangeLabel}.`
                : `Contribution ${moduleLabel.toLowerCase()} untuk ${rangeLabel}.`
            }
            days={module.days}
          />
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-border/70 bg-muted/35 px-4 py-3 text-sm leading-6 text-muted-foreground">
        <p className="font-medium text-foreground">{guide.title}</p>
        <p className="mt-1">{guide.summary}</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="grid gap-2">
          {latestHighlight.map((item) => (
            <div
              key={item}
              className="rounded-2xl bg-muted/60 px-3 py-2 text-sm leading-6 text-muted-foreground"
            >
              {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button asChild variant="outline" className="sm:w-fit">
            <Link to={metadata.contributionHref}>
              {isEnglish ? "Contribution detail" : "Detail contribution"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild className="sm:w-fit">
            <Link to={metadata.href}>
              {isEnglish ? `Open ${moduleLabel}` : `Buka module ${moduleLabel}`}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

function ModuleProgressPill({ status }: { status: ModuleStatus }) {
  return (
    <div className="rounded-3xl border border-border/70 bg-background/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{status.label}</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {status.value}
          </p>
        </div>
        <StatusBadge tone={status.tone} label={status.badgeLabel} />
      </div>
      <div className="mt-2">
        <PeriodBadge label={status.sourceLabel} />
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {status.hint}
      </p>
    </div>
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
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={cn(
            "rounded-2xl p-2",
            tone === "good" &&
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200",
            tone === "warn" &&
              "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
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
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
    </div>
  );
}

function ExplanationCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Info;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border/70 bg-muted/35 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-background p-2 text-muted-foreground">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  tone,
  label,
}: {
  tone: "good" | "warn" | "muted";
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
        tone === "muted" && "bg-muted text-muted-foreground",
      )}
    >
      {tone === "good" ? (
        <CircleCheckBig className="size-3" aria-hidden="true" />
      ) : tone === "warn" ? (
        <CircleAlert className="size-3" aria-hidden="true" />
      ) : (
        <CircleDashed className="size-3" aria-hidden="true" />
      )}
      {label}
    </span>
  );
}

function PeriodBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {label}
    </span>
  );
}

function getModuleStatuses(
  summary: DashboardSummary,
  language: "id" | "en",
): ModuleStatus[] {
  const isEnglish = language === "en";
  const sholatComplete =
    summary.sholat.total_count > 0 &&
    summary.sholat.completed_count >= summary.sholat.total_count;
  const puasaValue = getPuasaSummaryValue(summary, language);
  const financeBalance = formatCurrency(summary.finance.balance, language);
  const sportComplete = summary.sport.completed_count > 0;
  const financeActive =
    Number(summary.finance.income) > 0 || Number(summary.finance.expense) > 0;

  return [
    {
      module: "sholat",
      label: getModuleLabel("sholat", language),
      value: `${summary.sholat.completed_count}/${summary.sholat.total_count}`,
      badgeLabel: sholatComplete
        ? isEnglish ? "Complete" : "Lengkap"
        : isEnglish ? "Incomplete" : "Belum lengkap",
      tone: sholatComplete ? "good" : "warn",
      hint: sholatComplete
        ? isEnglish
          ? "All prayer times for today are already recorded."
          : "Semua waktu sholat hari ini sudah tercatat."
        : isEnglish
          ? `${summary.sholat.total_count - summary.sholat.completed_count} prayer times are still waiting for records on ${formatDateOnlyForDisplay(summary.date, undefined, language)}.`
          : `${summary.sholat.total_count - summary.sholat.completed_count} waktu sholat masih menunggu catatan untuk tanggal ${formatDateOnlyForDisplay(summary.date, undefined, language)}.`,
      sourceLabel: isEnglish ? "Today" : "Hari ini",
      href: "/sholat",
      completed: sholatComplete,
      countsTowardDailyProgress: true,
    },
    {
      module: "puasa",
      label: getModuleLabel("puasa", language),
      value: puasaValue,
      badgeLabel: summary.puasa.completed
        ? isEnglish ? "Done" : "Selesai"
        : isEnglish ? "Not done" : "Belum selesai",
      tone: summary.puasa.completed ? "good" : "warn",
      hint: summary.puasa.fast_type
        ? summary.puasa.completed
          ? isEnglish
            ? "Today's fasting record is marked as completed."
            : "Puasa hari ini sudah selesai tercatat."
          : isEnglish
            ? "A fasting record exists, but the completion status is still incomplete."
            : "Catatan puasa sudah ada, tetapi status selesainya belum lengkap."
        : isEnglish
          ? "There is no fasting record for today's reference date yet."
          : "Belum ada catatan puasa untuk tanggal acuan hari ini.",
      sourceLabel: isEnglish ? "Today" : "Hari ini",
      href: "/puasa",
      completed: summary.puasa.completed,
      countsTowardDailyProgress: true,
    },
    {
      module: "keuangan",
      label: getModuleLabel("keuangan", language),
      value: financeBalance,
      badgeLabel: financeActive
        ? isEnglish ? "Active" : "Ada aktivitas"
        : isEnglish ? "No transactions" : "Belum ada transaksi",
      tone: financeActive ? "good" : "muted",
      hint: financeActive
        ? isEnglish
          ? `${formatCurrency(summary.finance.income, language)} income and ${formatCurrency(summary.finance.expense, language)} expense were recorded this month.`
          : `${formatCurrency(summary.finance.income, language)} pemasukan dan ${formatCurrency(summary.finance.expense, language)} pengeluaran tercatat untuk bulan berjalan.`
        : isEnglish
          ? "No transactions are recorded for the current month yet, so the finance summary is still empty."
          : "Belum ada transaksi tercatat pada bulan berjalan, jadi ringkasan keuangan masih kosong.",
      sourceLabel: isEnglish ? "This month" : "Bulan ini",
      href: "/keuangan",
      completed: financeActive,
      countsTowardDailyProgress: false,
    },
    {
      module: "olahraga",
      label: getModuleLabel("olahraga", language),
      value: `${summary.sport.completed_minutes} ${isEnglish ? "minutes" : "menit"}`,
      badgeLabel: sportComplete
        ? isEnglish ? "Completed session" : "Ada sesi selesai"
        : isEnglish ? "No session yet" : "Belum ada sesi",
      tone: sportComplete ? "good" : "warn",
      hint: sportComplete
        ? isEnglish
          ? `${summary.sport.completed_count} completed sessions were recorded this week.`
          : `${summary.sport.completed_count} sesi selesai tercatat untuk minggu berjalan.`
        : isEnglish
          ? "There are no completed workout sessions for the current week yet."
          : "Belum ada sesi olahraga selesai pada minggu berjalan.",
      sourceLabel: isEnglish ? "This week" : "Minggu ini",
      href: "/olahraga",
      completed: sportComplete,
      countsTowardDailyProgress: true,
    },
    {
      module: "jurnal",
      label: getModuleLabel("jurnal", language),
      value: summary.journal.written
        ? isEnglish ? "Written" : "Sudah ditulis"
        : isEnglish ? "Not written" : "Belum ditulis",
      badgeLabel: summary.journal.written
        ? isEnglish ? "Available" : "Sudah ada"
        : isEnglish ? "Missing" : "Belum ada",
      tone: summary.journal.written ? "good" : "warn",
      hint: summary.journal.written
        ? isEnglish
          ? "A reflection for today's reference date is already recorded."
          : "Refleksi untuk tanggal acuan hari ini sudah tercatat."
        : isEnglish
          ? "There is no journal entry for today's reference date yet."
          : "Belum ada jurnal untuk tanggal acuan hari ini.",
      sourceLabel: isEnglish ? "Today" : "Hari ini",
      href: "/jurnal",
      completed: summary.journal.written,
      countsTowardDailyProgress: true,
    },
  ];
}

function getNextAction(statuses: ModuleStatus[], language: "id" | "en") {
  const unfinished = statuses.find(
    (status) => status.countsTowardDailyProgress && !status.completed,
  );

  if (unfinished) {
    return {
      href: unfinished.href,
      ctaLabel:
        language === "en"
          ? `Continue ${unfinished.label.toLowerCase()}`
          : `Lanjutkan ${unfinished.label.toLowerCase()}`,
    };
  }

  return {
    href: "/",
    ctaLabel: language === "en" ? "Today is already tidy" : "Hari ini sudah rapi",
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
      const current = scoresByDate.get(day.date) ?? {
        score: 0,
        activeModules: 0,
      };
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

function getContributionStats(days: InsightDay[], language: "id" | "en") {
  const activeDays = days.filter((day) => day.score > 0).length;
  const totalDays = days.length;
  const emptyDays = Math.max(totalDays - activeDays, 0);
  const consistencyRate =
    totalDays === 0 ? 0 : Math.round((activeDays / totalDays) * 100);
  const { currentStreak, longestStreak } = getStreaks(days);
  const bestMonth = getBestMonth(days, language);

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

function getWeeklySummary(days: InsightDay[], language: "id" | "en") {
  const isEnglish = language === "en";
  const currentWeek = days.slice(-7);
  const previousWeek = days.slice(-14, -7);
  const currentWeekActiveDays = currentWeek.filter(
    (day) => day.score > 0,
  ).length;
  const previousWeekActiveDays = previousWeek.filter(
    (day) => day.score > 0,
  ).length;
  const delta = currentWeekActiveDays - previousWeekActiveDays;

  return {
    currentWeekActiveDays,
    delta,
    deltaLabel:
      previousWeek.length === 0
        ? isEnglish
          ? "There is no previous week to compare yet."
          : "Belum ada pembanding minggu sebelumnya."
        : delta >= 0
          ? isEnglish
            ? `Up ${delta} active days compared with the previous week.`
            : `Naik ${delta} hari aktif dibanding minggu sebelumnya.`
          : isEnglish
            ? `Down ${Math.abs(delta)} active days compared with the previous week.`
            : `Turun ${Math.abs(delta)} hari aktif dibanding minggu sebelumnya.`,
  };
}

function getMonthlyInsight(
  days: InsightDay[],
  selectedYear: number,
  language: "id" | "en",
) {
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
      label: formatMonthLabel(day.date, language),
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
  const activeMonthEntry = [...orderedMonths]
    .reverse()
    .find(([, month]) => month.activeDays > 0);
  const fallbackKey = `${selectedYear}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const fallbackMonth = monthMap.get(fallbackKey);
  const [, month] =
    activeMonthEntry ??
    (fallbackMonth
      ? [fallbackKey, fallbackMonth]
      : orderedMonths.at(-1) ?? [
          "",
          {
            activeDays: 0,
            totalDays: 0,
            label: language === "en" ? "This month" : "Bulan ini",
          },
        ]);

  const consistency =
    month.totalDays === 0
      ? 0
      : Math.round((month.activeDays / month.totalDays) * 100);

  return {
    label: month.label,
    activeDays: month.activeDays,
    emptyDays: Math.max(month.totalDays - month.activeDays, 0),
    consistency,
  };
}

function getTrendSummary(days: InsightDay[], language: "id" | "en") {
  const isEnglish = language === "en";
  const currentWindow = days.slice(-14);
  const previousWindow = days.slice(-28, -14);
  const currentActive = currentWindow.filter((day) => day.score > 0).length;
  const previousActive = previousWindow.filter((day) => day.score > 0).length;

  if (currentWindow.length === 0 || previousWindow.length === 0) {
    return {
      label: isEnglish ? "Not enough data" : "Belum cukup data",
      detail: isEnglish
        ? "The trend will appear once the activity range gets longer."
        : "Trend akan muncul setelah rentang aktivitas lebih panjang.",
    };
  }

  if (currentActive > previousActive) {
    return {
      label: isEnglish ? "Improving" : "Meningkat",
      detail: isEnglish
        ? `${currentActive} active days in the last 14 days, up from ${previousActive}.`
        : `${currentActive} hari aktif pada 14 hari terakhir, naik dari ${previousActive}.`,
    };
  }

  if (currentActive < previousActive) {
    return {
      label: isEnglish ? "Declining" : "Menurun",
      detail: isEnglish
        ? `${currentActive} active days in the last 14 days, down from ${previousActive}.`
        : `${currentActive} hari aktif pada 14 hari terakhir, turun dari ${previousActive}.`,
    };
  }

  return {
    label: isEnglish ? "Stable" : "Stabil",
    detail: isEnglish
      ? `${currentActive} active days across the last two 14-day periods.`
      : `${currentActive} hari aktif pada dua periode 14 hari terakhir.`,
  };
}

function getRecommendation(
  summary: DashboardSummary,
  statuses: ModuleStatus[],
  contributionStats: ReturnType<typeof getContributionStats>,
  language: "id" | "en",
) {
  const isEnglish = language === "en";
  const unfinished = statuses.find(
    (status) => status.countsTowardDailyProgress && !status.completed,
  );

  if (unfinished) {
    return {
      title: isEnglish
        ? `Focus on ${unfinished.label.toLowerCase()}`
        : `Fokus ke ${unfinished.label.toLowerCase()}`,
      description: unfinished.hint,
      tone: "warn" as const,
      icon: CircleAlert,
    };
  }

  if (contributionStats.consistencyRate < 35) {
    return {
      title: isEnglish ? "Protect the daily rhythm" : "Jaga ritme harian",
      description: isEnglish
        ? "Try filling at least one module every day so a consistency pattern can start to form."
        : "Coba isi minimal satu module setiap hari agar pola konsistensi mulai terbentuk.",
      tone: "warn" as const,
      icon: TrendingDown,
    };
  }

  if (
    Number(summary.finance.income) === 0 &&
    Number(summary.finance.expense) === 0
  ) {
    return {
      title: isEnglish ? "Log the first transaction" : "Catat transaksi pertama",
      description: isEnglish
        ? "One small income or expense is enough to make the finance summary feel more alive."
        : "Satu pemasukan atau pengeluaran kecil sudah cukup untuk membuat ringkasan keuangan lebih hidup.",
      tone: "muted" as const,
      icon: CircleDashed,
    };
  }

  return {
    title: isEnglish ? "Keep the momentum" : "Pertahankan momentumnya",
    description: isEnglish
      ? "Most of the core signals are already done. Use the remaining time to tidy small details or add a short note."
      : "Mayoritas sinyal utama sudah selesai. Gunakan waktu sisanya untuk merapikan detail atau menambah catatan singkat.",
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

function getBestMonth(days: InsightDay[], language: "id" | "en") {
  const monthMap = new Map<string, number>();

  for (const day of days) {
    if (day.score === 0) {
      continue;
    }
    const monthKey = day.date.slice(0, 7);
    monthMap.set(monthKey, (monthMap.get(monthKey) ?? 0) + 1);
  }

  let best = {
    label: language === "en" ? "No data yet" : "Belum ada data",
    activeDays: 0,
  };
  for (const [monthKey, activeDays] of monthMap.entries()) {
    if (activeDays > best.activeDays) {
      best = {
        label: formatMonthLabel(`${monthKey}-01`, language),
        activeDays,
      };
    }
  }

  return best;
}

async function fetchModuleContributions(selectedYear: number, currentYear: number) {
  const contributionRange = getContributionRangeForYear(selectedYear, currentYear);
  return apiRequest<ModuleContributionResponse>(
    `/api/dashboard/module-contributions?start_date=${contributionRange.startDate}&end_date=${contributionRange.endDate}`,
  );
}

function parseRequestedYear(value: string | null, fallbackYear: number) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 2000 || parsed > fallbackYear) {
    return fallbackYear;
  }

  return parsed;
}

function normalizeAvailableYears(years: number[], currentYear: number) {
  const merged = new Set<number>([currentYear, ...years]);
  return Array.from(merged.values()).sort((left, right) => right - left);
}

function selectClosestValidYear(
  requestedYear: number,
  availableYears: number[],
  fallbackYear: number,
) {
  if (availableYears.includes(requestedYear)) {
    return requestedYear;
  }

  return availableYears[0] ?? fallbackYear;
}

function getContributionRangeForYear(selectedYear: number, currentYear: number) {
  const startDate = `${selectedYear}-01-01`;
  const endDate =
    selectedYear === currentYear
      ? formatLocalDateInputValue(
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        )
      : `${selectedYear + 1}-01-01`;

  return { startDate, endDate };
}

function formatRangeLabel(
  startDate: string,
  endDate: string,
  language: "id" | "en",
) {
  if (!startDate || !endDate) {
    return language === "en" ? "latest range" : "rentang terbaru";
  }

  const inclusiveEnd = parseDateOnly(endDate);
  if (!inclusiveEnd) {
    return language === "en"
      ? `${startDate} to ${endDate}`
      : `${startDate} sampai ${endDate}`;
  }

  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);
  return language === "en"
    ? `${startDate} to ${formatDateOnly(inclusiveEnd)}`
    : `${startDate} sampai ${formatDateOnly(inclusiveEnd)}`;
}

function getPuasaSummaryValue(
  summary: DashboardSummary,
  language: "id" | "en",
) {
  if (!summary.puasa.fast_type) {
    return language === "en" ? "No fasting" : "Tidak puasa";
  }

  return summary.puasa.completed
    ? language === "en"
      ? `${summary.puasa.fast_type} completed`
      : `${summary.puasa.fast_type} selesai`
    : language === "en"
      ? `${summary.puasa.fast_type} ongoing`
      : `${summary.puasa.fast_type} berjalan`;
}

function getModuleMeta(module: ModuleKey, language: "id" | "en") {
  const isEnglish = language === "en";

  switch (module) {
    case "sholat":
      return {
        icon: Landmark,
        href: "/sholat",
        contributionHref: "/dashboard/contributions/sholat",
        description: isEnglish
          ? "Read the daily worship pattern without getting buried in long detail."
          : "Melihat pola ibadah harian tanpa tenggelam dalam detail yang terlalu panjang.",
      };
    case "puasa":
      return {
        icon: Moon,
        href: "/puasa",
        contributionHref: "/dashboard/contributions/puasa",
        description: isEnglish
          ? "Keep fasting rhythm readable so active and empty days stand out quickly."
          : "Menjaga ritme puasa agar hari aktif dan hari kosong cepat terbaca.",
      };
    case "keuangan":
      return {
        icon: WalletCards,
        href: "/keuangan",
        contributionHref: "/dashboard/contributions/keuangan",
        description: isEnglish
          ? "Read transaction logging consistency with a view that stays lightweight."
          : "Membaca konsistensi pencatatan transaksi dengan tampilan yang tetap ringan.",
      };
    case "olahraga":
      return {
        icon: Dumbbell,
        href: "/olahraga",
        contributionHref: "/dashboard/contributions/olahraga",
        description: isEnglish
          ? "Highlight workout days while making empty gaps easier to spot."
          : "Menunjukkan hari latihan aktif sekaligus memudahkan mencari celah kosong.",
      };
    case "jurnal":
      return {
        icon: BookOpenText,
        href: "/jurnal",
        contributionHref: "/dashboard/contributions/jurnal",
        description: isEnglish
          ? "See the continuity of daily reflection over time."
          : "Membantu melihat kontinuitas refleksi harian dari waktu ke waktu.",
      };
  }
}

function getModuleHighlights(
  module: ModuleKey,
  summary: DashboardSummary,
  language: "id" | "en",
) {
  const isEnglish = language === "en";
  switch (module) {
    case "sholat":
      return [
        isEnglish
          ? `${summary.sholat.completed_count} of ${summary.sholat.total_count} prayer times are already recorded today.`
          : `${summary.sholat.completed_count} dari ${summary.sholat.total_count} waktu sholat sudah tercatat hari ini.`,
        summary.sholat.completed_count >= summary.sholat.total_count
          ? isEnglish
            ? "If prayer contribution reaches the highest level, it means all 5 of 5 prayer times were truly recorded for that day."
            : "Jika contribution sholat menampilkan level tertinggi, artinya 5/5 waktu benar-benar tercatat untuk hari itu."
          : isEnglish
            ? "Prayer contribution follows the number of recorded prayer times on that date, not just the intention or plan for that day."
            : "Contribution sholat mengikuti jumlah waktu yang tersimpan pada tanggal tersebut, bukan hanya niat atau rencana hari itu.",
      ];
    case "puasa":
      return [
        summary.puasa.fast_type
          ? isEnglish
            ? `${summary.puasa.fast_type} fasting is ${summary.puasa.completed ? "already completed" : "still waiting to be completed"}.`
            : `Puasa ${summary.puasa.fast_type} ${summary.puasa.completed ? "sudah selesai" : "masih menunggu penyelesaian"}.`
          : isEnglish
            ? "There is no fasting record today yet."
            : "Belum ada catatan puasa hari ini.",
        summary.puasa.fast_type
          ? isEnglish
            ? "A fasting day only becomes active in contribution once its status is marked completed."
            : "Hari puasa baru dianggap aktif dalam contribution jika status puasanya selesai."
          : isEnglish
            ? "Start with one fasting record to begin forming a consistency pattern."
            : "Mulai dari satu catatan puasa untuk membentuk pola konsistensi.",
      ];
    case "keuangan":
      return [
        isEnglish
          ? `This month's balance is ${formatCurrency(summary.finance.balance, language)}.`
          : `Saldo bulan ini ${formatCurrency(summary.finance.balance, language)}.`,
        Number(summary.finance.income) === 0 &&
        Number(summary.finance.expense) === 0
          ? isEnglish
            ? "Finance contribution measures transaction count per day, not the amount size."
            : "Contribution keuangan mengukur jumlah transaksi per hari, bukan besar nominalnya."
          : isEnglish
            ? `${formatCurrency(summary.finance.income, language)} income and ${formatCurrency(summary.finance.expense, language)} expense are recorded.`
            : `${formatCurrency(summary.finance.income, language)} pemasukan dan ${formatCurrency(summary.finance.expense, language)} pengeluaran tercatat.`,
      ];
    case "olahraga":
      return [
        isEnglish
          ? `${summary.sport.completed_count} completed sessions with a total of ${summary.sport.completed_minutes} minutes this week.`
          : `${summary.sport.completed_count} sesi selesai dengan total ${summary.sport.completed_minutes} menit minggu ini.`,
        summary.sport.completed_count > 0
          ? isEnglish
            ? "Workout contribution only reads sessions that were truly completed."
            : "Contribution olahraga membaca sesi yang benar-benar selesai."
          : isEnglish
            ? "One short completed session is enough to start filling workout contribution."
            : "Cukup satu sesi pendek yang selesai untuk mulai mengisi contribution olahraga.",
      ];
    case "jurnal":
      return [
        summary.journal.written
          ? isEnglish
            ? "Today's journal is already written."
            : "Jurnal hari ini sudah ditulis."
          : isEnglish
            ? "Today's journal has not been written yet."
            : "Jurnal hari ini belum ditulis.",
        summary.journal.written
          ? isEnglish
            ? "One journal entry is enough to make that day active in journal contribution."
            : "Satu entri jurnal sudah cukup membuat hari itu aktif di contribution jurnal."
          : isEnglish
            ? "Add one short reflection so today feels more complete."
            : "Tambahkan satu refleksi singkat agar hari ini terasa lebih selesai.",
      ];
    default:
      return [isEnglish ? "No additional summary yet." : "Belum ada ringkasan tambahan."];
  }
}

function formatCurrency(value: string, language: "id" | "en") {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return formatCurrencyForDisplay("0", language, { maximumFractionDigits: 0 });
  }

  return formatCurrencyForDisplay(parsed, language, {
    maximumFractionDigits: 0,
  });
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

function formatMonthLabel(value: string, language: "id" | "en") {
  return formatUtcMonthYearForDisplay(value, language, {
    month: "long",
    year: "numeric",
  });
}

function getModuleLabel(module: ModuleKey, language: "id" | "en") {
  if (language === "en") {
    switch (module) {
      case "sholat":
        return "Prayer";
      case "puasa":
        return "Fasting";
      case "keuangan":
        return "Finance";
      case "olahraga":
        return "Workout";
      case "jurnal":
        return "Journal";
    }
  }

  switch (module) {
    case "sholat":
      return "Sholat";
    case "puasa":
      return "Puasa";
    case "keuangan":
      return "Keuangan";
    case "olahraga":
      return "Olahraga";
    case "jurnal":
      return "Jurnal";
  }
}
