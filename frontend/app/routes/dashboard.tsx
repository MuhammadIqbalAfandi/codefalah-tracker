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
import { cn } from "~/lib/utils";
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

  const sholatValue = `${summary.sholat.completed_count} dari ${summary.sholat.total_count}`;
  const puasaValue = summary.puasa.fast_type
    ? summary.puasa.completed
      ? summary.puasa.fast_type
      : summary.puasa.fast_type
    : "Tidak puasa";
  const financeBalance = formatCurrency(summary.finance.balance);
  const progressPercent = getProgressPercent(summary);
  const completedDailySignals = getCompletedDailySignals(summary);
  const progressDetails = getProgressDetails(summary);

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
          title="Sholat Hari Ini"
          value={sholatValue}
          description={`Jumlah sholat yang sudah tercatat pada ${summary.date}.`}
          icon={Landmark}
          tone="green"
          footer={
            <CardFooter
              periodLabel="Periode: hari ini"
              detailLabel="Sumber: data sholat tersimpan"
            />
          }
        />
        <SummaryCard
          title="Puasa Hari Ini"
          value={puasaValue}
          description={
            summary.puasa.fast_type
              ? summary.puasa.completed
                ? "Jenis puasa yang sudah selesai dicatat untuk hari ini."
                : "Jenis puasa yang sedang berjalan atau belum selesai untuk hari ini."
              : "Belum ada puasa yang tercatat untuk hari ini."
          }
          icon={Moon}
          tone="blue"
          footer={
            <CardFooter
              periodLabel="Periode: hari ini"
              detailLabel="Sumber: data puasa tersimpan"
            />
          }
        />
        <SummaryCard
          title="Saldo Bulan Ini"
          value={financeBalance}
          description={`Ringkasan keuangan bulan ini: ${formatCurrency(summary.finance.income)} pemasukan dan ${formatCurrency(summary.finance.expense)} pengeluaran.`}
          icon={WalletCards}
          tone="amber"
          footer={
            <CardFooter
              periodLabel="Periode: bulan ini"
              detailLabel="Nilai utama: saldo berjalan"
            />
          }
        />
        <SummaryCard
          title="Olahraga Minggu Ini"
          value={`${summary.sport.completed_minutes} menit`}
          description={`${summary.sport.completed_count} sesi olahraga selesai tercatat pada minggu ini.`}
          icon={Dumbbell}
          tone="rose"
          footer={
            <CardFooter
              periodLabel="Periode: minggu ini"
              detailLabel="Nilai utama: total durasi selesai"
            />
          }
        />
        <SummaryCard
          title="Jurnal Hari Ini"
          value={summary.journal.written ? "Sudah ditulis" : "Belum ditulis"}
          description={`Status catatan jurnal untuk tanggal ${summary.date}.`}
          icon={BookOpenText}
          tone="neutral"
          footer={
            <CardFooter
              periodLabel="Periode: hari ini"
              detailLabel="Sumber: data jurnal tersimpan"
            />
          }
        />
        <SummaryCard
          title="Progress Harian"
          value={`${progressPercent}% selesai`}
          description={`${completedDailySignals} dari 4 indikator harian sudah terpenuhi untuk ${summary.date}. Progress ini dihitung dari sholat lengkap, puasa selesai, olahraga tercatat, dan jurnal ditulis.`}
          icon={CheckCircle2}
          tone="green"
          footer={
            <div className="grid gap-2 text-xs text-muted-foreground">
              <CardFooter
                periodLabel="Periode: hari ini"
                detailLabel="Perhitungan: 4 indikator aktivitas"
              />
              <ProgressBreakdown details={progressDetails} />
            </div>
          }
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <ContributionGraph
          days={contribution.days}
          startDate={contribution.start_date}
          endDate={contribution.end_date}
        />
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <ModuleSummary
          title="Ringkasan Sholat"
          periodLabel="Hari ini"
          items={[
            `${summary.sholat.completed_count} dari ${summary.sholat.total_count} sholat sudah tercatat`,
            summary.sholat.completed_count >= summary.sholat.total_count
              ? "Semua waktu sholat hari ini sudah lengkap"
              : `${summary.sholat.total_count - summary.sholat.completed_count} waktu sholat masih belum tercatat`,
          ]}
        />
        <ModuleSummary
          title="Ringkasan Puasa"
          periodLabel="Hari ini"
          items={[
            summary.puasa.fast_type
              ? `Puasa ${summary.puasa.fast_type} ${summary.puasa.completed ? "sudah selesai" : "masih berjalan atau belum selesai"}`
              : "Belum ada catatan puasa untuk hari ini",
            summary.puasa.fast_type
              ? "Status puasa diambil dari record puasa yang tersimpan"
              : "Tambahkan record puasa jika ada aktivitas puasa hari ini",
          ]}
        />
        <ModuleSummary
          title="Ringkasan Keuangan"
          periodLabel="Bulan ini"
          items={[
            `Saldo berjalan ${financeBalance}`,
            `${formatCurrency(summary.finance.income)} pemasukan dan ${formatCurrency(summary.finance.expense)} pengeluaran`,
          ]}
        />
        <ModuleSummary
          title="Ringkasan Olahraga"
          periodLabel="Minggu ini"
          items={[
            `${summary.sport.completed_count} sesi olahraga selesai`,
            `${summary.sport.completed_minutes} menit total durasi tercatat`,
          ]}
        />
        <ModuleSummary
          title="Ringkasan Jurnal"
          periodLabel="Hari ini"
          items={[
            summary.journal.written
              ? "Jurnal hari ini sudah ditulis"
              : "Jurnal hari ini belum ditulis",
            summary.journal.written
              ? "Buka Jurnal Harian untuk melihat isi dan timeline catatan"
              : "Tambahkan catatan jurnal untuk melengkapi refleksi harian",
          ]}
        />
        <ModuleSummary
          title="Ringkasan Aktivitas"
          periodLabel="Gabungan periode aktif"
          items={[
            `Sholat dan jurnal memakai status harian ${summary.date}`,
            "Olahraga merangkum minggu ini, keuangan merangkum bulan ini",
            "Gunakan kartu utama di atas untuk melihat nilai tiap periode dengan cepat",
          ]}
        />
      </section>
    </MainLayout>
  );
}

function CardFooter({
  periodLabel,
  detailLabel,
}: {
  periodLabel: string;
  detailLabel: string;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
      <span className="rounded-full bg-muted px-2 py-1">{periodLabel}</span>
      <span className="rounded-full bg-muted px-2 py-1">{detailLabel}</span>
    </div>
  );
}

function ModuleSummary({
  title,
  periodLabel,
  items,
}: {
  title: string;
  periodLabel: string;
  items: string[];
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
          {periodLabel}
        </span>
      </div>
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

function ProgressBreakdown({
  details,
}: {
  details: Array<{ label: string; completed: boolean }>;
}) {
  return (
    <ul className="grid gap-1.5">
      {details.map((detail) => (
        <li
          key={detail.label}
          className="flex items-center justify-between gap-3 rounded-md bg-muted/70 px-2 py-1.5"
        >
          <span>{detail.label}</span>
          <span
            className={cn(
              "font-medium",
              detail.completed ? "text-emerald-700 dark:text-emerald-300" : "",
            )}
          >
            {detail.completed ? "Terpenuhi" : "Belum"}
          </span>
        </li>
      ))}
    </ul>
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
