import {
  Activity,
  BookOpenText,
  ChartNoAxesCombined,
  Dumbbell,
  Landmark,
  Moon,
} from "lucide-react";

export const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Sholat",
    href: "/sholat",
    icon: Landmark,
  },
  {
    label: "Puasa",
    href: "/puasa",
    icon: Moon,
  },
  {
    label: "Keuangan",
    href: "/keuangan",
    icon: Activity,
  },
  {
    label: "Olahraga",
    href: "/olahraga",
    icon: Dumbbell,
  },
  {
    label: "Jurnal",
    href: "/jurnal",
    icon: BookOpenText,
  },
] as const;
