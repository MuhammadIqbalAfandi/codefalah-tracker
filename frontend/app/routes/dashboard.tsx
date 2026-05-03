import {
  ArrowRight,
  BookOpenText,
  Dumbbell,
  Landmark,
  Moon,
  WalletCards,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/dashboard";
import { ContributionGraph } from "~/components/contribution-graph";
import { EmptyState } from "~/components/empty-state";
import { formatLocalDateInputValue } from "~/lib/form-defaults";
import { subscribeToTrackerDataChanges } from "~/lib/tracker-sync";
import { MainLayout } from "~/components/main-layout";
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
  apiError?: string;
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

export async function loader(): Promise<DashboardLoaderData> {
  const [summaryResult, moduleContributionsResult] = await Promise.allSettled([
    apiRequest<DashboardSummary>("/api/dashboard/summary"),
    apiRequest<ModuleContributionResponse>(
      "/api/dashboard/module-contributions",
    ),
  ]);

  const summary =
    summaryResult.status === "fulfilled" ? summaryResult.value : emptySummary;
  const moduleContributions =
    moduleContributionsResult.status === "fulfilled"
      ? moduleContributionsResult.value
      : emptyModuleContributions;

  return {
    summary,
    moduleContributions,
    apiError:
      summaryResult.status === "rejected" ||
      moduleContributionsResult.status === "rejected"
        ? "Data backend belum tersedia. Dashboard menampilkan nilai kosong sementara."
        : undefined,
  };
}

export default function DashboardRoute() {
  const { summary, moduleContributions, apiError } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    return subscribeToTrackerDataChanges(() => {
      revalidator.revalidate();
    });
  }, [revalidator]);

  const sholatValue = `${summary.sholat.completed_count} dari ${summary.sholat.total_count}`;
  const financeBalance = formatCurrency(summary.finance.balance);
  const progressPercent = getProgressPercent(summary);
  const completedDailySignals = getCompletedDailySignals(summary);
  const activeModulesCount = moduleContributions.modules.filter(
    (module) => module.days.length > 0,
  ).length;

  return (
    <MainLayout
      title="Dashboard"
      description="Contribution view per module menjadi pusat utama untuk membaca konsistensi aktivitas harian."
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {apiError}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Fokus utama dashboard
          </span>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Contribution per module sekarang jadi pusat pembacaan progres.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Gunakan lima kartu module di bawah untuk melihat pola kontribusi 12
            bulan terakhir. Ringkasan angka tetap ada sebagai konteks cepat,
            tetapi struktur utama dashboard sekarang diprioritaskan untuk
            membaca konsistensi aktivitas harian.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted px-3 py-1">
              Tanggal acuan: {summary.date}
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              Progress harian: {progressPercent}% selesai
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              {completedDailySignals} dari 4 indikator terpenuhi
            </span>
            <span className="rounded-full bg-muted px-3 py-1">
              {activeModulesCount} module sudah punya kontribusi
            </span>
          </div>
        </article>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">
            Ringkasan cepat hari ini
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <QuickStat
              label="Sholat"
              value={sholatValue}
              detail="Catatan harian"
            />
            <QuickStat
              label="Puasa"
              value={getPuasaSummaryValue(summary)}
              detail="Status hari ini"
            />
            <QuickStat
              label="Keuangan"
              value={financeBalance}
              detail="Saldo bulan ini"
            />
            <QuickStat
              label="Olahraga"
              value={`${summary.sport.completed_minutes} menit`}
              detail="Durasi minggu ini"
            />
            <QuickStat
              label="Jurnal"
              value={summary.journal.written ? "Sudah ditulis" : "Belum ditulis"}
              detail="Status hari ini"
            />
          </div>
        </article>
      </section>

      <section className="grid gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Contribution per module
            </h2>
            <p className="text-sm text-muted-foreground">
              Setiap kartu di bawah mewakili satu module dengan pola kontribusi
              hariannya sendiri.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            Rentang backend: {moduleContributions.start_date || "belum ada"}{" "}
            sampai {moduleContributions.end_date || "belum ada"}
          </span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {moduleContributions.modules.map((module) => (
            <ModuleContributionCard
              key={module.module}
              module={module}
              summary={summary}
              startDate={moduleContributions.start_date}
              endDate={moduleContributions.end_date}
              rangeLabel={`${moduleContributions.start_date} sampai ${moduleContributions.end_date}`}
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
  startDate,
  endDate,
  rangeLabel,
}: {
  module: ModuleContributionResponse["modules"][number];
  summary: DashboardSummary;
  startDate: string;
  endDate: string;
  rangeLabel: string;
}) {
  const metadata = moduleMeta[module.module];

  return (
    <article className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <metadata.icon className="size-3.5" aria-hidden="true" />
            {module.label}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-foreground">
            Contribution {module.label}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {metadata.description}
          </p>
        </div>
        <Link
          to={metadata.contributionHref}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          Detail contribution
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>

      {module.days.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            icon={metadata.icon}
            title={`Belum ada kontribusi ${module.label.toLowerCase()}`}
            description="Contribution graph akan terisi setelah module ini mulai dipakai."
          />
        </div>
      ) : (
        <div className="mt-4">
          <ContributionGraph
            title={`12 bulan terakhir`}
            description={`Pola kontribusi ${module.label.toLowerCase()} pada rentang ${rangeLabel}.`}
            days={module.days}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      )}

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        {getModuleHighlights(module.module, summary).map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-muted/70 px-3 py-2 leading-6"
          >
            {item}
          </div>
        ))}
        <Link
          to={metadata.href}
          className="inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 font-medium text-foreground transition-colors hover:bg-muted"
        >
          Buka module {module.label}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function QuickStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-muted/70 px-4 py-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
      </div>
      <span className="text-xs text-muted-foreground">{detail}</span>
    </div>
  );
}

