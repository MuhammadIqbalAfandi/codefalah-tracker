import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
} from "react";

import { Button } from "~/components/ui/button";
import {
  APP_TIME_ZONE,
  formatDateOnlyForDisplay,
  normalizeDateInputValue,
  parseDateOnly,
} from "~/lib/form-defaults";
import {
  DEFAULT_APP_LANGUAGE,
  getIntlLocale,
  type AppLanguage,
} from "~/lib/locale-config";
import { useLocale, useTranslations } from "~/lib/localization";
import { cn } from "~/lib/utils";

type DateFieldProps = Omit<
  React.ComponentProps<"input">,
  "type" | "size" | "onChange"
> & {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  helperText?: string;
};

type CalendarCell = {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
};

const weekdayLabels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
const weekdayLabelsByLanguage = {
  id: weekdayLabels,
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
} as const;

export function DateField({
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  helperText,
  min,
  max,
  name,
  required,
  ...props
}: DateFieldProps) {
  const t = useTranslations();
  const { language } = useLocale();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const isControlled = value !== undefined;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    typeof defaultValue === "string" ? normalizeDateInputValue(defaultValue) : "",
  );
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getInitialMonthValue(
      typeof value === "string"
        ? value
        : typeof defaultValue === "string"
          ? defaultValue
          : undefined,
    ),
  );

  useEffect(() => {
    if (!isControlled && typeof defaultValue === "string") {
      setInternalValue(normalizeDateInputValue(defaultValue));
    }
  }, [defaultValue, isControlled]);

  const currentValue =
    typeof value === "string"
      ? normalizeDateInputValue(value)
      : typeof internalValue === "string"
        ? internalValue
        : "";

  useEffect(() => {
    if (!open) {
      return;
    }

    setVisibleMonth(getInitialMonthValue(currentValue || undefined));
  }, [currentValue, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const currentLabel = currentValue
    ? formatDateOnlyForDisplay(currentValue, {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }, language)
    : t.dateField.placeholder;
  const monthLabel = formatMonthLabel(visibleMonth, language);
  const calendarCells = useMemo(() => buildCalendarCells(visibleMonth), [visibleMonth]);
  const resolvedHelperText = helperText ?? t.dateField.helperText;
  const shouldShowInlineHelper = disabled && Boolean(resolvedHelperText);
  const weekdayNames = weekdayLabelsByLanguage[language];

  function commitValue(nextValue: string) {
    const normalized = normalizeDateInputValue(nextValue);

    if (!isControlled) {
      setInternalValue(normalized);
    }

    onChange?.({
      currentTarget: { value: normalized },
      target: { value: normalized },
    } as ChangeEvent<HTMLInputElement>);
    setOpen(false);
  }

  function moveMonth(offset: number) {
    const [year, month] = visibleMonth.split("-").map(Number);
    const next = new Date(Date.UTC(year, month - 1 + offset, 1));
    setVisibleMonth(formatMonthValue(next));
  }

  const minValue = typeof min === "string" ? normalizeDateInputValue(min) : undefined;
  const maxValue = typeof max === "string" ? normalizeDateInputValue(max) : undefined;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {name ? (
        <input
          id={inputId}
          type="hidden"
          name={name}
          value={currentValue}
          required={required}
        />
      ) : null}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${inputId}-calendar`}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-left text-sm shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          disabled && "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        <div className="rounded-md bg-muted/80 p-1.5 text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              !currentValue && "text-muted-foreground",
              disabled && "text-muted-foreground",
            )}
          >
            {currentLabel}
          </p>
        </div>
      </button>

      {shouldShowInlineHelper ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          {resolvedHelperText}
        </p>
      ) : null}

      {open ? (
        <div
          id={`${inputId}-calendar`}
          role="dialog"
          aria-label={t.dateField.pickerTitle}
          className="absolute left-0 z-30 mt-2 w-[18rem] max-w-full overflow-hidden rounded-[1.25rem] border border-border bg-popover shadow-xl"
        >
          <div className="border-b border-border/70 px-3.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => moveMonth(-1)}
                aria-label={language === "en" ? "Previous month" : "Bulan sebelumnya"}
              >
                <ChevronLeft className="size-4" aria-hidden="true" />
              </Button>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{monthLabel}</p>
                <p className="text-[11px] text-muted-foreground">
                  {t.dateField.pickerHint}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => moveMonth(1)}
                aria-label={language === "en" ? "Next month" : "Bulan berikutnya"}
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 p-3.5">
            <div className="grid grid-cols-7 gap-1">
              {weekdayNames.map((label) => (
                <span
                  key={label}
                  className="text-center text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell) => {
                const isSelected = cell.date === currentValue;
                const isDisabled =
                  (minValue !== undefined && cell.date < minValue) ||
                  (maxValue !== undefined && cell.date > maxValue);

                return (
                  <button
                    key={cell.date}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!isDisabled) {
                        commitValue(cell.date);
                      }
                    }}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg text-sm transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      cell.isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground/55",
                      !isDisabled && !isSelected && "hover:bg-muted",
                      isSelected &&
                        "bg-primary font-semibold text-primary-foreground hover:bg-primary/90",
                      isDisabled &&
                        "cursor-not-allowed opacity-40 hover:bg-transparent",
                    )}
                    aria-pressed={isSelected}
                    aria-label={formatDateOnlyForDisplay(cell.date, {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }, language)}
                  >
                    {cell.dayNumber}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-between gap-2 border-t border-border/70 pt-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  commitValue(formatTodayDate());
                }}
              >
                {t.common.today}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                {t.common.close}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getInitialMonthValue(value?: string) {
  const normalized = typeof value === "string" ? normalizeDateInputValue(value) : "";
  if (normalized.length === 10) {
    return normalized.slice(0, 7);
  }

  return formatMonthValue(new Date());
}

function formatMonthValue(value: Date) {
  return value.toISOString().slice(0, 7);
}

function formatMonthLabel(
  value: string,
  language: AppLanguage = DEFAULT_APP_LANGUAGE,
) {
  const parsed = parseDateOnly(`${value}-01`);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

function buildCalendarCells(monthValue: string) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstWeekday = (firstDay.getUTCDay() + 6) % 7;
  const cells: CalendarCell[] = [];

  for (let index = 0; index < 42; index += 1) {
    const dayOffset = index - firstWeekday;
    const date = new Date(Date.UTC(year, month - 1, 1 + dayOffset));
    const cellDate = date.toISOString().slice(0, 10);

    cells.push({
      date: cellDate,
      dayNumber: date.getUTCDate(),
      isCurrentMonth: dayOffset >= 0 && dayOffset < daysInMonth,
    });
  }

  return cells;
}

function formatTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
