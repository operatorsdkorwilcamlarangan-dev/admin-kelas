import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { TabunganRecord, Siswa, Role } from '../types';

interface RekapTabunganBulananProps {
  siswaList: Siswa[];
  tabunganList: TabunganRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
}

export const RekapTabunganBulanan: React.FC<RekapTabunganBulananProps> = ({
  siswaList,
  tabunganList,
  currentUserRole,
  currentUserNis,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [activeTab, setActiveTab] = useState<'bulanan' | 'harian'>('bulanan');
  const [searchTerm, setSearchTerm] = useState('');

  const isGuru = currentUserRole === 'guru';
  const displaySiswaList = isGuru
    ? siswaList
    : siswaList.filter((s) => s.nis === currentUserNis);

  // Filter transactions for the selected month
  const monthTransactions = tabunganList.filter((t) => t.tanggal.startsWith(selectedMonth));

  const totalDeposits = monthTransactions
    .filter((t) => t.jenis === 'setor')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const totalWithdrawals = monthTransactions
    .filter((t) => t.jenis === 'tarik')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const netGrowth = totalDeposits - totalWithdrawals;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Month Filter */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" /> Laporan Transparansi Keuangan
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Rekapitulasi Tabungan Harian & Bulanan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Laporan pertumbuhan saldo, riwayat setoran/penarikan, dan evaluasi pencapaian target tabungan
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                Total Setoran Bulan Ini
              </p>
              <h4 className="text-lg font-bold text-emerald-800 dark:text-emerald-100">
                + Rp {totalDeposits.toLocaleString('id-ID')}
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
                Total Penarikan Bulan Ini
              </p>
              <h4 className="text-lg font-bold text-rose-800 dark:text-rose-100">
                - Rp {totalWithdrawals.toLocaleString('id-ID')}
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                Pertumbuhan Net Bulan Ini
              </p>
              <h4 className="text-lg font-bold text-sky-900 dark:text-sky-100">
                Rp {netGrowth.toLocaleString('id-ID')}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('bulanan')}
            className={`py-2 px-4 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'bulanan'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Rekap Bulanan Per Siswa
          </button>
          <button
            onClick={() => setActiveTab('harian')}
            className={`py-2 px-4 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'harian'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Riwayat Transaksi Harian
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama atau NIS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* View 1: Bulanan Per Siswa */}
      {activeTab === 'bulanan' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-3 pl-5">Siswa</th>
                  <th className="p-3">Setoran Bulan Ini</th>
                  <th className="p-3">Penarikan Bulan Ini</th>
                  <th className="p-3">Saldo Akhir</th>
                  <th className="p-3">Progres Target</th>
                  <th className="p-3 pr-5 text-right">Status Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displaySiswaList
                  .filter(
                    (s) =>
                      s.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      s.nis.includes(searchTerm)
                  )
                  .map((siswa) => {
                    const sMonthTxs = monthTransactions.filter((t) => t.siswaId === siswa.nis);
                    const mSetor = sMonthTxs
                      .filter((t) => t.jenis === 'setor')
                      .reduce((a, b) => a + b.nominal, 0);
                    const mTarik = sMonthTxs
                      .filter((t) => t.jenis === 'tarik')
                      .reduce((a, b) => a + b.nominal, 0);

                    const target = siswa.targetTabungan || 200000;
                    const pct = Math.min(100, Math.round(((siswa.saldo || 0) / target) * 100));

                    return (
                      <tr key={siswa.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 pl-5 font-semibold text-slate-800 dark:text-slate-200">
                          {siswa.nama}
                          <span className="block text-[10px] text-slate-400 font-mono">
                            NIS: {siswa.nis}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-emerald-600">
                          + Rp {mSetor.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-semibold text-rose-600">
                          - Rp {mTarik.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                          Rp {(siswa.saldo || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 min-w-[140px]">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-slate-500">Target: Rp {target.toLocaleString('id-ID')}</span>
                            <span className="font-bold text-emerald-600">{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-3 pr-5 text-right">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              pct >= 100
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                            }`}
                          >
                            {pct >= 100 ? 'Target Tercapai 🎉' : 'Dalam Proses'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Transaksi Harian */}
      {activeTab === 'harian' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-3 pl-5">Tanggal</th>
                  <th className="p-3">Siswa</th>
                  <th className="p-3">Jenis Transaksi</th>
                  <th className="p-3">Nominal</th>
                  <th className="p-3">Keterangan</th>
                  <th className="p-3 pr-5 text-right">Saldo Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {monthTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      Tidak ada transaksi harian pada bulan {selectedMonth}
                    </td>
                  </tr>
                ) : (
                  monthTransactions
                    .filter(
                      (t) =>
                        t.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.nis.includes(searchTerm)
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 pl-5 font-mono text-slate-600 dark:text-slate-400">
                          {item.tanggal}
                        </td>
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {item.nama}
                          <span className="block text-[10px] text-slate-400 font-mono">
                            NIS: {item.nis}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.jenis === 'setor'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {item.jenis === 'setor' ? 'Setoran (+)' : 'Penarikan (-)'}
                          </span>
                        </td>
                        <td
                          className={`p-3 font-bold ${
                            item.jenis === 'setor' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          Rp {item.nominal.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-slate-500">{item.keterangan || '-'}</td>
                        <td className="p-3 pr-5 text-right font-bold text-slate-800 dark:text-slate-100">
                          Rp {item.saldoAkhir.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
