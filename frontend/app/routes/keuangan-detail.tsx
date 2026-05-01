import { ArrowLeft, Save, WalletCards } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import { DeleteConfirmation } from "~/components/delete-confirmation";
import type { Route } from "./+types/keuangan-detail";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { ApiError, apiRequest } from "~/services/api-client";

type FinanceTransaction = {
  id: number;
  transaction_date: string;
  transaction_type: "income" | "expense";
  category: string;
  amount: string;
  notes: string;
};

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detail Keuangan | Codefalah Tracker" },
    { name: "description", content: "Detail dan edit transaksi keuangan." },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  try {
    return {
      record: await apiRequest<FinanceTransaction>(
        `/api/finance-transactions/${params.id}`,
      ),
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }

    throw error;
  }
}

export default function KeuanganDetailRoute() {
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
      await apiRequest(`/api/finance-transactions/${record.id}`, {
        method: "PUT",
        body: {
          transaction_date: formData.get("transaction_date")?.toString() ?? "",
          transaction_type:
            formData.get("transaction_type")?.toString() ?? "expense",
          category: formData.get("category")?.toString() ?? "",
          amount: formData.get("amount")?.toString() ?? "",
          notes: formData.get("notes")?.toString() ?? "",
        },
      });

      setSaveState({
        tone: "success",
        message: "Transaksi keuangan berhasil diperbarui.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui transaksi keuangan.",
      });
    }
  }

  async function handleDelete() {
    setSaveState(null);
    setIsDeleting(true);

    try {
      await apiRequest(`/api/finance-transactions/${record.id}`, {
        method: "DELETE",
      });
      notifyTrackerDataChanged();
      navigate("/keuangan", { replace: true });
    } catch (error) {
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Gagal menghapus transaksi keuangan.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <MainLayout
      title="Detail Keuangan"
      description="Edit transaksi keuangan yang sudah tersimpan."
      actions={
        <Link
          to="/keuangan"
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
            <WalletCards className="size-5 text-amber-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Edit transaksi
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
                  name="transaction_date"
                  defaultValue={toDateInputValue(record.transaction_date)}
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Tipe
                <select
                  name="transaction_type"
                  defaultValue={record.transaction_type}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="expense">Pengeluaran</option>
                  <option value="income">Pemasukan</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Kategori
                <input
                  name="category"
                  defaultValue={record.category}
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Jumlah
                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  defaultValue={record.amount}
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
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
              title="Hapus transaksi ini?"
              description="Transaksi yang dihapus tidak bisa dikembalikan dan ringkasan keuangan akan menyesuaikan."
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
                {formatRecordDate(record.transaction_date)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Kategori</dt>
              <dd className="font-medium text-foreground">{record.category}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Jumlah</dt>
              <dd className="font-medium text-foreground">
                {record.transaction_type === "income" ? "+" : "-"}
                {formatCurrency(record.amount)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </MainLayout>
  );
}

function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

function formatRecordDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(value: string) {
  const amount = Number.parseFloat(value);
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}
