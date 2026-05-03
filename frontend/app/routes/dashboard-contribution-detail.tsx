import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Dumbbell,
  Landmark,
  Moon,
  WalletCards,
} from "lucide-react";
import { Link, useLoaderData } from "react-router";

import type { Route } from "./+types/dashboard-contribution-detail";
import { ContributionGraph } from "~/components/contribution-graph";
import { EmptyState } from "~/components/empty-state";
import { MainLayout } from "~/components/main-layout";
import { ApiError, apiRequest } from "~/services/api-client";

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

type SholatRecord = {
  id: number;
  record_date: string;
  subuh: boolean;
  dzuhur: boolean;
  ashar: boolean;
  maghrib: boolean;
  isya: boolean;
  congregation_count: number;
  notes: string;
};

type PuasaRecord = {
  id: number;
  record_date: string;
  fast_type: string;
  completed: boolean;
  sahur: boolean;
  iftar: boolean;
  notes: string;
};

type FinanceTransaction = {
  id: number;
  transaction_date: string;
  transaction_type: "income" | "expense";
  category: string;
  amount: string;
  notes: string;
};

type SportRecord = {
  id: number;
  record_date: string;
  sport_type: string;
  duration_minutes: number;
  completed: boolean;
  notes: string;
};

type JournalEntry = {
  id: number;
  entry_date: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  is_private: boolean;
};

type ContributionRecord =
  | SholatRecord
  | PuasaRecord
  | FinanceTransaction
  | SportRecord
  | JournalEntry;

type LoaderData = {
  module: ModuleKey;
  label: string;
  description: string;
  graph: ModuleContributionResponse["modules"][number];
  startDate: string;
  endDate: string;
  records: ContributionRecord[];
};

const moduleConfigs = {
  sholat: {
    label: "Sholat",
    icon: Landmark,
    moduleHref: "/sholat",
    fetchPath: "/api/sholat-records",
    description:
      "Detail contribution sholat menautkan pola kontribusi dengan catatan ibadah yang sudah tersimpan.",
  },
  puasa: {
    label: "Puasa",
    icon: Moon,
    moduleHref: "/puasa",
    fetchPath: "/api/puasa-records",
    description:
      "Detail contribution puasa menampilkan keterkaitan antara hari aktif dan record puasa yang tercatat.",
  },
  keuangan: {
    label: "Keuangan",
    icon: WalletCards,
    moduleHref: "/keuangan",
    fetchPath: "/api/finance-transactions",
    description:
      "Detail contribution keuangan memperlihatkan transaksi yang membentuk pola kontribusi pencatatan harian.",
  },
  olahraga: {
    label: "Olahraga",
    icon: Dumbbell,
    moduleHref: "/olahraga",
    fetchPath: "/api/sport-records",
    description:
      "Detail contribution olahraga memperjelas hubungan antara hari latihan dan catatan aktivitas yang tersimpan.",
  },
  jurnal: {
    label: "Jurnal",
    icon: BookOpenText,
    moduleHref: "/jurnal",
    fetchPath: "/api/journal-entries",
    description:
      "Detail contribution jurnal membantu melihat hari menulis beserta entri yang membentuk pola kontribusi.",
  },
} as const;

export function meta({ params }: Route.MetaArgs) {
  const module = isModuleKey(params.module) ? params.module : "sholat";
  const config = moduleConfigs[module];

  return [
    { title: `Contribution ${config.label} | Codefalah Tracker` },
    {
      name: "description",
      content: `Detail contribution untuk module ${config.label}.`,
    },
  ];
}

export async function loader({ params }: Route.LoaderArgs): Promise<LoaderData> {
  if (!isModuleKey(params.module)) {
    throw new Response("Not Found", { status: 404 });
  }

  const module = params.module;
  const config = moduleConfigs[module];

  try {
    const contributions = await apiRequest<ModuleContributionResponse>(
      "/api/dashboard/module-contributions",
    );
    const graph =
      contributions.modules.find((item) => item.module === module) ?? {
        module,
        label: config.label,
        days: [],
      };
    const records = await loadContributionRecords(
      module,
      config.fetchPath,
      graph.days,
      contributions.start_date,
      contributions.end_date,
    );

    return {
      module,
      label: config.label,
      description: config.description,
      graph,
      startDate: contributions.start_date,
      endDate: contributions.end_date,
      records,
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }
}

async function loadContributionRecords(
  module: ModuleKey,
  fetchPath: string,
  days: ModuleContributionResponse["modules"][number]["days"],
  startDate: string,
  endDate: string,
) {
  if (!startDate || !endDate) {
    return [] as ContributionRecord[];
  }

  const pageSize = 100;
  const maxPages = 20;
  const records: ContributionRecord[] = [];

  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const offset = pageIndex * pageSize;
    const page = await apiRequest<ContributionRecord[]>(
      `${fetchPath}?limit=${pageSize}&offset=${offset}`,
    );

    records.push(...page);

    if (page.length < pageSize) {
      break;
    }

    const oldestRecord = page.at(-1);
    if (!oldestRecord) {
      break;
    }

    const oldestRecordDate = getRecordDate(module, oldestRecord);
    if (!oldestRecordDate || oldestRecordDate < startDate) {
      break;
    }
  }

  return filterRecordsForContributionDetail(
    module,
    records,
    days,
    startDate,
    endDate,
  );
}

function filterRecordsForContributionDetail(
  module: ModuleKey,
  records: ContributionRecord[],
  days: ModuleContributionResponse["modules"][number]["days"],
  startDate: string,
  endDate: string,
) {
  const activeDates = new Set(
    days.filter((day) => day.score > 0).map((day) => day.date),
  );

  if (activeDates.size === 0) {
    return [];
  }

  return records.filter((record) => {
    const recordDate = getRecordDate(module, record);
    return (
      recordDate >= startDate &&
      recordDate < endDate &&
      activeDates.has(recordDate)
    );
  });
}

