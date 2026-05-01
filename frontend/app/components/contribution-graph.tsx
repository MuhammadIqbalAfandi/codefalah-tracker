import { cn } from "~/lib/utils";

type ContributionDay = {
  date: string;
  score: number;
};

type ContributionGraphProps = {
  days: ContributionDay[];
};

export function ContributionGraph({ days }: ContributionGraphProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Contribution
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aktivitas tracker dalam beberapa hari terakhir.
          </p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {days.length} hari
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(18px,1fr))] gap-1">
        {days.map((day) => (
          <span
            key={day.date}
            title={`${day.date}: ${day.score}`}
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
