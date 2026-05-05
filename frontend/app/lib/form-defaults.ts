import {
  DEFAULT_APP_LANGUAGE,
  getDocumentLanguage,
  getIntlLocale,
  type AppLanguage,
} from "~/lib/locale-config";
import { APP_TIME_ZONE } from "~/lib/env";

export { APP_TIME_ZONE } from "~/lib/env";

export function getTodayDateInputValue(now = new Date()) {
  return formatLocalDateInputValue(now);
}

export function formatLocalDateInputValue(date: Date, timeZone = APP_TIME_ZONE) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}

export function normalizeDateInputValue(value: string) {
  return value.trim().slice(0, 10);
}

export function parseDateOnly(value: string) {
  const normalized = normalizeDateInputValue(value);
  const parsed = new Date(`${normalized}T00:00:00Z`);

  if (normalized.length !== 10 || Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

export function formatDateOnlyForDisplay(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
  language: AppLanguage = getDocumentLanguage(),
) {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), {
    ...options,
    timeZone: APP_TIME_ZONE,
  }).format(parsed);
}

export function formatCurrencyForDisplay(
  value: string | number,
  language: AppLanguage = getDocumentLanguage(),
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  },
) {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);

  return new Intl.NumberFormat(getIntlLocale(language), options).format(
    Number.isFinite(parsed) ? parsed : 0,
  );
}

export function formatUtcMonthYearForDisplay(
  value: string,
  language: AppLanguage = getDocumentLanguage(),
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  },
) {
  const parsed = parseDateOnly(value);
  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat(getIntlLocale(language), {
    ...options,
    timeZone: "UTC",
  }).format(parsed);
}
