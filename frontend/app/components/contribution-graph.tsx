import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  type ContributionIntensityLevel,
  getContributionGuide,
  getContributionLevel,
  type ModuleKey,
} from "~/lib/dashboard-contribution";
import { formatUtcMonthYearForDisplay } from "~/lib/form-defaults";
import { useLocale } from "~/lib/localization";
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
  module?: ModuleKey;
  initialMonthKey?: string;
};

export function ContributionGraph({
  days,
  startDate,
  endDate,
  title,
  description,
  compact = false,
  module,
  initialMonthKey,
}: ContributionGraphProps) {
  const { language } = useLocale();
  const guide = module ? getContributionGuide(module, language) : null;
  const describeScore = guide?.scoreDescription;
  const calendarDays = buildCalendarDays(days, startDate, endDate);
  const monthGroups = groupCalendarDaysByMonth(calendarDays, language);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollIndicators, setScrollIndicators] = useState({
    canScroll: false,
    canScrollRight: false,
  });
  const activeDays = calendarDays.filter((day) => day.score > 0).length;
  const inactiveDays = calendarDays.length - activeDays;
  const rangeLabel =
    startDate && endDate
      ? language === "en"
        ? `${startDate} to ${formatInclusiveEndDate(endDate)}`
        : `${startDate} sampai ${formatInclusiveEndDate(endDate)}`
      : language === "en"
        ? "the latest contribution range"
        : "rentang contribution terbaru";
  const resolvedTitle =
    title ?? (language === "en" ? "Daily activity pattern" : "Pola aktivitas harian");
  const resolvedDescription =
    description ??
    (language === "en"
      ? `Tile colors show the daily tracker activity intensity within ${rangeLabel}.`
      : `Warna kotak menunjukkan intensitas aktivitas tracker per hari pada ${rangeLabel}.`);

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

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element || monthGroups.length === 0) {
      return;
    }

    const targetMonthKey =
      initialMonthKey && monthGroups.some((month) => month.key === initialMonthKey)
        ? initialMonthKey
        : null;

    if (!targetMonthKey) {
      return;
    }

    const targetElement = element.querySelector<HTMLElement>(
      `[data-month-key="${targetMonthKey}"]`,
    );

    if (!targetElement) {
      return;
    }

    const nextScrollLeft = Math.max(
      targetElement.offsetLeft - 12,
      0,
    );
    element.scrollTo({
      left: nextScrollLeft,
      behavior: "smooth",
    });
  }, [initialMonthKey, monthGroups]);

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
            {resolvedTitle}
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
          <span>
            {calendarDays.length} {language === "en" ? "tracked days" : "hari dipantau"}
          </span>
          <span>
            {activeDays} {language === "en" ? "active days" : "hari aktif"}
          </span>
          <span>
            {inactiveDays} {language === "en" ? "empty days" : "hari kosong"}
          </span>
        </div>
      </div>

      <div className={cn("mt-4 flex flex-wrap gap-2 text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
        {(guide?.intensityLevels ?? defaultContributionLegend).map((item) => (
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

      {guide ? (
        <p className={cn("mt-3 text-muted-foreground", compact ? "text-[11px] leading-5" : "text-xs leading-5")}>
          {guide.summary}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span>
          {compact
            ? language === "en"
              ? "Scroll to read the other months."
              : "Geser untuk membaca bulan lain."
            : language === "en"
              ? "Compact view keeps the focus per month so it is easier to scan."
              : "Target tampilan ringkas: fokus per bulan agar mudah discan."}
        </span>
        <span className="inline-flex items-center gap-2 font-medium text-foreground/80">
          <span>{language === "en" ? "Scroll" : "Geser"}</span>
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
                data-month-key={month.key}
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
                    <p className="text-[11px] text-muted-foreground">
                      {month.days.length} {language === "en" ? "days" : "hari"}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {month.days.filter((day) => day.score > 0).length}{" "}
                    {language === "en" ? "active" : "aktif"}
                  </span>
                </div>

                <div className={cn("mt-3 grid grid-cols-7", compact ? "gap-0.5" : "gap-1")}>
                  {month.days.map((day) => {
                    const level = module
                      ? getContributionLevel(module, day.score, language)
                      : getDefaultContributionLevel(day.score);
                    const scoreLabel = describeScore
                      ? describeScore(day.score)
                      : language === "en"
                        ? `activity score ${day.score}`
                        : `skor aktivitas ${day.score}`;

                    return (
                    <span
                      key={day.date}
                      title={`${day.date}: ${scoreLabel} (${level.label})`}
                      aria-label={`${day.date}: ${scoreLabel} (${level.label})`}
                      className={cn(
                        "rounded-[3px] border border-border",
                        compact ? "size-2.5" : "size-2.5 sm:size-3",
                        level.colorClass,
                      )}
                    />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultContributionLegend: ContributionIntensityLevel[] = [
  {
    label: "Empty",
    description: "No activity was recorded on that day.",
    colorClass: "bg-muted",
    minScore: 0,
    maxScore: 0,
  },
  {
    label: "Light",
    description: "A small amount of activity was recorded.",
    colorClass: "bg-emerald-200",
    minScore: 1,
    maxScore: 2,
  },
  {
    label: "Medium",
    description: "That day already has a healthy amount of activity.",
    colorClass: "bg-sky-300",
    minScore: 3,
    maxScore: 5,
  },
  {
    label: "High",
    description: "That day was very dense with activity.",
    colorClass: "bg-amber-300",
    minScore: 6,
  },
] as const;

function getDefaultContributionLevel(score: number) {
  return (
    defaultContributionLegend.find((level) => {
      if (score < level.minScore) {
        return false;
      }
      if (level.maxScore === undefined) {
        return true;
      }
      return score <= level.maxScore;
    }) ?? defaultContributionLegend[0]
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

function groupCalendarDaysByMonth(days: CalendarDay[], language = "id") {
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
      label: formatMonthLabel(day.date, language),
      days: [day],
    });
  }

  return Array.from(groups.values());
}

function formatMonthLabel(value: string, language = "id") {
  return formatUtcMonthYearForDisplay(value, language === "en" ? "en" : "id", {
    month: "short",
    year: "numeric",
  });
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
