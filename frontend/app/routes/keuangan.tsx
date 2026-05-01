import { useState, type FormEvent } from "react";
import { Save, WalletCards } from "lucide-react";

import type { Route } from "./+types/keuangan";
import { MainLayout } from "~/components/main-layout";
import { SaveFeedback } from "~/components/save-feedback";
import { Button } from "~/components/ui/button";
import { getTodayDateInputValue } from "~/lib/form-defaults";
import { apiRequest } from "~/services/api-client";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Keuangan Tracker | Codefalah Tracker" },
    { name: "description", content: "Catatan transaksi keuangan." },
  ];
}

const transactions = [
  { date: "2026-05-01", category: "Makan", type: "expense", amount: "35000" },
  { date: "2026-05-01", category: "Gaji", type: "income", amount: "5000000" },
  { date: "2026-04-30", category: "Transportasi", type: "expense", amount: "18000" },
];

export default function KeuanganRoute() {
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
      form.transaction_date.value = getTodayDateInputValue();
      form.transaction_type.value = "expense";
      setSaveState({
        tone: "success",
        message: "Transaksi keuangan berhasil disimpan.",
      });
    } catch (error) {
      console.error("Failed to save finance transaction", error);
      setSaveState({
        tone: "error",
        message:
          error instanceof Error ? error.message : "Gagal menyimpan transaksi keuangan.",
      });
    }
  }

  return (
    <MainLayout
      title="Keuangan Tracker"
      description="Catatan pemasukan, pengeluaran, kategori, dan nominal."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <WalletCards className="size-5 text-amber-600" aria-hidden="true" />
            <h2 className="text-base font-semibold text-foreground">
              Transaksi
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
                  required
                  defaultValue={getTodayDateInputValue()}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-foreground">
                Tipe
                <select
                  name="transaction_type"
                  defaultValue="expense"
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
                  placeholder="Makan"
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
                  inputMode="decimal"
                  placeholder="35000"
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
          <div className="mt-4 overflow-hidden rounded-md border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Tanggal</th>
                  <th className="px-3 py-2 font-medium">Kategori</th>
                  <th className="px-3 py-2 font-medium">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item) => (
                  <tr
                    key={`${item.date}-${item.category}-${item.amount}`}
                    className="border-t border-border"
                  >
                    <td className="px-3 py-2">{item.date}</td>
                    <td className="px-3 py-2">{item.category}</td>
                    <td className="px-3 py-2">
                      {item.type === "income" ? "+" : "-"}Rp {item.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
