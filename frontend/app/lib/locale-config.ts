export type AppLanguage = "id" | "en";

export const DEFAULT_APP_LANGUAGE: AppLanguage = "id";
export const languageStorageKey = "codefalah-language";

export function isAppLanguage(value: string | null | undefined): value is AppLanguage {
  return value === "id" || value === "en";
}

export function getIntlLocale(language: AppLanguage) {
  return language === "en" ? "en-US" : "id-ID";
}

export function getDocumentLanguage() {
  if (typeof document === "undefined") {
    return DEFAULT_APP_LANGUAGE;
  }

  const lang = document.documentElement.lang;
  return isAppLanguage(lang) ? lang : DEFAULT_APP_LANGUAGE;
}

export function getStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_APP_LANGUAGE;
  }

  const stored = window.localStorage.getItem(languageStorageKey);
  return isAppLanguage(stored) ? stored : DEFAULT_APP_LANGUAGE;
}
