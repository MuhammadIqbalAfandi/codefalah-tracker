import type { ComponentType } from "react";
import { Inbox } from "lucide-react";

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
      <Icon className="size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="mt-3 text-sm font-semibold text-foreground">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
