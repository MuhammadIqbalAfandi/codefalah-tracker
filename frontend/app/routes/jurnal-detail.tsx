import { ArrowLeft, BookOpenText, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import { DeleteConfirmation } from "~/components/delete-confirmation";
import type { Route } from "./+types/jurnal-detail";
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

type JournalEntry = {
  id: number;
  entry_date: string;
  title: string;
  content: string;
  mood: string;
  tags: string;
  is_private: boolean;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detail Jurnal | Codefalah Tracker" },
    { name: "description", content: "Detail dan edit jurnal harian." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return {
      record: await apiRequest<JournalEntry>(`/api/journal-entries/${params.id}`),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }
}

export default function JurnalDetailRoute() {
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
      await apiRequest(`/api/journal-entries/${record.id}`, {
        method: "PUT",
        body: {
          entry_date: formData.get("entry_date")?.toString() ?? "",
          title: formData.get("title")?.toString() ?? "",
          content: formData.get("content")?.toString() ?? "",
          mood: formData.get("mood")?.toString() ?? "",
          tags: formData.get("tags")?.toString() ?? "",
          is_private: formData.has("is_private"),
        },
      });

      setSaveState({
        tone: "success",
        message: "Jurnal berhasil diperbarui.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      setSaveState({
        tone: "error",
        message: error instanceof Error ? error.message : "Gagal memperbarui jurnal.",
      });
    }
  }

  async function handleDelete() {
    setSaveState(null);
    setIsDeleting(true);

    try {
      await apiRequest(`/api/journal-entries/${record.id}`, {
        method: "DELETE",
      });
      notifyTrackerDataChanged();
      navigate("/jurnal", { replace: true });
    } catch (error) {
      setSaveState({
        tone: "error",
        message: error instanceof Error ? error.message : "Gagal menghapus jurnal.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <MainLayout
      title="Detail Jurnal"
      description="Edit entri jurnal yang sudah tersimpan."
      actions={
        <Link
          to="/jurnal"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke timeline
        </Link>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_320px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpenText className="size-5 text-muted-foreground" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Edit jurnal
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
                  name="entry_date"
                  defaultValue={normalizeDateInputValue(record.entry_date)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Mood
                <input
                  name="mood"
                  defaultValue={record.mood}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Judul
              <input
                name="title"
                defaultValue={record.title}
                required
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Cerita
              <textarea
                name="content"
                rows={8}
                defaultValue={record.content}
                required
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              Tag
              <input
                name="tags"
                defaultValue={record.tags}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              />
            </label>
            <label className="flex h-9 items-center gap-3 text-sm font-medium text-foreground">
              <input
                type="checkbox"
                name="is_private"
                defaultChecked={record.is_private}
              />
              Private
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              Simpan perubahan
            </Button>
          </form>
          <div className="mt-4">
            <DeleteConfirmation
              title="Hapus jurnal ini?"
              description="Entri jurnal yang dihapus tidak bisa dikembalikan lagi."
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
                {formatRecordDate(record.entry_date)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Judul</dt>
              <dd className="font-medium text-foreground">{record.title}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Privasi</dt>
              <dd className="font-medium text-foreground">
                {record.is_private ? "Private" : "Publik"}
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
