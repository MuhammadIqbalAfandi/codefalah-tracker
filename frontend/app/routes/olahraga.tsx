import { useState, type FormEvent } from "react";
import { Dumbbell, Save } from "lucide-react";

import type { Route } from "./+types/olahraga";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { apiRequest } from "~/services/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Olahraga Tracker | Codefalah Tracker" },
    { name: "description", content: "Catatan olahraga mingguan." },
  ];
}

const history = [
  { date: "2026-05-01", sport: "Jalan kaki", minutes: 30, completed: true },
  { date: "2026-04-30", sport: "Push up", minutes: 15, completed: true },
  { date: "2026-04-29", sport: "Lari", minutes: 0, completed: false },
];

export default function OlahragaRoute() {
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
      form.record_date.value = getTodayDateInputValue();
      form.duration_minutes.value = "0";
      setSaveState({
        tone: "success",
        message: "Catatan olahraga berhasil disimpan.",
      });
    } catch (error) {
      console.error("Failed to save sport record", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan catatan olahraga.",
      });
    }
  }

  return (
    <MainLayout
      title="Olahraga Tracker"
      description="Catatan jenis olahraga, durasi, status, dan riwayat."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-5 text-rose-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Catatan Olahraga
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
                Jenis olahraga
                <input
                  name="sport_type"
                  placeholder="Jalan kaki"
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Durasi menit
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
                  Selesai
                </span>
              </label>
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
            {history.map((item) => (
              <article
                key={`${item.date}-${item.sport}`}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {item.sport}
                  </p>
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.completed ? "Selesai" : "Belum"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.date} · {item.minutes} menit
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
