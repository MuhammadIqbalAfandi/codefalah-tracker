import { Check, Landmark } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/sholat";
import { EmptyState } from "~/components/empty-state";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { apiRequest } from "~/services/api-client";

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

type LoaderData = {
  history: SholatRecord[];
  apiError?: string;
};

const prayers = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
const historyLimit = 10;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sholat Tracker | Codefalah Tracker" },
    { name: "description", content: "Checklist sholat harian." },
  ];
}

export async function loader(): Promise<LoaderData> {
  try {
    return {
      history: await apiRequest<SholatRecord[]>(
        `/api/sholat-records?limit=${historyLimit}`,
      ),
    };
  } catch {
    return {
      history: [],
      apiError:
        "Riwayat sholat belum tersedia dari backend. Data baru tetap bisa dicoba simpan selama backend siap.",
    };
  }
}

export default function SholatRoute() {
  const { history, apiError } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [saveState, setSaveState] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaveState(null);

    try {
      await apiRequest("/api/sholat-records", {
        method: "POST",
        body: {
          record_date: formData.get("record_date")?.toString() ?? "",
          subuh: formData.has("subuh"),
          dzuhur: formData.has("dzuhur"),
          ashar: formData.has("ashar"),
          maghrib: formData.has("maghrib"),
          isya: formData.has("isya"),
          congregation_count: parseInt(
            formData.get("congregation_count")?.toString() ?? "0",
            10,
          ),
          notes: formData.get("notes")?.toString() ?? "",
        },
      });

      form.reset();
      form.record_date.value = getTodayDateInputValue();
      setSaveState({
        tone: "success",
        message: "Catatan sholat berhasil disimpan.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      console.error("Failed to save sholat record", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan catatan sholat.",
      });
    }
  }

  return (
    <MainLayout
      title="Sholat Tracker"
      description="Catatan sholat harian, berjamaah, dan catatan singkat."
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {apiError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Landmark className="size-5 text-emerald-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Checklist Hari Ini
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Tanggal
              <input
                type="date"
                name="record_date"
                required
                defaultValue={getTodayDateInputValue()}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {prayers.map((prayer) => (
                <label
                  key={prayer}
                  className="flex h-11 items-center gap-3 rounded-md border border-border px-3 text-sm font-medium"
                >
                  <input type="checkbox" name={prayer.toLowerCase()} />
                  {prayer}
                </label>
              ))}
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Jumlah berjamaah
              <input
                type="number"
                min="0"
                max="5"
                name="congregation_count"
                defaultValue="0"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Catatan
              <textarea
                name="notes"
                rows={4}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-fit">
              <Check aria-hidden="true" />
              Simpan
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Riwayat</h2>
          <div className="mt-4 grid gap-3">
            {history.length === 0 ? (
              <EmptyState
                icon={Landmark}
                title="Belum ada riwayat sholat"
                description="Catatan sholat yang berhasil tersimpan akan muncul di sini."
              />
            ) : (
              history.map((item) => (
                <article key={item.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      to={`/sholat/${item.id}`}
                      className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {formatRecordDate(item.record_date)}
                    </Link>
                    <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {countCompletedPrayers(item)}/5
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Berjamaah {item.congregation_count} kali
                  </p>
                  <Link
                    to={`/sholat/${item.id}`}
                    className="mt-3 inline-flex text-xs font-medium text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                  >
                    Lihat detail
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
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

function formatRecordDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
