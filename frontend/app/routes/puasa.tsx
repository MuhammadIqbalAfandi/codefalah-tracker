import { Moon, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/puasa";
import { EmptyState } from "~/components/empty-state";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { apiRequest } from "~/services/api-client";

type PuasaRecord = {
  id: number;
  record_date: string;
  fast_type: string;
  completed: boolean;
  sahur: boolean;
  iftar: boolean;
  notes: string;
};

type LoaderData = {
  history: PuasaRecord[];
  apiError?: string;
};

const historyLimit = 10;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Puasa Tracker | Codefalah Tracker" },
    { name: "description", content: "Catatan puasa harian." },
  ];
}

export async function loader(): Promise<LoaderData> {
  try {
    return {
      history: await apiRequest<PuasaRecord[]>(
        `/api/puasa-records?limit=${historyLimit}`,
      ),
    };
  } catch {
    return {
      history: [],
      apiError:
        "Riwayat puasa belum tersedia dari backend. Data baru akan muncul setelah koneksi backend siap.",
    };
  }
}

export default function PuasaRoute() {
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
      await apiRequest("/api/puasa-records", {
        method: "POST",
        body: {
          record_date: formData.get("record_date")?.toString() ?? "",
          fast_type: formData.get("fast_type")?.toString() ?? "",
          completed: formData.has("selesai"),
          sahur: formData.has("sahur"),
          iftar: formData.has("berbuka"),
          notes: formData.get("notes")?.toString() ?? "",
        },
      });

      form.reset();
      form.record_date.value = getTodayDateInputValue();
      setSaveState({
        tone: "success",
        message: "Catatan puasa berhasil disimpan.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      console.error("Failed to save puasa record", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan catatan puasa.",
      });
    }
  }

  return (
    <MainLayout
      title="Puasa Tracker"
      description="Catatan jenis puasa, sahur, berbuka, dan status harian."
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {apiError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Moon className="size-5 text-sky-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Catatan Puasa
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Jenis puasa
                <input
                  name="fast_type"
                  placeholder="Senin Kamis"
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {["Selesai", "Sahur", "Berbuka"].map((label) => (
                <label
                  key={label}
                  className="flex h-11 items-center gap-3 rounded-md border border-border px-3 text-sm font-medium"
                >
                  <input
                    type="checkbox"
                    name={label === "Berbuka" ? "berbuka" : label.toLowerCase()}
                  />
                  {label}
                </label>
              ))}
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Catatan
              <textarea
                name="notes"
                rows={4}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              Simpan
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Riwayat</h2>
          <div className="mt-4 grid gap-3">
            {history.length === 0 ? (
              <EmptyState
                icon={Moon}
                title="Belum ada riwayat puasa"
                description="Catatan puasa yang berhasil tersimpan akan muncul di sini."
              />
            ) : (
              history.map((item) => (
                <article key={item.id} className="rounded-md border border-border p-3">
                  <Link
                    to={`/puasa/${item.id}`}
                    className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {item.fast_type}
                  </Link>
                  <div className="mt-2 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                    <span>{formatRecordDate(item.record_date)}</span>
                    <span>{item.completed ? "Selesai" : "Belum selesai"}</span>
                  </div>
                  <Link
                    to={`/puasa/${item.id}`}
                    className="mt-3 inline-flex text-xs font-medium text-sky-700 underline-offset-4 hover:underline dark:text-sky-300"
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

function formatRecordDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
