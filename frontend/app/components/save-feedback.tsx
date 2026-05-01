type SaveFeedbackProps = {
  tone: "success" | "error";
  message: string;
};

export function SaveFeedback({ tone, message }: SaveFeedbackProps) {
  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-destructive/30 bg-destructive/10 text-destructive";

  return (
    <div
      className={`rounded-md border px-3 py-2 text-sm ${toneClasses}`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
