import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "~/lib/utils";

type ContributionDay = {
  date: string;
  score: number;
};

type ContributionGraphProps = {
  days: ContributionDay[];
  startDate?: string;
  endDate?: string;
  title?: string;
  description?: string;
  compact?: boolean;
};

const contributionLegend = [
  {
    label: "Kosong",
    colorClass: "bg-muted",
  },
  {
    label: "Ringan",
    colorClass: "bg-emerald-200",
  },
  {
    label: "Sedang",
    colorClass: "bg-sky-300",
  },
  {
    label: "Tinggi",
    colorClass: "bg-amber-300",
  },
] as const;

export function ContributionGraph({
  days,
  startDate,
  endDate,
  title = "Pola Aktivitas Harian",
  description,
  compact = false,
}: ContributionGraphProps) {
  const calendarDays = buildCalendarDays(days, startDate, endDate);
  const monthGroups = groupCalendarDaysByMonth(calendarDays);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollIndicators, setScrollIndicators] = useState({
    canScroll: false,
    canScrollRight: false,
  });
  const activeDays = calendarDays.filter((day) => day.score > 0).length;
  const inactiveDays = calendarDays.length - activeDays;
  const rangeLabel =
    startDate && endDate
      ? `${startDate} sampai ${formatInclusiveEndDate(endDate)}`
      : "rentang contribution terbaru";
  const resolvedDescription =
    description ??
    `Warna kotak menunjukkan intensitas aktivitas tracker per hari pada ${rangeLabel}.`;

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) {
      return;
    }

    const updateIndicators = () => {
      const maxScrollLeft = element.scrollWidth - element.clientWidth;
      const canScroll = maxScrollLeft > 4;
      const canScrollRight = element.scrollLeft < maxScrollLeft - 4;

      setScrollIndicators({
        canScroll,
        canScrollRight,
      });
    };

    updateIndicators();

    element.addEventListener("scroll", updateIndicators, { passive: true });
    window.addEventListener("resize", updateIndicators);

    return () => {
      element.removeEventListener("scroll", updateIndicators);
      window.removeEventListener("resize", updateIndicators);
    };
  }, [monthGroups.length]);

  return (
    <div
      className={cn(
        "min-w-0 max-w-full rounded-[1.5rem] border border-border bg-card text-card-foreground shadow-sm",
        compact ? "p-4" : "p-4 sm:p-5",
      )}
    >
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className={cn("font-semibold text-foreground", compact ? "text-sm" : "text-base")}>
            {title}
          </h2>
          <p className={cn("mt-1 text-muted-foreground", compact ? "text-xs leading-5" : "text-sm")}>
            {resolvedDescription}
          </p>
        </div>
        <div
          className={cn(
            "grid shrink-0 gap-1 text-muted-foreground sm:text-right",
            compact ? "text-[11px]" : "text-xs font-medium",
          )}
        >
          <span>{calendarDays.length} hari dipantau</span>
          <span>{activeDays} hari aktif</span>
          <span>{inactiveDays} hari kosong</span>
        </div>
      </div>

      <div className={cn("mt-4 flex flex-wrap gap-2 text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
        {contributionLegend.map((item) => (
          <span
            key={item.label}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1",
              compact && "px-2 py-1",
            )}
          >
            <span
              className={cn(
                "rounded-[3px] border border-border",
                compact ? "size-2" : "size-2.5",
                item.colorClass,
              )}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span>{compact ? "Geser untuk membaca bulan lain." : "Target tampilan ringkas: fokus per bulan agar mudah discan."}</span>
        <span className="inline-flex items-center gap-2 font-medium text-foreground/80">
          <span>Geser</span>
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="relative mt-3">
        {scrollIndicators.canScrollRight ? (
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-16 bg-gradient-to-l from-card via-card/90 to-transparent sm:block"
            aria-hidden="true"
          />
        ) : null}
        {scrollIndicators.canScrollRight ? (
          <div className="pointer-events-none absolute right-2 top-3 z-10 hidden rounded-full border border-border/70 bg-card/95 p-1 text-muted-foreground shadow-sm sm:block">
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </div>
        ) : null}

        <div
          ref={scrollContainerRef}
          className={cn(
            "max-w-full overflow-x-auto pb-2",
            scrollIndicators.canScroll && "scroll-smooth snap-x snap-mandatory",
          )}
        >
          <div className={cn("flex w-max min-w-max pr-4", compact ? "gap-2.5" : "gap-3")}>
            {monthGroups.map((month) => (
              <section
                key={month.key}
                className={cn(
                  "shrink-0 snap-start rounded-2xl border border-border/70 bg-muted/20",
                  compact
                    ? "w-[7.6rem] p-2.5 sm:w-[8rem]"
                    : "w-[8.75rem] p-3 sm:w-[9rem] lg:w-[9.25rem]",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={cn("font-medium text-foreground", compact ? "text-xs" : "text-sm")}>
                      {month.label}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">{month.days.length} hari</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {month.days.filter((day) => day.score > 0).length} aktif
                  </span>
                </div>

                <div className={cn("mt-3 grid grid-cols-7", compact ? "gap-0.5" : "gap-1")}>
                  {month.days.map((day) => (
                    <span
                      key={day.date}
                      title={`${day.date}: skor aktivitas ${day.score}`}
                      aria-label={`${day.date}: skor aktivitas ${day.score}`}
                      className={cn(
                        "rounded-[3px] border border-border",
                        compact ? "size-2.5" : "size-2.5 sm:size-3",
                        day.score === 0 && "bg-muted",
                        day.score > 0 && day.score < 3 && "bg-emerald-200",
                        day.score >= 3 && day.score < 6 && "bg-sky-300",
                        day.score >= 6 && "bg-amber-300",
                      )}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type CalendarDay = ContributionDay & {
  monthKey: string;
};

function buildCalendarDays(
  days: ContributionDay[],
  startDate?: string,
  endDate?: string,
) {
  if (!startDate || !endDate) {
    return days.map((day) => ({
      ...day,
      monthKey: day.date.slice(0, 7),
    }));
  }

  const scoresByDate = new Map(days.map((day) => [day.date, day.score]));
  const start = parseDateOnly(startDate);
  const exclusiveEnd = parseDateOnly(endDate);

  if (!start || !exclusiveEnd || start >= exclusiveEnd) {
    return days.map((day) => ({
      ...day,
      monthKey: day.date.slice(0, 7),
    }));
  }

  const calendarDays: CalendarDay[] = [];
  const cursor = new Date(start);

  while (cursor < exclusiveEnd) {
    const date = formatDateOnly(cursor);
    calendarDays.push({
      date,
      score: scoresByDate.get(date) ?? 0,
      monthKey: date.slice(0, 7),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return calendarDays;
}

function groupCalendarDaysByMonth(days: CalendarDay[]) {
  const groups = new Map<
    string,
    {
      key: string;
      label: string;
      days: CalendarDay[];
    }
  >();

  for (const day of days) {
    const group = groups.get(day.monthKey);
    if (group) {
      group.days.push(day);
      continue;
    }

    groups.set(day.monthKey, {
      key: day.monthKey,
      label: formatMonthLabel(day.date),
      days: [day],
    });
  }

  return Array.from(groups.values());
}

function formatMonthLabel(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function formatInclusiveEndDate(value: string) {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return value;
  }

  parsed.setUTCDate(parsed.getUTCDate() - 1);
  return formatDateOnly(parsed);
}

function parseDateOnly(value: string) {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function formatDateOnly(value: Date) {
  return value.toISOString().slice(0, 10);
}
