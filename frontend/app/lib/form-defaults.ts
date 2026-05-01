export function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}
