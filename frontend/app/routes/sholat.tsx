import { Check, Landmark } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { Route } from "./+types/sholat";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { apiRequest } from "~/services/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sholat Tracker | Codefalah Tracker" },
    { name: "description", content: "Checklist sholat harian." },
  ];
}

const prayers = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];

const history = [
  { date: "2026-05-01", completed: "4/5", congregation: 2 },
  { date: "2026-04-30", completed: "5/5", congregation: 3 },
  { date: "2026-04-29", completed: "3/5", congregation: 1 },
];

export default function SholatRoute() {
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
            {history.map((item) => (
              <article
                key={item.date}
                className="rounded-md border border-border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">
                    {item.date}
                  </p>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    {item.completed}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Berjamaah {item.congregation} kali
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
