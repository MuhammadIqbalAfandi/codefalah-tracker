import {
  DEFAULT_APP_LANGUAGE,
  type AppLanguage,
} from "~/lib/locale-config";

export type ModuleKey = "sholat" | "puasa" | "keuangan" | "olahraga" | "jurnal";

export type ContributionIntensityLevel = {
  label: string;
  description: string;
  colorClass: string;
  minScore: number;
  maxScore?: number;
};

export type ContributionGuide = {
  title: string;
  summary: string;
  explanation: string;
  intensityLevels: ContributionIntensityLevel[];
  scoreDescription: (score: number) => string;
};

const contributionGuides = {
  id: {
    sholat: {
      title: "Cara membaca contribution Sholat",
      summary:
        "Skor contribution sholat dihitung dari jumlah waktu sholat yang tercatat pada satu hari.",
      explanation:
        "Untuk Sholat, skor maksimum per hari adalah 5 karena satu hari terdiri dari lima waktu. Jadi 5/5 berarti hari itu sudah lengkap dan harus dibaca sebagai level tertinggi untuk module ini.",
      intensityLevels: [
        {
          label: "Kosong",
          description: "Belum ada sholat yang tercatat pada hari itu.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Ringan",
          description: "Baru 1 sampai 2 waktu sholat tercatat.",
          colorClass: "bg-emerald-200",
          minScore: 1,
          maxScore: 2,
        },
        {
          label: "Sedang",
          description: "Sudah 3 sampai 4 waktu sholat tercatat.",
          colorClass: "bg-sky-300",
          minScore: 3,
          maxScore: 4,
        },
        {
          label: "Lengkap",
          description: "Semua 5 waktu sholat sudah tercatat.",
          colorClass: "bg-amber-300",
          minScore: 5,
        },
      ],
      scoreDescription(score: number) {
        if (score <= 0) {
          return "belum ada sholat tercatat";
        }
        if (score >= 5) {
          return "5 dari 5 waktu sholat tercatat";
        }
        return `${score} dari 5 waktu sholat tercatat`;
      },
    },
    puasa: {
      title: "Cara membaca contribution Puasa",
      summary: "Contribution puasa memakai status selesai sebagai sinyal hari aktif.",
      explanation:
        "Hari puasa hanya dianggap aktif jika record puasa pada hari itu disimpan dengan status selesai. Jadi warna contribution menunjukkan hari puasa selesai, bukan sekadar hari yang memiliki draft catatan.",
      intensityLevels: [
        {
          label: "Kosong",
          description: "Belum ada puasa selesai pada hari itu.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Selesai",
          description: "Ada satu puasa selesai yang tercatat pada hari itu.",
          colorClass: "bg-amber-300",
          minScore: 1,
        },
      ],
      scoreDescription(score: number) {
        return score > 0 ? "puasa selesai tercatat" : "belum ada puasa selesai";
      },
    },
    keuangan: {
      title: "Cara membaca contribution Keuangan",
      summary: "Contribution keuangan dihitung dari jumlah transaksi yang tercatat per hari.",
      explanation:
        "Semakin banyak transaksi pada satu tanggal, semakin kuat intensitas contribution keuangan pada hari itu. Fokusnya adalah konsistensi pencatatan, bukan besar nominal transaksi.",
      intensityLevels: [
        {
          label: "Kosong",
          description: "Belum ada transaksi pada hari itu.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Ringan",
          description: "Ada 1 transaksi tercatat.",
          colorClass: "bg-emerald-200",
          minScore: 1,
          maxScore: 1,
        },
        {
          label: "Sedang",
          description: "Ada 2 sampai 3 transaksi tercatat.",
          colorClass: "bg-sky-300",
          minScore: 2,
          maxScore: 3,
        },
        {
          label: "Tinggi",
          description: "Ada 4 transaksi atau lebih pada hari itu.",
          colorClass: "bg-amber-300",
          minScore: 4,
        },
      ],
      scoreDescription(score: number) {
        if (score <= 0) {
          return "belum ada transaksi";
        }
        return `${score} transaksi tercatat`;
      },
    },
    olahraga: {
      title: "Cara membaca contribution Olahraga",
      summary: "Contribution olahraga memakai sesi selesai sebagai sinyal hari aktif.",
      explanation:
        "Hari olahraga dianggap aktif jika ada sesi yang disimpan sebagai selesai. Jadi contribution lebih menekankan konsistensi hari latihan yang benar-benar selesai, bukan jumlah menit yang direncanakan.",
      intensityLevels: [
        {
          label: "Kosong",
          description: "Belum ada sesi olahraga selesai pada hari itu.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Selesai",
          description: "Ada sesi olahraga selesai yang tercatat pada hari itu.",
          colorClass: "bg-amber-300",
          minScore: 1,
        },
      ],
      scoreDescription(score: number) {
        return score > 0 ? "ada sesi olahraga selesai" : "belum ada sesi selesai";
      },
    },
    jurnal: {
      title: "Cara membaca contribution Jurnal",
      summary: "Contribution jurnal dihitung dari keberadaan entri pada suatu hari.",
      explanation:
        "Satu entri jurnal sudah cukup membuat satu hari dianggap aktif. Contribution jurnal lebih menilai kontinuitas menulis daripada panjang isi jurnal.",
      intensityLevels: [
        {
          label: "Kosong",
          description: "Belum ada entri jurnal pada hari itu.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Aktif",
          description: "Ada entri jurnal yang tercatat pada hari itu.",
          colorClass: "bg-amber-300",
          minScore: 1,
        },
      ],
      scoreDescription(score: number) {
        return score > 0 ? "ada entri jurnal" : "belum ada entri jurnal";
      },
    },
  },
  en: {
    sholat: {
      title: "How to read Prayer contribution",
      summary:
        "Prayer contribution is scored from how many prayer times are recorded in a single day.",
      explanation:
        "For Prayer, the daily maximum score is 5 because one day contains five prayer times. So 5/5 means the day is complete and should be read as the highest level for this module.",
      intensityLevels: [
        {
          label: "Empty",
          description: "No prayers were recorded on that day.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Light",
          description: "Only 1 to 2 prayer times were recorded.",
          colorClass: "bg-emerald-200",
          minScore: 1,
          maxScore: 2,
        },
        {
          label: "Medium",
          description: "3 to 4 prayer times were already recorded.",
          colorClass: "bg-sky-300",
          minScore: 3,
          maxScore: 4,
        },
        {
          label: "Complete",
          description: "All 5 prayer times were recorded.",
          colorClass: "bg-amber-300",
          minScore: 5,
        },
      ],
      scoreDescription(score: number) {
        if (score <= 0) {
          return "no prayers recorded yet";
        }
        if (score >= 5) {
          return "5 of 5 prayer times recorded";
        }
        return `${score} of 5 prayer times recorded`;
      },
    },
    puasa: {
      title: "How to read Fasting contribution",
      summary: "Fasting contribution uses the completed status as the active-day signal.",
      explanation:
        "A fasting day is only considered active if the record for that day is saved as completed. The contribution color therefore reflects finished fasting days, not just days with a note draft.",
      intensityLevels: [
        {
          label: "Empty",
          description: "No completed fasting record exists for that day.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Completed",
          description: "One completed fasting record exists for that day.",
          colorClass: "bg-amber-300",
          minScore: 1,
        },
      ],
      scoreDescription(score: number) {
        return score > 0 ? "completed fasting recorded" : "no completed fasting yet";
      },
    },
    keuangan: {
      title: "How to read Finance contribution",
      summary: "Finance contribution is calculated from how many transactions are recorded each day.",
      explanation:
        "The more transactions recorded on a date, the stronger the finance contribution intensity for that day. The focus is logging consistency, not transaction amount size.",
      intensityLevels: [
        {
          label: "Empty",
          description: "No transactions were recorded on that day.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Light",
          description: "1 transaction was recorded.",
          colorClass: "bg-emerald-200",
          minScore: 1,
          maxScore: 1,
        },
        {
          label: "Medium",
          description: "2 to 3 transactions were recorded.",
          colorClass: "bg-sky-300",
          minScore: 2,
          maxScore: 3,
        },
        {
          label: "High",
          description: "4 or more transactions were recorded that day.",
          colorClass: "bg-amber-300",
          minScore: 4,
        },
      ],
      scoreDescription(score: number) {
        if (score <= 0) {
          return "no transactions recorded yet";
        }
        return `${score} transactions recorded`;
      },
    },
    olahraga: {
      title: "How to read Workout contribution",
      summary: "Workout contribution uses completed sessions as the active-day signal.",
      explanation:
        "A workout day is considered active when at least one session is saved as completed. Contribution therefore emphasizes consistency in finished workout days rather than planned minutes.",
      intensityLevels: [
        {
          label: "Empty",
          description: "No completed workout sessions were recorded on that day.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Completed",
          description: "A completed workout session was recorded on that day.",
          colorClass: "bg-amber-300",
          minScore: 1,
        },
      ],
      scoreDescription(score: number) {
        return score > 0 ? "completed workout session recorded" : "no completed session yet";
      },
    },
    jurnal: {
      title: "How to read Journal contribution",
      summary: "Journal contribution is calculated from whether an entry exists on a day.",
      explanation:
        "A single journal entry is enough to mark a day as active. Journal contribution values writing continuity more than entry length.",
      intensityLevels: [
        {
          label: "Empty",
          description: "No journal entry was recorded on that day.",
          colorClass: "bg-muted",
          minScore: 0,
          maxScore: 0,
        },
        {
          label: "Active",
          description: "A journal entry was recorded on that day.",
          colorClass: "bg-amber-300",
          minScore: 1,
        },
      ],
      scoreDescription(score: number) {
        return score > 0 ? "journal entry recorded" : "no journal entry yet";
      },
    },
  },
} as const satisfies Record<AppLanguage, Record<ModuleKey, ContributionGuide>>;

export function getContributionGuide(
  module: ModuleKey,
  language: AppLanguage = DEFAULT_APP_LANGUAGE,
) {
  return contributionGuides[language][module];
}

export function getContributionLevel(
  module: ModuleKey,
  score: number,
  language: AppLanguage = DEFAULT_APP_LANGUAGE,
): ContributionIntensityLevel {
  const guide = contributionGuides[language][module];
  return (
    guide.intensityLevels.find((level) => {
      if (score < level.minScore) {
        return false;
      }
      if (!("maxScore" in level) || level.maxScore === undefined) {
        return true;
      }
      return score <= level.maxScore;
    }) ?? guide.intensityLevels[0]
  );
}
