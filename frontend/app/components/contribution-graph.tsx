import { cn } from "~/lib/utils";

type ContributionDay = {
  date: string;
  score: number;
};

type ContributionGraphProps = {
  days: ContributionDay[];
  startDate?: string;
  endDate?: string;
};

const contributionLegend = [
  {
    label: "Tidak ada aktivitas",
    colorClass: "bg-muted",
  },
  {
    label: "Aktivitas ringan",
    colorClass: "bg-emerald-200",
  },
  {
    label: "Aktivitas sedang",
    colorClass: "bg-sky-300",
  },
  {
    label: "Aktivitas tinggi",
    colorClass: "bg-amber-300",
  },
] as const;

export function ContributionGraph({
  days,
  startDate,
  endDate,
}: ContributionGraphProps) {
  const activeDays = days.filter((day) => day.score > 0).length;
  const inactiveDays = days.length - activeDays;
  const rangeLabel =
    startDate && endDate
      ? `${startDate} sampai ${endDate}`
      : "Rentang aktivitas terbaru";

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Pola Aktivitas Harian
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Warna kotak menunjukkan intensitas aktivitas tracker per hari dalam
            rentang {rangeLabel}.
          </p>
        </div>
        <div className="grid gap-1 text-xs font-medium text-muted-foreground sm:text-right">
          <span>{days.length} hari dipantau</span>
          <span>{activeDays} hari aktif</span>
          <span>{inactiveDays} hari tanpa aktivitas</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        {contributionLegend.map((item) => (
          <span
            key={item.label}
            className="inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1"
          >
            <span
              className={cn(
                "size-3 rounded-[3px] border border-border",
                item.colorClass,
              )}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(18px,1fr))] gap-1">
        {days.map((day) => (
          <span
            key={day.date}
            title={`${day.date}: skor aktivitas ${day.score}`}
            aria-label={`${day.date}: skor aktivitas ${day.score}`}
            className={cn(
              "aspect-square rounded-[3px] border border-border",
              day.score === 0 && "bg-muted",
              day.score > 0 && day.score < 3 && "bg-emerald-200",
              day.score >= 3 && day.score < 6 && "bg-sky-300",
              day.score >= 6 && "bg-amber-300",
            )}
          />
        ))}
      </div>
    </div>
  );
}