export default function DashboardContributionDetailRoute() {
  const { module, label, description, graph, startDate, endDate, records } =
    useLoaderData<typeof loader>();
  const config = moduleConfigs[module];
  const Icon = config.icon;

  return (
    <MainLayout
      title={`Contribution ${label}`}
      description={description}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke dashboard
          </Link>
          <Link
            to={config.moduleHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Buka module {label}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      }
    >
      <div className="grid min-w-0 gap-4">
        <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <ContributionGraph
            title={`Contribution ${label} 12 bulan terakhir`}
            description={`Graph tetap ditampilkan di atas agar pola kontribusi ${label.toLowerCase()} tetap terlihat saat membaca daftar aktivitas di bawahnya.`}
            days={graph.days}
            startDate={startDate}
            endDate={endDate}
          />
        </section>

        <section className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
                Aktivitas terkait
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">
                Daftar aktivitas {label}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Aktivitas di bawah ini disaring mengikuti hari aktif yang
                benar-benar membentuk contribution graph pada rentang yang
                sedang ditampilkan.
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {records.length} item
            </span>
          </div>

          <div className="mt-4">
            {records.length === 0 ? (
              <EmptyState
                icon={Icon}
                title={`Belum ada aktivitas ${label.toLowerCase()} pada rentang ini`}
                description="Saat ada record yang masuk ke rentang contribution ini, detail aktivitasnya akan muncul di bawah graph."
              />
            ) : (
              <div className="grid gap-3">
                {records.map((record) => (
                  <ActivityCard
                    key={`${module}-${record.id}`}
                    module={module}
                    record={record}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

function ActivityCard({
  module,
  record,
}: {
  module: ModuleKey;
  record: ContributionRecord;
}) {
  switch (module) {
    case "sholat":
      return renderSholatActivity(record as SholatRecord);
    case "puasa":
      return renderPuasaActivity(record as PuasaRecord);
    case "keuangan":
      return renderFinanceActivity(record as FinanceTransaction);
    case "olahraga":
      return renderSportActivity(record as SportRecord);
    case "jurnal":
      return renderJournalActivity(record as JournalEntry);
    default:
      return null;
  }
}

function renderSholatActivity(record: SholatRecord) {
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {formatRecordDate(record.record_date)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {countCompletedPrayers(record)}/5 sholat tercatat · berjamaah{" "}
            {record.congregation_count} kali
          </p>
        </div>
        <Link
          to={`/sholat/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          Lihat record
        </Link>
      </div>
      {record.notes ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {record.notes}
        </p>
      ) : null}
    </article>
  );
}

function renderPuasaActivity(record: PuasaRecord) {
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.fast_type}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.record_date)} ·{" "}
            {record.completed ? "Selesai" : "Belum selesai"} ·{" "}
            {record.sahur ? "Sahur" : "Tanpa sahur"} ·{" "}
            {record.iftar ? "Berbuka tercatat" : "Berbuka belum tercatat"}
          </p>
        </div>
        <Link
          to={`/puasa/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          Lihat record
        </Link>
      </div>
      {record.notes ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {record.notes}
        </p>
      ) : null}
    </article>
  );
}

function renderFinanceActivity(record: FinanceTransaction) {
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.category}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.transaction_date)} ·{" "}
            {record.transaction_type === "income" ? "Pemasukan" : "Pengeluaran"}{" "}
            · {formatCurrency(record.amount)}
          </p>
        </div>
        <Link
          to={`/keuangan/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          Lihat record
        </Link>
      </div>
      {record.notes ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {record.notes}
        </p>
      ) : null}
    </article>
  );
}

function renderSportActivity(record: SportRecord) {
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.sport_type}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.record_date)} · {record.duration_minutes}{" "}
            menit · {record.completed ? "Selesai" : "Belum selesai"}
          </p>
        </div>
        <Link
          to={`/olahraga/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          Lihat record
        </Link>
      </div>
      {record.notes ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {record.notes}
        </p>
      ) : null}
    </article>
  );
}

function renderJournalActivity(record: JournalEntry) {
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.entry_date)}
            {record.mood ? ` · ${record.mood}` : ""}
            {record.tags ? ` · ${record.tags}` : ""}
            {record.is_private ? " · Private" : ""}
          </p>
        </div>
        <Link
          to={`/jurnal/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          Lihat record
        </Link>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {truncateContent(record.content)}
      </p>
    </article>
  );
}

function getRecordDate(module: ModuleKey, record: ContributionRecord) {
  switch (module) {
    case "sholat":
    case "puasa":
    case "olahraga":
      return (record as SholatRecord | PuasaRecord | SportRecord).record_date;
    case "keuangan":
      return (record as FinanceTransaction).transaction_date;
    case "jurnal":
      return (record as JournalEntry).entry_date;
    default:
      return "";
  }
}

function isModuleKey(value: string | undefined): value is ModuleKey {
  return (
    value === "sholat" ||
    value === "puasa" ||
    value === "keuangan" ||
    value === "olahraga" ||
    value === "jurnal"
  );
}

function formatRecordDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function countCompletedPrayers(record: SholatRecord) {
  return [
    record.subuh,
    record.dzuhur,
    record.ashar,
    record.maghrib,
    record.isya,
  ].filter(Boolean).length;
}

function formatCurrency(value: string) {
  const amount = Number.parseFloat(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function truncateContent(value: string) {
  return value.length > 180 ? `${value.slice(0, 180)}...` : value;
}
