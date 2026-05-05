import { ArrowLeft, Save, WalletCards } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useNavigate, useRevalidator } from "react-router";

import { DeleteConfirmation } from "~/components/delete-confirmation";
import type { Route } from "./+types/keuangan-detail";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { DateField } from "~/components/ui/date-field";
import {
  SelectField,
  type SelectFieldOption,
} from "~/components/ui/select-field";
import {
  formatDateOnlyForDisplay,
  formatCurrencyForDisplay,
  normalizeDateInputValue,
} from "~/lib/form-defaults";
import { useLocale, useTranslations } from "~/lib/localization";
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

const transactionTypeOptions: SelectFieldOption[] = [
  {
    value: "expense",
    label: "Pengeluaran",
    description: "Arus kas keluar yang memengaruhi ringkasan bulan ini.",
  },
  {
    value: "income",
    label: "Pemasukan",
    description: "Arus kas masuk yang menambah saldo bulan ini.",
  },
];

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
        message: isEnglish
          ? "Finance transaction was updated successfully."
          : "Transaksi keuangan berhasil diperbarui.",
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
              ? "Failed to update the finance transaction."
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
            : isEnglish
              ? "Failed to delete the finance transaction."
              : "Gagal menghapus transaksi keuangan.",
      });
      setIsDeleting(false);
    }
  }

  return (
    <MainLayout
      title={isEnglish ? "Finance Detail" : "Detail Keuangan"}
      description={
        isEnglish
          ? "Edit a saved finance transaction."
          : "Edit transaksi keuangan yang sudah tersimpan."
      }
      actions={
        <Link
          to="/keuangan"
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
            <WalletCards className="size-5 text-amber-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              {isEnglish ? "Edit transaction" : "Edit transaksi"}
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {t.common.date}
                <DateField
                  name="transaction_date"
                  defaultValue={normalizeDateInputValue(record.transaction_date)}
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Type" : "Tipe"}
                <SelectField
                  name="transaction_type"
                  defaultValue={record.transaction_type}
                  options={getTransactionTypeOptions(language)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Category" : "Kategori"}
                <input
                  name="category"
                  defaultValue={record.category}
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Amount" : "Jumlah"}
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
              title={isEnglish ? "Delete this transaction?" : "Hapus transaksi ini?"}
              description={
                isEnglish
                  ? "Deleted transactions cannot be restored and the finance summary will adjust automatically."
                  : "Transaksi yang dihapus tidak bisa dikembalikan dan ringkasan keuangan akan menyesuaikan."
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
                {formatRecordDate(record.transaction_date, language)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {isEnglish ? "Category" : "Kategori"}
              </dt>
              <dd className="font-medium text-foreground">{record.category}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">
                {isEnglish ? "Amount" : "Jumlah"}
              </dt>
              <dd className="font-medium text-foreground">
                {record.transaction_type === "income" ? "+" : "-"}
                {formatCurrency(record.amount, language)}
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

function formatCurrency(value: string, language: "id" | "en") {
  return formatCurrencyForDisplay(value, language, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 2,
  });
}

function getTransactionTypeOptions(language: "id" | "en"): SelectFieldOption[] {
  if (language === "en") {
    return [
      {
        value: "expense",
        label: "Expense",
        description: "Outgoing cash flow that affects this month's summary.",
      },
      {
        value: "income",
        label: "Income",
        description: "Incoming cash flow that increases this month's balance.",
      },
    ];
  }

  return transactionTypeOptions;
}
