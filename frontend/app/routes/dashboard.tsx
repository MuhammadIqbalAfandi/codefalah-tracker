import {
  BookOpenText,
  CheckCircle2,
  Dumbbell,
  Landmark,
  Moon,
  WalletCards,
} from "lucide-react";
import { useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/dashboard";
import { ContributionGraph } from "~/components/contribution-graph";
import { EmptyState } from "~/components/empty-state";
import { formatLocalDateInputValue } from "~/lib/form-defaults";
import { subscribeToTrackerDataChanges } from "~/lib/tracker-sync";
import { MainLayout } from "~/components/main-layout";
import { SummaryCard } from "~/components/summary-card";
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

type ContributionGraphResponse = {
  start_date: string;
  end_date: string;
  days: Array<{
    date: string;
    score: number;
  }>;
};

type DashboardLoaderData = {
  summary: DashboardSummary;
  contribution: ContributionGraphResponse;
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

const emptyContribution: ContributionGraphResponse = {
  start_date: "",
  end_date: "",
  days: [],
};

export async function loader(): Promise<DashboardLoaderData> {
  const [summaryResult, contributionResult] = await Promise.allSettled([
    apiRequest<DashboardSummary>("/api/dashboard/summary"),
    apiRequest<ContributionGraphResponse>("/api/dashboard/contribution-graph"),
  ]);

  const summary =
    summaryResult.status === "fulfilled" ? summaryResult.value : emptySummary;
  const contribution =
    contributionResult.status === "fulfilled"
      ? contributionResult.value
      : emptyContribution;

  return {
    summary,
    contribution,
    apiError:
      summaryResult.status === "rejected" ||
      contributionResult.status === "rejected"
        ? "Data backend belum tersedia. Dashboard menampilkan nilai kosong sementara."
        : undefined,
  };
}

export default function DashboardRoute() {
  const { summary, contribution, apiError } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  useEffect(() => {
    return subscribeToTrackerDataChanges(() => {
      revalidator.revalidate();
    });
  }, [revalidator]);

  const sholatValue = `${summary.sholat.completed_count}/${summary.sholat.total_count}`;
  const puasaValue = summary.puasa.fast_type
    ? summary.puasa.completed
      ? `${summary.puasa.fast_type} selesai`
      : `${summary.puasa.fast_type} berjalan`
    : "Tidak puasa";
  const financeBalance = formatCurrency(summary.finance.balance);
  const progressPercent = getProgressPercent(summary);

  return (
    <MainLayout
      title="Dashboard"
      description="Ringkasan awal untuk memantau ibadah, keuangan, olahraga, dan jurnal harian."
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {apiError}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Sholat"
          value={sholatValue}
          description={`Progress sholat untuk ${summary.date}.`}
          icon={Landmark}
          tone="green"
        />
        <SummaryCard
          title="Puasa"
          value={puasaValue}
          description="Status puasa hari ini dari Puasa Tracker."
          icon={Moon}
          tone="blue"
        />
        <SummaryCard
          title="Keuangan"
          value={financeBalance}
          description={`${formatCurrency(summary.finance.income)} masuk, ${formatCurrency(summary.finance.expense)} keluar bulan ini.`}
          icon={WalletCards}
          tone="amber"
        />
        <SummaryCard
          title="Olahraga"
          value={`${summary.sport.completed_minutes} menit`}
          description={`${summary.sport.completed_count} olahraga selesai minggu ini.`}
          icon={Dumbbell}
          tone="rose"
        />
        <SummaryCard
          title="Jurnal"
          value={summary.journal.written ? "Sudah ditulis" : "Belum ditulis"}
          description="Status jurnal harian dari Jurnal Harian."
          icon={BookOpenText}
          tone="neutral"
        />
        <SummaryCard
          title="Progress"
          value={`${progressPercent}%`}
          description="Progress sederhana dari sholat, puasa, olahraga, dan jurnal hari ini."
          icon={CheckCircle2}
          tone="green"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <ContributionGraph days={contribution.days} />
        {summary.journal.written ? (
          <section className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
            <h2 className="text-sm font-semibold text-foreground">
              Jurnal hari ini
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Jurnal sudah ditulis. Buka Jurnal Harian untuk melihat timeline
              dan catatan lengkap.
            </p>
          </section>
        ) : (
          <EmptyState
            icon={BookOpenText}
            title="Belum ada catatan hari ini"
            description="Jurnal, riwayat tracker, dan insight singkat akan muncul setelah module mulai digunakan."
          />
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <ModuleSummary
          title="Ibadah"
          items={[
            `Sholat selesai ${sholatValue}`,
            summary.puasa.fast_type
              ? `Puasa ${summary.puasa.fast_type}: ${summary.puasa.completed ? "selesai" : "belum selesai"}`
              : "Tidak ada catatan puasa hari ini",
          ]}
        />
        <ModuleSummary
          title="Aktivitas"
          items={[
            `Olahraga minggu ini ${summary.sport.completed_count} kali`,
            `Durasi olahraga ${summary.sport.completed_minutes} menit`,
            `Jurnal ${summary.journal.written ? "sudah ditulis" : "belum ditulis"}`,
          ]}
        />
      </section>
    </MainLayout>
  );
}

function ModuleSummary({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function getProgressPercent(summary: DashboardSummary) {
  const sholatDone =
    summary.sholat.total_count > 0 &&
    summary.sholat.completed_count >= summary.sholat.total_count;
  const completedCount = [
    sholatDone,
    summary.puasa.completed,
    summary.sport.completed_count > 0,
    summary.journal.written,
  ].filter(Boolean).length;

  return Math.round((completedCount / 4) * 100);
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
