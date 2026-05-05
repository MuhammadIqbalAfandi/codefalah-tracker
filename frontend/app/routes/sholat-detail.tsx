import { ArrowLeft, Check, Landmark } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import { DeleteConfirmation } from "~/components/delete-confirmation";
import type { Route } from "./+types/sholat-detail";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { DateField } from "~/components/ui/date-field";
import {
  formatDateOnlyForDisplay,
  normalizeDateInputValue,
} from "~/lib/form-defaults";
import { useLocale, useTranslations } from "~/lib/localization";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { ApiError, apiRequest } from "~/services/api-client";

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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detail Sholat | Codefalah Tracker" },
    { name: "description", content: "Detail dan edit catatan sholat." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return {
      record: await apiRequest<SholatRecord>(`/api/sholat-records/${params.id}`),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }
}

export default function SholatDetailRoute() {
  const { record } = useLoaderData<typeof loader>();
  const { language } = useLocale();
  const t = useTranslations();
  const isEnglish = language === "en";
  const navigate = useNavigate();
  const revalidator = useRevalidator();
  const [saveState, setSaveState] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaveState(null);

    try {
      await apiRequest(`/api/sholat-records/${record.id}`, {
        method: "PUT",
        body: {
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

      setSaveState({
        tone: "success",
        message: isEnglish
          ? "Prayer record was updated successfully."
          : "Catatan sholat berhasil diperbarui.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : isEnglish
              ? "Failed to update the prayer record."
              : "Gagal memperbarui catatan sholat.",
      });
    }
  }

  async function handleDelete() {
    setSaveState(null);
    setIsDeleting(true);

    try {
      await apiRequest(`/api/sholat-records/${record.id}`, {
        method: "DELETE",
      });
      notifyTrackerDataChanged();
      navigate("/sholat", { replace: true });
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : isEnglish
              ? "Failed to delete the prayer record."
              : "Gagal menghapus catatan sholat.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <MainLayout
      title={isEnglish ? "Prayer Detail" : "Detail Sholat"}
      description={
        isEnglish
          ? `Edit the prayer record for ${formatRecordDate(record.record_date, language)}.`
          : `Edit catatan sholat untuk ${formatRecordDate(record.record_date, language)}.`
      }
      actions={
        <Link
          to="/sholat"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.common.backToHistory}
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Landmark className="size-5 text-emerald-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              {isEnglish ? "Edit record" : "Edit catatan"}
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {t.common.date}
              <DateField
                value={normalizeDateInputValue(record.record_date)}
                disabled
                helperText={
                  isEnglish
                    ? "This record date stays locked so the worship history remains consistent."
                    : "Tanggal record ini dikunci agar histori ibadah tetap konsisten."
                }
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {getPrayerOptions(language).map((prayer) => (
                <label
                  key={prayer.name}
                  className="flex h-11 items-center gap-3 rounded-md border border-border px-3 text-sm font-medium"
                >
                  <input
                    type="checkbox"
                    name={prayer.name}
                    defaultChecked={record[prayer.name as keyof SholatRecord] as boolean}
                  />
                  {prayer.label}
                </label>
              ))}
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Congregation count" : "Jumlah berjamaah"}
              <input
                type="number"
                min="0"
                max="5"
                name="congregation_count"
                defaultValue={record.congregation_count}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {t.common.notes}
              <textarea
                name="notes"
                rows={4}
                defaultValue={record.notes}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-fit">
              <Check aria-hidden="true" />
              {t.common.saveChanges}
            </Button>
          </form>
          <div className="mt-4">
            <DeleteConfirmation
              title={
                isEnglish
                  ? "Delete this prayer record?"
                  : "Hapus catatan sholat ini?"
              }
              description={
                isEnglish
                  ? "Deleted prayer records cannot be restored."
                  : "Catatan sholat yang dihapus tidak bisa dikembalikan lagi."
              }
              isPending={isDeleting}
              onConfirm={handleDelete}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">{t.common.summary}</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">{t.common.date}</dt>
              <dd className="font-medium text-foreground">
                {formatRecordDate(record.record_date, language)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Progress</dt>
              <dd className="font-medium text-foreground">
                {countCompletedPrayers(record)}/5 {isEnglish ? "completed" : "selesai"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {isEnglish ? "Congregation" : "Berjamaah"}
              </dt>
              <dd className="font-medium text-foreground">
                {record.congregation_count} {isEnglish ? "times" : "kali"}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </MainLayout>
  );
}

function formatRecordDate(value: string, language: "id" | "en") {
  return formatDateOnlyForDisplay(value, undefined, language);
}

function getPrayerOptions(language: "id" | "en") {
  if (language === "en") {
    return [
      { name: "subuh", label: "Fajr" },
      { name: "dzuhur", label: "Dhuhr" },
      { name: "ashar", label: "Asr" },
      { name: "maghrib", label: "Maghrib" },
      { name: "isya", label: "Isha" },
    ] as const;
  }

  return [
    { name: "subuh", label: "Subuh" },
    { name: "dzuhur", label: "Dzuhur" },
    { name: "ashar", label: "Ashar" },
    { name: "maghrib", label: "Maghrib" },
    { name: "isya", label: "Isya" },
  ] as const;
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
