import { ArrowLeft, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import { DeleteConfirmation } from "~/components/delete-confirmation";
import type { Route } from "./+types/puasa-detail";
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

type PuasaRecord = {
  id: number;
  record_date: string;
  fast_type: string;
  completed: boolean;
  sahur: boolean;
  iftar: boolean;
  notes: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detail Puasa | Codefalah Tracker" },
    { name: "description", content: "Detail dan edit catatan puasa." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return {
      record: await apiRequest<PuasaRecord>(`/api/puasa-records/${params.id}`),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }
}

export default function PuasaDetailRoute() {
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

    const formData = new FormData(event.currentTarget);
    setSaveState(null);

    try {
      await apiRequest(`/api/puasa-records/${record.id}`, {
        method: "PUT",
        body: {
          fast_type: formData.get("fast_type")?.toString() ?? "",
          completed: formData.has("completed"),
          sahur: formData.has("sahur"),
          iftar: formData.has("iftar"),
          notes: formData.get("notes")?.toString() ?? "",
        },
      });

      setSaveState({
        tone: "success",
        message: isEnglish
          ? "Fasting record was updated successfully."
          : "Catatan puasa berhasil diperbarui.",
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
              ? "Failed to update the fasting record."
              : "Gagal memperbarui catatan puasa.",
      });
    }
  }

  async function handleDelete() {
    setSaveState(null);
    setIsDeleting(true);

    try {
      await apiRequest(`/api/puasa-records/${record.id}`, {
        method: "DELETE",
      });
      notifyTrackerDataChanged();
      navigate("/puasa", { replace: true });
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : isEnglish
              ? "Failed to delete the fasting record."
              : "Gagal menghapus catatan puasa.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <MainLayout
      title={isEnglish ? "Fasting Detail" : "Detail Puasa"}
      description={
        isEnglish
          ? `Edit the fasting record for ${formatRecordDate(record.record_date, language)}.`
          : `Edit catatan puasa untuk ${formatRecordDate(record.record_date, language)}.`
      }
      actions={
        <Link
          to="/puasa"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t.common.backToHistory}
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            {isEnglish ? "Edit record" : "Edit catatan"}
          </h2>
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
                    ? "The fasting date stays locked so that day's contribution remains stable."
                    : "Tanggal puasa dikunci agar kontribusi hari itu tidak bergeser."
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Fasting type" : "Jenis puasa"}
              <input
                name="fast_type"
                defaultValue={record.fast_type}
                required
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="flex h-11 items-center gap-3 rounded-md border border-border px-3 text-sm font-medium">
                <input type="checkbox" name="completed" defaultChecked={record.completed} />
                {isEnglish ? "Completed" : "Selesai"}
              </label>
              <label className="flex h-11 items-center gap-3 rounded-md border border-border px-3 text-sm font-medium">
                <input type="checkbox" name="sahur" defaultChecked={record.sahur} />
                Sahur
              </label>
              <label className="flex h-11 items-center gap-3 rounded-md border border-border px-3 text-sm font-medium">
                <input type="checkbox" name="iftar" defaultChecked={record.iftar} />
                {isEnglish ? "Iftar" : "Berbuka"}
              </label>
            </div>
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
              <Save aria-hidden="true" />
              {t.common.saveChanges}
            </Button>
          </form>
          <div className="mt-4">
            <DeleteConfirmation
              title={
                isEnglish
                  ? "Delete this fasting record?"
                  : "Hapus catatan puasa ini?"
              }
              description={
                isEnglish
                  ? "Deleted fasting records cannot be restored."
                  : "Catatan puasa yang dihapus tidak bisa dikembalikan lagi."
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
              <dt className="text-muted-foreground">
                {isEnglish ? "Type" : "Jenis"}
              </dt>
              <dd className="font-medium text-foreground">{record.fast_type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {isEnglish ? "Status" : "Status"}
              </dt>
              <dd className="font-medium text-foreground">
                {record.completed
                  ? isEnglish
                    ? "Completed"
                    : "Selesai"
                  : isEnglish
                    ? "Not completed yet"
                    : "Belum selesai"}
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
