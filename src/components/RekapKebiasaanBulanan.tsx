import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3,
  Award,
  Filter,
  Sun,
  HeartHandshake,
  Activity,
  Apple,
  Users,
  BookOpen,
  Moon,
  Sparkles,
} from 'lucide-react';
import { KebiasaanRecord, Siswa, HabitKey, Role } from '../types';
import { HABIT_DEFINITIONS, calculateHabitSummary, isHabitHabituated } from '../data/habitData';

interface RekapKebiasaanBulananProps {
  siswaList: Siswa[];
  kebiasaanList: KebiasaanRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
}

export const RekapKebiasaanBulanan: React.FC<RekapKebiasaanBulananProps> = ({
  siswaList,
  kebiasaanList,
  currentUserRole,
  currentUserNis,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const isGuru = currentUserRole === 'guru';
  const [selectedSiswaNis, setSelectedSiswaNis] = useState<string>(
    isGuru ? 'ALL' : currentUserNis || 'ALL'
  );

  // Filter records by month
  const monthRecords = kebiasaanList.filter((k) => k.tanggal.startsWith(selectedMonth));

  // Filter by selected student if specific
  const filteredRecords =
    selectedSiswaNis === 'ALL'
      ? monthRecords
      : monthRecords.filter((k) => k.siswaId === selectedSiswaNis);

  const summary = calculateHabitSummary(filteredRecords);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-emerald-500" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-rose-500" />;
      case 'Apple':
        return <Apple className="w-5 h-5 text-lime-500" />;
      case 'Users':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-sky-500" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-purple-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Filter Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full text-xs font-bold flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" /> Evaluasi Bulanan Jurnal 7 Kebiasaan
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Rekapitulasi Kebiasaan: Terbiasa vs Tidak Terbiasa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pengukuran tingkat pembiasaan karakter murid berdasarkan 7 Indikator Anak Indonesia Hebat
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            {isGuru && (
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={selectedSiswaNis}
                  onChange={(e) => setSelectedSiswaNis(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                >
                  <option value="ALL">Semua Siswa Kelas 5-A</option>
                  {siswaList.map((s) => (
                    <option key={s.nis} value={s.nis}>
                      {s.nama} ({s.nis})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Aggregate Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Hari Terisi Bulan Ini</p>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {summary.totalDaysRecorded} Hari
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Total Status Terbiasa
              </p>
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
                {summary.overallHabituatedCount} Checklist
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                Tidak Terbiasa / Absen
              </p>
              <h4 className="text-lg font-bold text-amber-800 dark:text-amber-100">
                {summary.overallTotalChecks - summary.overallHabituatedCount} Checklist
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
                Skor Keterbiasaan
              </p>
              <h4 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">
                {summary.percentage}%{' '}
                <span className="text-[10px] font-normal block">({summary.statusLabel})</span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown 7 Kebiasaan Cards */}
      <div className="space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-600" /> Rincian Rekap Per Indikator Kebiasaan
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {HABIT_DEFINITIONS.map((def) => {
            const terbiasaCount = summary.habitHabituatedCount[def.key] || 0;
            const tidakTerbiasaCount = summary.habitNotHabituatedCount[def.key] || 0;
            const total = terbiasaCount + tidakTerbiasaCount;
            const pct = total > 0 ? Math.round((terbiasaCount / total) * 100) : 0;

            return (
              <div
                key={def.key}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {getIcon(def.icon)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Kebiasaan #{def.number}
                      </span>
                      <h5 className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                        {def.title}
                      </h5>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      pct >= 80
                        ? 'bg-emerald-100 text-emerald-700'
                        : pct >= 60
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {pct}% Terbiasa
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: <strong className="text-slate-700 dark:text-slate-300">{def.targetCriteria}</strong>
                </p>

                {/* Progress Bar Terbiasa vs Tidak Terbiasa */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-3 transition-all"
                      style={{ width: `${pct}%` }}
                      title={`Terbiasa: ${terbiasaCount}`}
                    />
                    <div
                      className="bg-amber-400 h-3 transition-all"
                      style={{ width: `${100 - pct}%` }}
                      title={`Tidak Terbiasa: ${tidakTerbiasaCount}`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Terbiasa: {terbiasaCount} hari
                    </span>
                    <span className="text-amber-600 font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Tidak Terbiasa: {tidakTerbiasaCount} hari
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Habit Matrix Table (Teacher View or All Students view) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Matriks Keterbiasaan Murid ({selectedMonth})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluasi keterbiasaan per murid untuk 7 Kebiasaan Anak Indonesia Hebat
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3 rounded-l-lg">Siswa</th>
                {HABIT_DEFINITIONS.map((h) => (
                  <th key={h.key} className="p-3 text-center">
                    #{h.number} {h.title.split(' ')[0]}
                  </th>
                ))}
                <th className="p-3 rounded-r-lg text-right">Skor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {siswaList.map((siswa) => {
                const sRecords = monthRecords.filter((k) => k.siswaId === siswa.nis);
                const sSummary = calculateHabitSummary(sRecords);

                return (
                  <tr key={siswa.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {siswa.nama}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        NIS: {siswa.nis}
                      </span>
                    </td>
                    {HABIT_DEFINITIONS.map((def) => {
                      const tCount = sSummary.habitHabituatedCount[def.key] || 0;
                      const tot = sRecords.length;
                      const habitPct = tot > 0 ? Math.round((tCount / tot) * 100) : 0;
                      const isGood = habitPct >= 70;

                      return (
                        <td key={def.key} className="p-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-lg text-[10px] font-bold ${
                              isGood
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {isGood ? 'Terbiasa' : 'Perlu Bimbingan'}
                            <span className="block text-[9px] opacity-75">{tCount}/{tot} hr</span>
                          </span>
                        </td>
                      );
                    })}
                    <td className="p-3 text-right">
                      <span className="font-bold text-sky-600 dark:text-sky-400 text-sm">
                        {sSummary.percentage}%
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        {sSummary.statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
