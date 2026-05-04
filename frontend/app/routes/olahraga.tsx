import { Dumbbell, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/olahraga";
import { EmptyState } from "~/components/empty-state";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { DateField } from "~/components/ui/date-field";
import {
  formatDateOnlyForDisplay,
  getTodayDateInputValue,
} from "~/lib/form-defaults";
import { useLocale } from "~/lib/localization";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { apiRequest } from "~/services/api-client";

type SportRecord = {
  id: number;
  record_date: string;
  sport_type: string;
  duration_minutes: number;
  completed: boolean;
  notes: string;
};

type LoaderData = {
  history: SportRecord[];
  apiError?: string;
};

const historyLimit = 10;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Olahraga Tracker | Codefalah Tracker" },
    { name: "description", content: "Catatan olahraga mingguan." },
  ];
}

export async function loader(): Promise<LoaderData> {
  try {
    return {
      history: await apiRequest<SportRecord[]>(
        `/api/sport-records?limit=${historyLimit}`,
      ),
    };
  } catch {
    return {
      history: [],
      apiError:
        "Riwayat olahraga belum tersedia dari backend. Data akan tampil di sini setelah backend siap.",
    };
  }
}

export default function OlahragaRoute() {
  const { language } = useLocale();
  const isEnglish = language === "en";
  const { history, apiError } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [recordDate, setRecordDate] = useState(getTodayDateInputValue());
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
      await apiRequest("/api/sport-records", {
        method: "POST",
        body: {
          record_date: formData.get("record_date")?.toString() ?? "",
          sport_type: formData.get("sport_type")?.toString() ?? "",
          duration_minutes: parseInt(
            formData.get("duration_minutes")?.toString() ?? "0",
            10,
          ),
          completed: formData.has("completed"),
          notes: formData.get("notes")?.toString() ?? "",
        },
      });

      form.reset();
      setRecordDate(getTodayDateInputValue());
      form.duration_minutes.value = "0";
      setSaveState({
        tone: "success",
        message: isEnglish ? "Workout record saved successfully." : "Catatan olahraga berhasil disimpan.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      console.error("Failed to save sport record", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : isEnglish
              ? "Failed to save workout record."
              : "Gagal menyimpan catatan olahraga.",
      });
    }
  }

  return (
    <MainLayout
      title="Olahraga Tracker"
      description={
        isEnglish
          ? "Track workout type, duration, completion status, and history."
          : "Catatan jenis olahraga, durasi, status, dan riwayat."
      }
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {isEnglish
            ? "Workout history is not available from the backend yet. Data will appear here after the backend is ready."
            : apiError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-5 text-rose-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              {isEnglish ? "Workout Record" : "Catatan Olahraga"}
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Date" : "Tanggal"}
                <DateField
                  name="record_date"
                  required
                  value={recordDate}
                  onChange={(event) => setRecordDate(event.currentTarget.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Workout type" : "Jenis olahraga"}
                <input
                  name="sport_type"
                  placeholder={isEnglish ? "Walking" : "Jalan kaki"}
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Duration in minutes" : "Durasi menit"}
                <input
                  type="number"
                  min="0"
                  name="duration_minutes"
                  defaultValue="0"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="flex items-end gap-3 text-sm font-medium text-foreground">
                <span className="flex h-9 items-center gap-3 rounded-md border border-border px-3">
                  <input type="checkbox" name="completed" />
                  {isEnglish ? "Completed" : "Selesai"}
                </span>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Notes" : "Catatan"}
              <textarea
                name="notes"
                rows={4}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              {isEnglish ? "Save" : "Simpan"}
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            {isEnglish ? "History" : "Riwayat"}
          </h2>
          <div className="mt-4 grid gap-3">
            {history.length === 0 ? (
              <EmptyState
                icon={Dumbbell}
                title={isEnglish ? "No workout history yet" : "Belum ada riwayat olahraga"}
                description={
                  isEnglish
                    ? "Saved workout records will appear here."
                    : "Catatan olahraga yang berhasil tersimpan akan muncul di sini."
                }
              />
            ) : (
              history.map((item) => (
                <article key={item.id} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      to={`/olahraga/${item.id}`}
                      className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {item.sport_type}
                    </Link>
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.completed
                        ? isEnglish
                          ? "Completed"
                          : "Selesai"
                        : isEnglish
                          ? "Pending"
                          : "Belum"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {formatRecordDate(item.record_date, language)} · {item.duration_minutes}{" "}
                    {isEnglish ? "minutes" : "menit"}
                  </p>
                  <Link
                    to={`/olahraga/${item.id}`}
                    className="mt-3 inline-flex text-xs font-medium text-rose-700 underline-offset-4 hover:underline dark:text-rose-300"
                  >
                    {isEnglish ? "View detail" : "Lihat detail"}
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

function formatRecordDate(value: string, language: "id" | "en") {
  return formatDateOnlyForDisplay(value, undefined, language);
}
