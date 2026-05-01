import type { ComponentType, ReactNode } from "react";

import { cn } from "~/lib/utils";

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "neutral" | "green" | "blue" | "amber" | "rose";
  footer?: ReactNode;
};

const toneClasses = {
  neutral: "bg-muted text-muted-foreground",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  blue: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  rose: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "neutral",
  footer,
}: SummaryCardProps) {
  return (
    <article className="rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-foreground">
            {value}
          </p>
        </div>
        <span className={cn("rounded-md p-2", toneClasses[tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </article>
  );
}
