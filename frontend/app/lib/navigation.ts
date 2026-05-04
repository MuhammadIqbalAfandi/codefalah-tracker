import {
  Activity,
  BookOpenText,
  ChartNoAxesCombined,
  Dumbbell,
  Landmark,
  Moon,
} from "lucide-react";

const navigationConfig = [
  {
    key: "dashboard",
    href: "/",
    icon: ChartNoAxesCombined,
  },
  {
    key: "sholat",
    href: "/sholat",
    icon: Landmark,
  },
  {
    key: "puasa",
    href: "/puasa",
    icon: Moon,
  },
  {
    key: "keuangan",
    href: "/keuangan",
    icon: Activity,
  },
  {
    key: "olahraga",
    href: "/olahraga",
    icon: Dumbbell,
  },
  {
    key: "jurnal",
    href: "/jurnal",
    icon: BookOpenText,
  },
] as const;

export const navigationItems = navigationConfig.map(({ key, ...item }) => ({
  ...item,
  label:
    key === "dashboard"
      ? "Dashboard"
      : key === "sholat"
        ? "Sholat"
        : key === "puasa"
          ? "Puasa"
          : key === "keuangan"
            ? "Keuangan"
            : key === "olahraga"
              ? "Olahraga"
              : "Jurnal",
}));

export function getNavigationItems(labels: Record<string, string>) {
  return navigationConfig.map(({ key, ...item }) => ({
    ...item,
    label: labels[key] ?? key,
  }));
}
