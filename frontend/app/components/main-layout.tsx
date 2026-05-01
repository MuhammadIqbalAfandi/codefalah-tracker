import type { ReactNode } from "react";
import { NavLink } from "react-router";

import { ThemeToggle } from "~/components/theme-toggle";
import { navigationItems } from "~/lib/navigation";
import { cn } from "~/lib/utils";

type MainLayoutProps = {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function MainLayout({
  title,
  description,
  actions,
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <aside className="border-border bg-sidebar text-sidebar-foreground lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:border-r">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 lg:h-full lg:px-5 lg:py-6">
          <div>
            <p className="text-sm font-semibold text-foreground">Codefalah</p>
            <p className="text-xs text-muted-foreground">Personal tracker</p>
          </div>
          <nav className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )
                }
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                {title}
              </h1>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <ThemeToggle />
              {actions}
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
