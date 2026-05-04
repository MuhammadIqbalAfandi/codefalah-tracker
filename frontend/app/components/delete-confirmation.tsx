import { AlertTriangle, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import { useTranslations } from "~/lib/localization";

type DeleteConfirmationProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => Promise<void> | void;
};

export function DeleteConfirmation({
  title,
  description,
  confirmLabel,
  cancelLabel,
  isPending = false,
  onConfirm,
}: DeleteConfirmationProps) {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const resolvedConfirmLabel = confirmLabel ?? t.common.delete;
  const resolvedCancelLabel = cancelLabel ?? t.common.cancel;

  async function handleConfirm() {
    await onConfirm();
  }

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="w-fit"
      >
        <Trash2 aria-hidden="true" />
        {t.common.delete}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 size-4 text-destructive"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isPending}
            >
              <Trash2 aria-hidden="true" />
              {isPending ? t.common.deleting : resolvedConfirmLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              {resolvedCancelLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
