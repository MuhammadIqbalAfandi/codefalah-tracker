import { useState, type FormEvent } from "react";
import { Moon, Save } from "lucide-react";

import type { Route } from "./+types/puasa";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { apiRequest } from "~/services/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Puasa Tracker | Codefalah Tracker" },
    { name: "description", content: "Catatan puasa harian." },
  ];
}

const history = [
  { date: "2026-05-01", type: "Senin Kamis", status: "Selesai" },
  { date: "2026-04-29", type: "Ayyamul Bidh", status: "Selesai" },
  { date: "2026-04-22", type: "Sunnah", status: "Belum selesai" },
];

export default function PuasaRoute() {
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
            {history.map((item) => (
              <article
                key={`${item.date}-${item.type}`}
                className="rounded-md border border-border p-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {item.type}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm text-muted-foreground">
                  <span>{item.date}</span>
                  <span>{item.status}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
