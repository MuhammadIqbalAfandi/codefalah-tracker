import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { useTranslations } from "~/lib/localization";

const themeStorageKey = "codefalah-theme";

type ThemeMode = "light" | "dark";

export function ThemeToggle() {
  const t = useTranslations();
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "dark" : "light";
    setTheme(nextTheme);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme, isReady]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className="w-fit"
      suppressHydrationWarning
    >
      {isReady ? (
        theme === "dark" ? (
          <Moon aria-hidden="true" />
        ) : (
          <Sun aria-hidden="true" />
        )
      ) : (
        <Monitor aria-hidden="true" />
      )}
      {isReady
        ? theme === "dark"
          ? t.theme.darkMode
          : t.theme.lightMode
        : t.theme.theme}
    </Button>
  );
}
