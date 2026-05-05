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
import { type ModuleKey } from "~/lib/dashboard-contribution";
import {
  formatDateOnlyForDisplay,
  formatCurrencyForDisplay,
  getTodayDateInputValue,
  parseDateOnly,
} from "~/lib/form-defaults";
import { useLocale, useTranslations } from "~/lib/localization";
import { ApiError, apiRequest } from "~/services/api-client";

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
  const { language } = useLocale();
  const t = useTranslations();
  const isEnglish = language === "en";
  const config = moduleConfigs[module];
  const Icon = config.icon;
  const initialMonthKey = resolveInitialMonthKey(startDate, endDate);
  const localizedLabel = getModuleLabel(module, language);

  return (
    <MainLayout
      title={isEnglish ? `${localizedLabel} Contribution` : `Contribution ${localizedLabel}`}
      description={getModuleDescription(module, language) ?? description}
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t.common.backToDashboard}
          </Link>
          <Link
            to={config.moduleHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {isEnglish ? `Open ${localizedLabel}` : `Buka module ${localizedLabel}`}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      }
    >
      <div className="grid min-w-0 gap-4">
        <section className="min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <ContributionGraph
            module={module}
            title={
              isEnglish
                ? `${localizedLabel} contribution in the last 12 months`
                : `Contribution ${localizedLabel} 12 bulan terakhir`
            }
            description={
              isEnglish
                ? `The graph is automatically directed to the most relevant month so the ${localizedLabel.toLowerCase()} contribution pattern is easier to read.`
                : `Graph langsung diarahkan ke bulan yang paling relevan supaya pola kontribusi ${localizedLabel.toLowerCase()} lebih cepat terbaca.`
            }
            days={graph.days}
            startDate={startDate}
            endDate={endDate}
            initialMonthKey={initialMonthKey}
          />
        </section>

        <section className="min-w-0 rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Icon className="size-3.5" aria-hidden="true" />
                {isEnglish ? "Related activity" : "Aktivitas terkait"}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-foreground">
                {isEnglish ? `${localizedLabel} activity list` : `Daftar aktivitas ${localizedLabel}`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEnglish
                  ? "The activities below are filtered to the active days that actually form the contribution graph in the currently visible range."
                  : "Aktivitas di bawah ini disaring mengikuti hari aktif yang benar-benar membentuk contribution graph pada rentang yang sedang ditampilkan."}
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              {records.length} {isEnglish ? "items" : "item"}
            </span>
          </div>

          <div className="mt-4">
            {records.length === 0 ? (
              <EmptyState
                icon={Icon}
                title={
                  isEnglish
                    ? `No ${localizedLabel.toLowerCase()} activity in this range`
                    : `Belum ada aktivitas ${localizedLabel.toLowerCase()} pada rentang ini`
                }
                description={
                  isEnglish
                    ? "When a record enters this contribution range, its activity details will appear below the graph."
                    : "Saat ada record yang masuk ke rentang contribution ini, detail aktivitasnya akan muncul di bawah graph."
                }
              />
            ) : (
              <div className="grid gap-3">
                {records.map((record) => (
                  <ActivityCard
                    key={`${module}-${record.id}`}
                    module={module}
                    record={record}
                    language={language}
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
  language,
}: {
  module: ModuleKey;
  record: ContributionRecord;
  language: "id" | "en";
}) {
  switch (module) {
    case "sholat":
      return renderSholatActivity(record as SholatRecord, language);
    case "puasa":
      return renderPuasaActivity(record as PuasaRecord, language);
    case "keuangan":
      return renderFinanceActivity(record as FinanceTransaction, language);
    case "olahraga":
      return renderSportActivity(record as SportRecord, language);
    case "jurnal":
      return renderJournalActivity(record as JournalEntry, language);
    default:
      return null;
  }
}

function renderSholatActivity(record: SholatRecord, language: "id" | "en") {
  const isEnglish = language === "en";
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {formatRecordDate(record.record_date, language)}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {countCompletedPrayers(record)}/5{" "}
            {isEnglish ? "prayers recorded" : "sholat tercatat"} ·{" "}
            {isEnglish ? "congregation" : "berjamaah"} {record.congregation_count}{" "}
            {isEnglish ? "times" : "kali"}
          </p>
        </div>
        <Link
          to={`/sholat/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isEnglish ? "View record" : "Lihat record"}
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

function renderPuasaActivity(record: PuasaRecord, language: "id" | "en") {
  const isEnglish = language === "en";
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.fast_type}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.record_date, language)} ·{" "}
            {record.completed ? (isEnglish ? "Completed" : "Selesai") : isEnglish ? "Not completed" : "Belum selesai"} ·{" "}
            {record.sahur ? "Sahur" : isEnglish ? "No sahur" : "Tanpa sahur"} ·{" "}
            {record.iftar
              ? isEnglish
                ? "Iftar recorded"
                : "Berbuka tercatat"
              : isEnglish
                ? "Iftar not recorded"
                : "Berbuka belum tercatat"}
          </p>
        </div>
        <Link
          to={`/puasa/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isEnglish ? "View record" : "Lihat record"}
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

function renderFinanceActivity(
  record: FinanceTransaction,
  language: "id" | "en",
) {
  const isEnglish = language === "en";
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.category}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.transaction_date, language)} ·{" "}
            {record.transaction_type === "income"
              ? isEnglish
                ? "Income"
                : "Pemasukan"
              : isEnglish
                ? "Expense"
                : "Pengeluaran"}{" "}
            · {formatCurrency(record.amount, language)}
          </p>
        </div>
        <Link
          to={`/keuangan/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isEnglish ? "View record" : "Lihat record"}
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

function renderSportActivity(record: SportRecord, language: "id" | "en") {
  const isEnglish = language === "en";
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.sport_type}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.record_date, language)} · {record.duration_minutes}{" "}
            {isEnglish ? "minutes" : "menit"} ·{" "}
            {record.completed ? (isEnglish ? "Completed" : "Selesai") : isEnglish ? "Not completed" : "Belum selesai"}
          </p>
        </div>
        <Link
          to={`/olahraga/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isEnglish ? "View record" : "Lihat record"}
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

function renderJournalActivity(record: JournalEntry, language: "id" | "en") {
  const isEnglish = language === "en";
  return (
    <article className="rounded-2xl border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {record.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatRecordDate(record.entry_date, language)}
            {record.mood ? ` · ${record.mood}` : ""}
            {record.tags ? ` · ${record.tags}` : ""}
            {record.is_private ? ` · ${isEnglish ? "Private" : "Privat"}` : ""}
          </p>
        </div>
        <Link
          to={`/jurnal/${record.id}`}
          className="text-xs font-medium text-foreground underline-offset-4 hover:underline"
        >
          {isEnglish ? "View record" : "Lihat record"}
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

function resolveInitialMonthKey(startDate: string, endDate: string) {
  const today = getTodayDateInputValue();
  if (today >= startDate && today < endDate) {
    return today.slice(0, 7);
  }

  const inclusiveEnd = parseDateOnly(endDate);
  if (!inclusiveEnd) {
    return undefined;
  }

  inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() - 1);
  return inclusiveEnd.toISOString().slice(0, 7);
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

function formatRecordDate(value: string, language: "id" | "en") {
  return formatDateOnlyForDisplay(value, undefined, language);
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

function formatCurrency(value: string, language: "id" | "en") {
  return formatCurrencyForDisplay(value, language, {
    maximumFractionDigits: 0,
  });
}

function truncateContent(value: string) {
  return value.length > 180 ? `${value.slice(0, 180)}...` : value;
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

function getModuleDescription(module: ModuleKey, language: "id" | "en") {
  const isEnglish = language === "en";

  switch (module) {
    case "sholat":
      return isEnglish
        ? "Prayer contribution detail links the contribution pattern with the worship records that are already saved."
        : "Detail contribution sholat menautkan pola kontribusi dengan catatan ibadah yang sudah tersimpan.";
    case "puasa":
      return isEnglish
        ? "Fasting contribution detail shows the relationship between active days and the fasting records that were saved."
        : "Detail contribution puasa menampilkan keterkaitan antara hari aktif dan record puasa yang tercatat.";
    case "keuangan":
      return isEnglish
        ? "Finance contribution detail shows the transactions that form the daily logging pattern."
        : "Detail contribution keuangan memperlihatkan transaksi yang membentuk pola kontribusi pencatatan harian.";
    case "olahraga":
      return isEnglish
        ? "Workout contribution detail clarifies the relationship between workout days and the saved activity records."
        : "Detail contribution olahraga memperjelas hubungan antara hari latihan dan catatan aktivitas yang tersimpan.";
    case "jurnal":
      return isEnglish
        ? "Journal contribution detail helps read writing days together with the entries that form the contribution pattern."
        : "Detail contribution jurnal membantu melihat hari menulis beserta entri yang membentuk pola kontribusi.";
  }
}