function getProgressPercent(summary: DashboardSummary) {
  const completedCount = getCompletedDailySignals(summary);

  return Math.round((completedCount / 4) * 100);
}

function getCompletedDailySignals(summary: DashboardSummary) {
  return getProgressDetails(summary).filter((detail) => detail.completed).length;
}

function getProgressDetails(summary: DashboardSummary) {
  const sholatDone =
    summary.sholat.total_count > 0 &&
    summary.sholat.completed_count >= summary.sholat.total_count;

  return [
    {
      label: "Sholat lengkap",
      completed: sholatDone,
    },
    {
      label: "Puasa selesai",
      completed: summary.puasa.completed,
    },
    {
      label: "Olahraga tercatat",
      completed: summary.sport.completed_count > 0,
    },
    {
      label: "Jurnal ditulis",
      completed: summary.journal.written,
    },
  ];
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
    description:
      "Kontribusi harian sholat berdasarkan kelengkapan catatan ibadah per tanggal.",
  },
  puasa: {
    icon: Moon,
    href: "/puasa",
    contributionHref: "/dashboard/contributions/puasa",
    description:
      "Kontribusi puasa menyorot hari-hari ketika puasa dicatat dan diselesaikan.",
  },
  keuangan: {
    icon: WalletCards,
    href: "/keuangan",
    contributionHref: "/dashboard/contributions/keuangan",
    description:
      "Kontribusi keuangan membantu melihat konsistensi pencatatan transaksi dari waktu ke waktu.",
  },
  olahraga: {
    icon: Dumbbell,
    href: "/olahraga",
    contributionHref: "/dashboard/contributions/olahraga",
    description:
      "Kontribusi olahraga menampilkan hari-hari latihan yang benar-benar tercatat.",
  },
  jurnal: {
    icon: BookOpenText,
    href: "/jurnal",
    contributionHref: "/dashboard/contributions/jurnal",
    description:
      "Kontribusi jurnal memperlihatkan pola hari aktif menulis dan refleksi pribadi.",
  },
} as const;

function getModuleHighlights(module: ModuleKey, summary: DashboardSummary) {
  switch (module) {
    case "sholat":
      return [
        `${summary.sholat.completed_count} dari ${summary.sholat.total_count} sholat tercatat hari ini.`,
        summary.sholat.completed_count >= summary.sholat.total_count
          ? "Hari ini semua waktu sholat sudah lengkap."
          : `${summary.sholat.total_count - summary.sholat.completed_count} waktu sholat masih belum tercatat.`,
      ];
    case "puasa":
      return [
        summary.puasa.fast_type
          ? `Puasa ${summary.puasa.fast_type} ${summary.puasa.completed ? "sudah selesai" : "masih berjalan atau belum selesai"}.`
          : "Belum ada catatan puasa untuk hari ini.",
        summary.puasa.fast_type
          ? "Status diambil dari record puasa yang tersimpan."
          : "Tambahkan record puasa untuk mulai membentuk pola kontribusinya.",
      ];
    case "keuangan":
      return [
        `Saldo bulan ini ${formatCurrency(summary.finance.balance)}.`,
        `${formatCurrency(summary.finance.income)} pemasukan dan ${formatCurrency(summary.finance.expense)} pengeluaran tercatat bulan ini.`,
      ];
    case "olahraga":
      return [
        `${summary.sport.completed_count} sesi olahraga selesai tercatat minggu ini.`,
        `${summary.sport.completed_minutes} menit durasi selesai terkumpul minggu ini.`,
      ];
    case "jurnal":
      return [
        summary.journal.written
          ? "Jurnal hari ini sudah ditulis."
          : "Jurnal hari ini belum ditulis.",
        summary.journal.written
          ? "Buka module jurnal untuk melihat detail timeline dan isi catatan."
          : "Tambahkan jurnal untuk memperjelas pola kontribusi refleksi harian.",
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
