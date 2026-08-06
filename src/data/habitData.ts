import { HabitItemDef, HabitKey, KebiasaanRecord } from '../types';

export const HABIT_DEFINITIONS: HabitItemDef[] = [
  {
    key: 'bangunPagi',
    number: 1,
    title: 'Bangun Pagi Tepat Waktu',
    description: 'Bangun sebelum subuh/sebelum pkl 05.00 WIB secara mandiri',
    targetCriteria: 'Bangun ≤ 05.00 WIB',
    icon: 'Sun',
    colorBg: 'bg-amber-50 dark:bg-amber-950/40',
    colorText: 'text-amber-600 dark:text-amber-400',
    colorBorder: 'border-amber-200 dark:border-amber-800',
  },
  {
    key: 'beribadah',
    number: 2,
    title: 'Beribadah Tepat Waktu',
    description: 'Mengerjakan ibadah sholat 5 waktu / ibadah rutin harian',
    targetCriteria: 'Lengkap 5 Waktu',
    icon: 'HeartHandshake',
    colorBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    colorText: 'text-emerald-600 dark:text-emerald-400',
    colorBorder: 'border-emerald-200 dark:border-emerald-800',
  },
  {
    key: 'berolahraga',
    number: 3,
    title: 'Berolahraga & Fisik Sehat',
    description: 'Aktivitas olahraga, senam, atau kegiatan fisik minimal 15-30 menit',
    targetCriteria: 'Olahraga Rutin',
    icon: 'Activity',
    colorBg: 'bg-rose-50 dark:bg-rose-950/40',
    colorText: 'text-rose-600 dark:text-rose-400',
    colorBorder: 'border-rose-200 dark:border-rose-800',
  },
  {
    key: 'makanBergizi',
    number: 4,
    title: 'Makan Bergizi & Sehat',
    description: 'Mengonsumsi makanan seimbang 4 sehat 5 sempurna, buah & sayur',
    targetCriteria: 'Menu Seimbang',
    icon: 'Apple',
    colorBg: 'bg-lime-50 dark:bg-lime-950/40',
    colorText: 'text-lime-600 dark:text-lime-400',
    colorBorder: 'border-lime-200 dark:border-lime-800',
  },
  {
    key: 'bermasyarakat',
    number: 5,
    title: 'Bermasyarakat & Gotong Royong',
    description: 'Membantu keluarga, tetangga, serta menjaga kebersihan lingkungan',
    targetCriteria: 'Aksi Sosial/Gotong Royong',
    icon: 'Users',
    colorBg: 'bg-indigo-50 dark:bg-indigo-950/40',
    colorText: 'text-indigo-600 dark:text-indigo-400',
    colorBorder: 'border-indigo-200 dark:border-indigo-800',
  },
  {
    key: 'gemarBelajar',
    number: 6,
    title: 'Gemar Belajar & Literasi',
    description: 'Membaca buku cerita/pelajaran & mengulang materi sekolah',
    targetCriteria: 'Membaca/Belajar Mandiri',
    icon: 'BookOpen',
    colorBg: 'bg-sky-50 dark:bg-sky-950/40',
    colorText: 'text-sky-600 dark:text-sky-400',
    colorBorder: 'border-sky-200 dark:border-sky-800',
  },
  {
    key: 'tidurCepat',
    number: 7,
    title: 'Tidur Cepat / Istirahat Cukup',
    description: 'Istirahat dan tidur malam tepat waktu untuk kesehatan tubuh',
    targetCriteria: 'Tidur ≤ 21.30 WIB',
    icon: 'Moon',
    colorBg: 'bg-purple-50 dark:bg-purple-950/40',
    colorText: 'text-purple-600 dark:text-purple-400',
    colorBorder: 'border-purple-200 dark:border-purple-800',
  },
];

/**
 * Evaluates whether a single habit entry is "Terbiasa" (true) or "Tidak Terbiasa" (false)
 */
export function isHabitHabituated(record: KebiasaanRecord, habitKey: HabitKey): boolean {
  if (!record) return false;

  switch (habitKey) {
    case 'bangunPagi':
      return !!record.waktuBangun && record.waktuBangun <= '05:00';
    case 'beribadah':
      return Array.isArray(record.sholatList) && record.sholatList.length >= 5;
    case 'berolahraga':
      return !!record.olahragaDetail && record.olahragaDetail.trim().length >= 3;
    case 'makanBergizi':
      return !!record.menuMakan && record.menuMakan.trim().length >= 3;
    case 'bermasyarakat':
      return !!record.kegiatanMasyarakat && record.kegiatanMasyarakat.trim().length >= 3;
    case 'gemarBelajar':
      return !!record.kegiatanBelajar && record.kegiatanBelajar.trim().length >= 3;
    case 'tidurCepat':
      return !!record.waktuTidur && record.waktuTidur <= '21:30';
    default:
      return false;
  }
}

/**
 * Calculates total habit statistics for a collection of records (e.g., for a month)
 */
export function calculateHabitSummary(records: KebiasaanRecord[]) {
  const habituatedCounts: Record<HabitKey, number> = {
    bangunPagi: 0,
    beribadah: 0,
    berolahraga: 0,
    makanBergizi: 0,
    bermasyarakat: 0,
    gemarBelajar: 0,
    tidurCepat: 0,
  };

  const notHabituatedCounts: Record<HabitKey, number> = {
    bangunPagi: 0,
    beribadah: 0,
    berolahraga: 0,
    makanBergizi: 0,
    bermasyarakat: 0,
    gemarBelajar: 0,
    tidurCepat: 0,
  };

  records.forEach((record) => {
    HABIT_DEFINITIONS.forEach((def) => {
      if (isHabitHabituated(record, def.key)) {
        habituatedCounts[def.key]++;
      } else {
        notHabituatedCounts[def.key]++;
      }
    });
  });

  const totalDays = records.length;
  const totalChecks = totalDays * 7;
  const overallHabituated = Object.values(habituatedCounts).reduce((a, b) => a + b, 0);
  const percentage = totalChecks > 0 ? Math.round((overallHabituated / totalChecks) * 100) : 0;

  let statusLabel: 'Sangat Terbiasa' | 'Terbiasa' | 'Perlu Pembiasaan' = 'Perlu Pembiasaan';
  if (percentage >= 80) {
    statusLabel = 'Sangat Terbiasa';
  } else if (percentage >= 60) {
    statusLabel = 'Terbiasa';
  }

  return {
    totalDaysRecorded: totalDays,
    habitHabituatedCount: habituatedCounts,
    habitNotHabituatedCount: notHabituatedCounts,
    overallHabituatedCount: overallHabituated,
    overallTotalChecks: totalChecks,
    percentage,
    statusLabel,
  };
}
