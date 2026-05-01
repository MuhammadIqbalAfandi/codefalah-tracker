import { useState, type FormEvent } from "react";
import { BookOpenText, Save } from "lucide-react";

import type { Route } from "./+types/jurnal";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { apiRequest } from "~/services/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Jurnal Harian | Codefalah Tracker" },
    { name: "description", content: "Jurnal harian pribadi." },
  ];
}

const entries = [
  {
    date: "2026-05-01",
    title: "Olahraga pagi",
    mood: "Senang",
    excerpt: "Bangun lebih awal dan jalan kaki selama 30 menit.",
  },
  {
    date: "2026-04-30",
    title: "Evaluasi keuangan",
    mood: "Tenang",
    excerpt: "Mulai merapikan pengeluaran makan dan transportasi.",
  },
];

export default function JurnalRoute() {
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
      form.entry_date.value = getTodayDateInputValue();
      form.is_private.checked = true;
      setSaveState({
        tone: "success",
        message: "Jurnal berhasil disimpan.",
      });
    } catch (error) {
      console.error("Failed to save journal entry", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan jurnal.",
      });
    }
  }

  return (
    <MainLayout
      title="Jurnal Harian"
      description="Catatan cerita, mood, tag, dan timeline pribadi."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpenText className="size-5 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Tulis Jurnal
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
                  name="entry_date"
                  required
                  defaultValue={getTodayDateInputValue()}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
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
              Judul
              <input
                name="title"
                placeholder="Hari ini..."
                required
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Cerita
              <textarea
                name="content"
                rows={7}
                required
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Tag
              <input
                name="tags"
                placeholder="olahraga, refleksi"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="flex h-9 items-center gap-3 text-sm font-medium text-foreground">
              <input type="checkbox" name="is_private" defaultChecked />
              Private
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              Simpan
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Timeline</h2>
          <div className="mt-4 grid gap-3">
            {entries.map((entry) => (
              <article
                key={`${entry.date}-${entry.title}`}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {entry.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {entry.date} · {entry.mood}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {entry.excerpt}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
