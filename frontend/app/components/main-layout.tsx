import { BookOpen, BookText } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { NavLink, useLocation } from "react-router";

import { Button } from "~/components/ui/button";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        aria-hidden="true"
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r border-border bg-sidebar text-sidebar-foreground shadow-lg transition-transform lg:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!isSidebarOpen}
      >
        <div className="flex h-full flex-col gap-5 px-4 py-4">
          <SidebarBrand
            control={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="shrink-0"
                onClick={() => setIsSidebarOpen((current) => !current)}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-controls="mobile-sidebar-navigation"
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? (
                  <BookText className="size-4" aria-hidden="true" />
                ) : (
                  <BookOpen className="size-4" aria-hidden="true" />
                )}
              </Button>
            }
          />
          <SidebarNav id="mobile-sidebar-navigation" />
        </div>
      </aside>
      <aside
        className={cn(
          "hidden border-border bg-sidebar text-sidebar-foreground lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:border-r lg:transition-[width] lg:duration-200",
          isDesktopSidebarOpen
            ? "lg:w-64"
            : "lg:w-16",
        )}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-4 lg:h-full lg:px-5 lg:py-6">
          <SidebarBrand
            hideBrand={!isDesktopSidebarOpen}
            control={
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="shrink-0"
                onClick={() => setIsDesktopSidebarOpen((current) => !current)}
                aria-label={isDesktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-expanded={isDesktopSidebarOpen}
              >
                {isDesktopSidebarOpen ? (
                  <BookText className="size-4" aria-hidden="true" />
                ) : (
                  <BookOpen className="size-4" aria-hidden="true" />
                )}
              </Button>
            }
          />
          {isDesktopSidebarOpen ? <SidebarNav /> : null}
        </div>
      </aside>
      <main className={cn(isDesktopSidebarOpen ? "lg:pl-64" : "lg:pl-16")}>
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                {!isSidebarOpen ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-sm"
                    className="shrink-0 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                    aria-label="Open sidebar"
                    aria-controls="mobile-sidebar-navigation"
                    aria-expanded={isSidebarOpen}
                  >
                    <BookOpen className="size-4" aria-hidden="true" />
                  </Button>
                ) : null}
                <h1 className="text-2xl font-semibold tracking-normal text-foreground">
                  {title}
                </h1>
              </div>
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

function SidebarBrand({
  control,
  hideBrand = false,
}: {
  control?: ReactNode;
  hideBrand?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      {!hideBrand ? (
        <div>
          <p className="text-sm font-semibold text-foreground">Codefalah</p>
          <p className="text-xs text-muted-foreground">Personal tracker</p>
        </div>
      ) : (
        <div aria-hidden="true" />
      )}
      {control ? <div>{control}</div> : null}
    </div>
  );
}

function SidebarNav({ id }: { id?: string }) {
  return (
    <nav id={id} className="flex flex-col gap-1 overflow-visible pb-0">
      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
            )
          }
        >
          <item.icon className="size-4" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
