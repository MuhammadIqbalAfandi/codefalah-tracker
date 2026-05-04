import { Save, WalletCards } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useLoaderData, useRevalidator } from "react-router";

import type { Route } from "./+types/keuangan";
import { EmptyState } from "~/components/empty-state";
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
  getTodayDateInputValue,
} from "~/lib/form-defaults";
import { useLocale } from "~/lib/localization";
import { notifyTrackerDataChanged } from "~/lib/tracker-sync";
import { apiRequest } from "~/services/api-client";

type FinanceTransaction = {
  id: number;
  transaction_date: string;
  transaction_type: "income" | "expense";
  category: string;
  amount: string;
  notes: string;
};

type LoaderData = {
  history: FinanceTransaction[];
  apiError?: string;
};

const historyLimit = 10;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Keuangan Tracker | Codefalah Tracker" },
    { name: "description", content: "Catatan transaksi keuangan." },
  ];
}

export async function loader(): Promise<LoaderData> {
  try {
    return {
      history: await apiRequest<FinanceTransaction[]>(
        `/api/finance-transactions?limit=${historyLimit}`,
      ),
    };
  } catch {
    return {
      history: [],
      apiError:
        "Riwayat keuangan belum tersedia dari backend. Data akan tampil di sini setelah backend siap.",
    };
  }
}

export default function KeuanganRoute() {
  const { language } = useLocale();
  const isEnglish = language === "en";
  const { history, apiError } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [transactionDate, setTransactionDate] = useState(getTodayDateInputValue());
  const [transactionType, setTransactionType] = useState("expense");
  const [saveState, setSaveState] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const localizedTransactionTypeOptions: SelectFieldOption[] = [
    {
      value: "expense",
      label: isEnglish ? "Expense" : "Pengeluaran",
      description: isEnglish
        ? "Use for spending, costs, and outgoing cash flow."
        : "Dipakai untuk belanja, biaya, dan arus kas keluar.",
    },
    {
      value: "income",
      label: isEnglish ? "Income" : "Pemasukan",
      description: isEnglish
        ? "Use for salary, bonus, or incoming cash flow."
        : "Dipakai untuk gaji, bonus, atau arus kas masuk.",
    },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    setSaveState(null);

    try {
      await apiRequest("/api/finance-transactions", {
        method: "POST",
        body: {
          transaction_date: formData.get("transaction_date")?.toString() ?? "",
          transaction_type:
            formData.get("transaction_type")?.toString() ?? "expense",
          category: formData.get("category")?.toString() ?? "",
          amount: formData.get("amount")?.toString() ?? "",
          notes: formData.get("notes")?.toString() ?? "",
        },
      });

      form.reset();
      setTransactionDate(getTodayDateInputValue());
      setTransactionType("expense");
      setSaveState({
        tone: "success",
        message: isEnglish
          ? "Finance transaction saved successfully."
          : "Transaksi keuangan berhasil disimpan.",
      });
      notifyTrackerDataChanged();
      revalidator.revalidate();
    } catch (error) {
      console.error("Failed to save finance transaction", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : isEnglish
              ? "Failed to save finance transaction."
              : "Gagal menyimpan transaksi keuangan.",
      });
    }
  }

  return (
    <MainLayout
      title="Keuangan Tracker"
      description={
        isEnglish
          ? "Track income, expense, category, and amount."
          : "Catatan pemasukan, pengeluaran, kategori, dan nominal."
      }
    >
      {apiError ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {isEnglish
            ? "Finance history is not available from the backend yet. Data will appear here after the backend is ready."
            : apiError}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <WalletCards className="size-5 text-amber-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              {isEnglish ? "Transaction" : "Transaksi"}
            </h2>
          </div>
          <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
            {saveState ? (
              <SaveFeedback tone={saveState.tone} message={saveState.message} />
            ) : null}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Date" : "Tanggal"}
                <DateField
                  name="transaction_date"
                  required
                  value={transactionDate}
                  onChange={(event) =>
                    setTransactionDate(event.currentTarget.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Type" : "Tipe"}
                <SelectField
                  name="transaction_type"
                  value={transactionType}
                  options={localizedTransactionTypeOptions}
                  onValueChange={setTransactionType}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                {isEnglish ? "Category" : "Kategori"}
                <input
                  name="category"
                  placeholder={isEnglish ? "Meals" : "Makan"}
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
                  inputMode="decimal"
                  placeholder="35000"
                  required
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-foreground">
              {isEnglish ? "Notes" : "Catatan"}
              <textarea
                name="notes"
                rows={4}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </label>
            <Button type="submit" className="w-fit">
              <Save aria-hidden="true" />
              {isEnglish ? "Save" : "Simpan"}
            </Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">
            {isEnglish ? "History" : "Riwayat"}
          </h2>
          <div className="mt-4">
            {history.length === 0 ? (
              <EmptyState
                icon={WalletCards}
                title={isEnglish ? "No transactions yet" : "Belum ada transaksi"}
                description={
                  isEnglish
                    ? "Saved finance transactions will appear in this table."
                    : "Transaksi keuangan yang berhasil tersimpan akan muncul di tabel ini."
                }
              />
            ) : (
              <div className="overflow-hidden rounded-md border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">{isEnglish ? "Date" : "Tanggal"}</th>
                      <th className="px-3 py-2 font-medium">{isEnglish ? "Category" : "Kategori"}</th>
                      <th className="px-3 py-2 font-medium">{isEnglish ? "Amount" : "Jumlah"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-3 py-2">
                          <Link
                            to={`/keuangan/${item.id}`}
                            className="font-medium text-foreground underline-offset-4 hover:underline"
                          >
                            {formatRecordDate(item.transaction_date, language)}
                          </Link>
                        </td>
                        <td className="px-3 py-2">{item.category}</td>
                        <td className="px-3 py-2">
                          {item.transaction_type === "income" ? "+" : "-"}
                          {formatCurrency(item.amount, language)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
    maximumFractionDigits: 2,
  });
}
