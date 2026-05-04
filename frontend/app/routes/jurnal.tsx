import { BookOpenText, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/jurnal";
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

type JournalEntry = {
  id: number;
  entry_date: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  is_private: boolean;
};

type LoaderData = {
  history: JournalEntry[];
  apiError?: string;
};

const historyLimit = 10;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jurnal Harian | Codefalah Tracker" },
    { name: "description", content: "Jurnal harian pribadi." },
  ];
}

export async function loader(): Promise<LoaderData> {
  try {
    return {
      history: await apiRequest<JournalEntry[]>(
        `/api/journal-entries?limit=${historyLimit}`,
      ),
    };
  } catch {
    return {
      history: [],
      apiError:
        "Timeline jurnal belum tersedia dari backend. Data akan tampil di sini setelah backend siap.",
    };
  }
}

export default function JurnalRoute() {
  const { language } = useLocale();
  const isEnglish = language === "en";
  const { history, apiError } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [entryDate, setEntryDate] = useState(getTodayDateInputValue());
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
      await apiRequest("/api/journal-entries", {
        method: "POST",
        body: {
          entry_date: formData.get("entry_date")?.toString() ?? "",
          title: formData.get("title")?.toString() ?? "",
          content: formData.get("content")?.toString() ?? "",
          mood: formData.get("mood")?.toString() ?? "",
          tags: formData.get("tags")?.toString() ?? "",
          is_private: formData.has("is_private"),
        },
      });

      form.reset();
      setEntryDate(getTodayDateInputValue());
      form.is_private.checked = true;
      setSaveState({
        tone: "success",
        message: isEnglish ? "Journal entry saved successfully." : "Jurnal berhasil disimpan.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      console.error("Failed to save journal entry", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : isEnglish
              ? "Failed to save journal entry."
              : "Gagal menyimpan jurnal.",
      });
    }
  }

  return (
    <MainLayout
      title="Jurnal Harian"
      description={
        isEnglish
          ? "Track your story, mood, tags, and personal timeline."
          : "Catatan cerita, mood, tag, dan timeline pribadi."
      }
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {isEnglish
            ? "Journal timeline is not available from the backend yet. Data will appear here after the backend is ready."
            : apiError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpenText className="size-5 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              {isEnglish ? "Write Journal" : "Tulis Jurnal"}
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
                  name="entry_date"
                  required
                  value={entryDate}
                  onChange={(event) => setEntryDate(event.currentTarget.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Mood
                <input
                  name="mood"
                  placeholder="Senang"
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Title" : "Judul"}
              <input
                name="title"
                placeholder={isEnglish ? "Today..." : "Hari ini..."}
                required
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Story" : "Cerita"}
              <textarea
                name="content"
                rows={7}
                required
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Tags" : "Tag"}
              <input
                name="tags"
                placeholder={isEnglish ? "workout, reflection" : "olahraga, refleksi"}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="flex h-9 items-center gap-3 text-sm font-medium text-foreground">
              <input type="checkbox" name="is_private" defaultChecked />
              {isEnglish ? "Private" : "Privat"}
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              {isEnglish ? "Save" : "Simpan"}
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            {isEnglish ? "Timeline" : "Timeline"}
          </h2>
          <div className="mt-4 grid gap-3">
            {history.length === 0 ? (
              <EmptyState
                icon={BookOpenText}
                title={isEnglish ? "No journal entries yet" : "Belum ada catatan jurnal"}
                description={
                  isEnglish
                    ? "Saved journal entries will appear in this timeline."
                    : "Entri jurnal yang berhasil tersimpan akan muncul di timeline ini."
                }
              />
            ) : (
              history.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        to={`/jurnal/${entry.id}`}
                        className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
                      >
                        {entry.title}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatRecordDate(entry.entry_date, language)}
                        {entry.mood ? ` · ${entry.mood}` : ""}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {truncateContent(entry.content)}
                  </p>
                  <Link
                    to={`/jurnal/${entry.id}`}
                    className="mt-3 inline-flex text-xs font-medium text-foreground underline-offset-4 hover:underline"
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

function truncateContent(value: string) {
  if (value.length <= 96) {
    return value;
  }

  return `${value.slice(0, 93)}...`;
}
