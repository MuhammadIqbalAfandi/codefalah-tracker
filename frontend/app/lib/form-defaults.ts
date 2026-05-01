export function getTodayDateInputValue() {
  return formatLocalDateInputValue(new Date());
}

export function formatLocalDateInputValue(date: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter.format(date);
}
