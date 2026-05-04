import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  DEFAULT_APP_LANGUAGE,
  getDocumentLanguage,
  getIntlLocale,
  getStoredLanguage,
  languageStorageKey,
  type AppLanguage,
} from "~/lib/locale-config";

const translations = {
  id: {
    language: {
      label: "Bahasa",
      indonesian: "Bahasa Indonesia",
      english: "English",
    },
    layout: {
      appName: "Codefalah",
      appTagline: "Personal tracker",
      openSidebar: "Buka sidebar",
      closeSidebar: "Tutup sidebar",
    },
    navigation: {
      dashboard: "Dashboard",
      sholat: "Sholat",
      puasa: "Puasa",
      keuangan: "Keuangan",
      olahraga: "Olahraga",
      jurnal: "Jurnal",
    },
    theme: {
      lightMode: "Mode terang",
      darkMode: "Mode gelap",
      theme: "Tema",
    },
    common: {
      date: "Tanggal",
      notes: "Catatan",
      history: "Riwayat",
      summary: "Ringkasan",
      save: "Simpan",
      saveChanges: "Simpan perubahan",
      viewDetail: "Lihat detail",
      selectOption: "Pilih opsi",
      backToHistory: "Kembali ke riwayat",
      emptyStateTitle: "Belum ada data",
      emptyStateDescription: "Data yang tersimpan akan muncul di sini.",
      delete: "Hapus",
      deleting: "Menghapus...",
      cancel: "Batal",
      today: "Hari ini",
      close: "Tutup",
      showHelp: "Buka panduan",
      openModule: "Buka module",
      activeRange: "Rentang aktif saat ini",
      contribution: "Contribution",
      settings: "Pengaturan",
      year: "Tahun",
    },
    dateField: {
      helperText: "Mengikuti waktu lokal Asia/Jakarta.",
      placeholder: "Pilih tanggal",
      pickerTitle: "Pilih tanggal",
      pickerHint: "Pilih tanggal tanpa mengubah format lokal.",
    },
  },
  en: {
    language: {
      label: "Language",
      indonesian: "Bahasa Indonesia",
      english: "English",
    },
    layout: {
      appName: "Codefalah",
      appTagline: "Personal tracker",
      openSidebar: "Open sidebar",
      closeSidebar: "Close sidebar",
    },
    navigation: {
      dashboard: "Dashboard",
      sholat: "Prayer",
      puasa: "Fasting",
      keuangan: "Finance",
      olahraga: "Workout",
      jurnal: "Journal",
    },
    theme: {
      lightMode: "Light mode",
      darkMode: "Dark mode",
      theme: "Theme",
    },
    common: {
      date: "Date",
      notes: "Notes",
      history: "History",
      summary: "Summary",
      save: "Save",
      saveChanges: "Save changes",
      viewDetail: "View detail",
      selectOption: "Select an option",
      backToHistory: "Back to history",
      emptyStateTitle: "No data yet",
      emptyStateDescription: "Saved data will appear here.",
      delete: "Delete",
      deleting: "Deleting...",
      cancel: "Cancel",
      today: "Today",
      close: "Close",
      showHelp: "Show help",
      openModule: "Open module",
      activeRange: "Active range",
      contribution: "Contribution",
      settings: "Settings",
      year: "Year",
    },
    dateField: {
      helperText: "Follows Asia/Jakarta local time.",
      placeholder: "Select a date",
      pickerTitle: "Choose a date",
      pickerHint: "Pick a date without changing the local format.",
    },
  },
} as const;

type TranslationDictionary = (typeof translations)[AppLanguage];

type LocalizationContextValue = {
  language: AppLanguage;
  locale: string;
  setLanguage: (language: AppLanguage) => void;
  t: TranslationDictionary;
};

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(() => getDocumentLanguage());

  useEffect(() => {
    setLanguage(getStoredLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(languageStorageKey, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      locale: getIntlLocale(language),
      setLanguage,
      t: translations[language],
    }),
    [language],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error("useLocale must be used within LocalizationProvider");
  }

  return context;
}

export function useTranslations() {
  return useLocale().t;
}

export function getLanguageOptions(t: TranslationDictionary) {
  return [
    { value: "id", label: t.language.indonesian },
    { value: "en", label: t.language.english },
  ] as const;
}
