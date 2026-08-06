import React from 'react';
import {
  Users,
  CalendarCheck,
  Wallet,
  Star,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  CloudCheck,
  BellRing,
  Printer,
} from 'lucide-react';
import { Siswa, AbsensiRecord, KebiasaanRecord, TabunganRecord, UserSession } from '../types';

interface DashboardViewProps {
  currentUser: UserSession;
  siswaList: Siswa[];
  absensiList: AbsensiRecord[];
  kebiasaanList: KebiasaanRecord[];
  tabunganList: TabunganRecord[];
  onNavigate: (tabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  siswaList,
  absensiList,
  kebiasaanList,
  tabunganList,
  onNavigate,
}) => {
  const isGuru = currentUser.role === 'guru';
  const today = new Date().toISOString().split('T')[0];

  const totalSiswa = siswaList.length;
  const absensiToday = absensiList.filter((a) => a.tanggal === today);
  const totalHadirToday = absensiToday.filter((a) => a.status === 'Hadir').length;

  const totalClassSavings = siswaList.reduce((acc, curr) => acc + (curr.saldo || 0), 0);
  const kebiasaanToday = kebiasaanList.filter((k) => k.tanggal === today);

  const studentUser = !isGuru
    ? siswaList.find((s) => s.nis === currentUser.data.nis)
    : null;

  const studentAbsensiToday = studentUser
    ? absensiToday.find((a) => a.nis === studentUser.nis)
    : null;

  const studentKebiasaanToday = studentUser
    ? kebiasaanToday.find((k) => k.siswaId === studentUser.nis)
    : null;

  const displayedSiswaList = isGuru
    ? siswaList
    : siswaList.filter((s) => s.nis === currentUser.data.nis);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold flex items-center gap-1">
              <CloudCheck className="w-3.5 h-3.5 text-emerald-300" /> Sinkronisasi Realtime Cloud
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
              Kelas 5-A
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black">
            {isGuru
              ? 'Selamat Datang, Bapak/Ibu Wali Kelas 5-A!'
              : `Halo, ${studentUser?.nama || currentUser.data.nama}!`}
          </h2>

          <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
            {isGuru
              ? 'Kelola presensi harian, jurnal 7 kebiasaan murid per indikator, tabungan siswa, pengingat progres keuangan akhir pekan, dan cetak laporan PDF evaluasi bulanan secara terpadu.'
              : 'Isi borang 7 Kebiasaan Anak Indonesia Hebat hari ini bersama dampingan Orang Tua dan pantau kemajuan saldo tabunganmu secara aman.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('kebiasaan')}
              className="px-4 py-2.5 bg-white text-sky-700 hover:bg-sky-50 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>{isGuru ? 'Pantau 7 Kebiasaan' : 'Isi 7 Kebiasaan Hari Ini'}</span>
            </button>

            <button
              onClick={() => onNavigate('rekap_pdf')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan Evaluasi PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-sky-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Murid Kelas</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {totalSiswa} Siswa
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuru ? 'Kehadiran Hari Ini' : 'Status Presensi Anda'}
            </p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {isGuru
                ? `${totalHadirToday} / ${totalSiswa} Hadir`
                : studentAbsensiToday?.status || 'Hadir'}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuru ? 'Total Tabungan Kelas' : 'Saldo Tabungan Anda'}
            </p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Rp{' '}
              {(isGuru ? totalClassSavings : studentUser?.saldo || 0).toLocaleString('id-ID')}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xl">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Checklist 7 Kebiasaan</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {isGuru
                ? `${kebiasaanToday.length} Terisi Hari Ini`
                : studentKebiasaanToday
                ? 'Terisi Hari Ini'
                : 'Belum Diisi'}
            </h3>
          </div>
        </div>
      </div>

      {/* Shortcuts & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" /> Fitur Unggulan Terbaru
            </h4>
          </div>
          <div className="space-y-3 text-xs">
            <button
              onClick={() => onNavigate('rekap_kebiasaan')}
              className="w-full p-3 bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 rounded-xl text-left font-semibold text-sky-800 dark:text-sky-300 flex items-center justify-between transition-colors"
            >
              <span>1. Rekap Bulanan 7 Kebiasaan (Terbiasa vs Tidak Terbiasa)</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={() => onNavigate('rekap_tabungan')}
              className="w-full p-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-xl text-left font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between transition-colors"
            >
              <span>2. Rekap Tabungan Harian & Bulanan</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {isGuru && (
              <button
                onClick={() => onNavigate('notifikasi_keuangan')}
                className="w-full p-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 rounded-xl text-left font-semibold text-purple-800 dark:text-purple-300 flex items-center justify-between transition-colors"
              >
                <span>3. Pengingat Progres Keuangan Akhir Pekan</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Student Progress Overview */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />{' '}
              {isGuru ? 'Status Tabungan & 7 Kebiasaan Siswa' : 'Status Tabungan & 7 Kebiasaan Anda'}
            </h4>
            <button
              onClick={() => onNavigate('rekap_tabungan')}
              className="text-xs font-semibold text-sky-600 hover:underline"
            >
              Lihat Detail
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 pl-4">Siswa</th>
                  <th className="p-2.5">Tabungan</th>
                  <th className="p-2.5">7 Kebiasaan Hari Ini</th>
                  <th className="p-2.5 pr-4 text-right">Status Presensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedSiswaList.map((s) => {
                  const keb = kebiasaanToday.find((k) => k.siswaId === s.nis);
                  const abs = absensiToday.find((a) => a.nis === s.nis);

                  return (
                    <tr key={s.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 pl-4 font-semibold text-slate-800 dark:text-slate-200">
                        {s.nama}
                        <span className="block text-[10px] text-slate-400 font-mono">
                          NIS: {s.nis}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-emerald-600">
                        Rp {(s.saldo || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            keb
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {keb ? 'Terisi lengkap' : 'Belum diisi'}
                        </span>
                      </td>
                      <td className="p-2.5 pr-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            abs?.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {abs?.status || 'Hadir'}
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
    </div>
  );
};
