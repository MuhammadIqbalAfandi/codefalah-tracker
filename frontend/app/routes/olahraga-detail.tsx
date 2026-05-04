import { ArrowLeft, Dumbbell, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import { DeleteConfirmation } from "~/components/delete-confirmation";
import type { Route } from "./+types/olahraga-detail";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { DateField } from "~/components/ui/date-field";
import {
  formatDateOnlyForDisplay,
  normalizeDateInputValue,
} from "~/lib/form-defaults";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { ApiError, apiRequest } from "~/services/api-client";

type SportRecord = {
  id: number;
  record_date: string;
  sport_type: string;
  duration_minutes: number;
  completed: boolean;
  notes: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detail Olahraga | Codefalah Tracker" },
    { name: "description", content: "Detail dan edit catatan olahraga." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return {
      record: await apiRequest<SportRecord>(`/api/sport-records/${params.id}`),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }
}

export default function OlahragaDetailRoute() {
  const { record } = useLoaderData<typeof loader>();
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
      await apiRequest(`/api/sport-records/${record.id}`, {
        method: "PUT",
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

      setSaveState({
        tone: "success",
        message: "Catatan olahraga berhasil diperbarui.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal memperbarui catatan olahraga.",
      });
    }
  }

  async function handleDelete() {
    setSaveState(null);
    setIsDeleting(true);

    try {
      await apiRequest(`/api/sport-records/${record.id}`, {
        method: "DELETE",
      });
      notifyTrackerDataChanged();
      navigate("/olahraga", { replace: true });
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal menghapus catatan olahraga.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <MainLayout
      title="Detail Olahraga"
      description="Edit catatan olahraga yang sudah tersimpan."
      actions={
        <Link
          to="/olahraga"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke riwayat
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-5 text-rose-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Edit catatan
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Tanggal
                <DateField
                  name="record_date"
                  defaultValue={normalizeDateInputValue(record.record_date)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Jenis olahraga
                <input
                  name="sport_type"
                  defaultValue={record.sport_type}
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
                  defaultValue={record.duration_minutes}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="flex items-end gap-3 text-sm font-medium text-foreground">
                <span className="flex h-9 items-center gap-3 rounded-md border border-border px-3">
                  <input type="checkbox" name="completed" defaultChecked={record.completed} />
                  Selesai
                </span>
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Catatan
              <textarea
                name="notes"
                rows={4}
                defaultValue={record.notes}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              Simpan perubahan
            </Button>
          </form>
          <div className="mt-4">
            <DeleteConfirmation
              title="Hapus catatan olahraga ini?"
              description="Catatan olahraga yang dihapus tidak bisa dikembalikan lagi."
              isPending={isDeleting}
              onConfirm={handleDelete}
            />
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Ringkasan</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Tanggal</dt>
              <dd className="font-medium text-foreground">
                {formatRecordDate(record.record_date)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Jenis</dt>
              <dd className="font-medium text-foreground">{record.sport_type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Durasi</dt>
              <dd className="font-medium text-foreground">
                {record.duration_minutes} menit
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </MainLayout>
  );
}

function formatRecordDate(value: string) {
  return formatDateOnlyForDisplay(value);
}
