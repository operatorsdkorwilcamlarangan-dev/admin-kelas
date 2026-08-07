import React, { useState } from 'react';
import {
  CalendarCheck,
  Calendar,
  Filter,
  Users,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Download,
  Printer,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Siswa, AbsensiRecord, Role } from '../types';

interface RekapAbsensiViewProps {
  siswaList: Siswa[];
  absensiList: AbsensiRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
  onNavigate?: (tabId: string) => void;
}

const STATUS_COLORS = {
  Hadir: '#10b981', // Emerald
  Sakit: '#f59e0b', // Amber
  Izin: '#3b82f6',  // Blue
  Alpa: '#ef4444',  // Red
};

export const RekapAbsensiView: React.FC<RekapAbsensiViewProps> = ({
  siswaList,
  absensiList,
  currentUserRole,
  currentUserNis,
  onNavigate,
}) => {
  const isGuru = currentUserRole === 'guru';
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [selectedSiswaNis, setSelectedSiswaNis] = useState<string>(
    isGuru ? 'ALL' : currentUserNis || 'ALL'
  );

  const displayedSiswaList = isGuru
    ? selectedSiswaNis === 'ALL'
      ? siswaList
      : siswaList.filter((s) => s.nis === selectedSiswaNis)
    : siswaList.filter((s) => s.nis === currentUserNis);

  // Filter absensi by selected month and student(s)
  const monthAbsensi = absensiList.filter((a) => {
    const isSameMonth = a.tanggal.startsWith(selectedMonth);
    const matchesSiswa =
      !isGuru
        ? a.nis === currentUserNis
        : selectedSiswaNis === 'ALL' || a.nis === selectedSiswaNis;
    return isSameMonth && matchesSiswa;
  });

  // Calculate totals
  const countHadir = monthAbsensi.filter((a) => a.status === 'Hadir').length;
  const countSakit = monthAbsensi.filter((a) => a.status === 'Sakit').length;
  const countIzin = monthAbsensi.filter((a) => a.status === 'Izin').length;
  const countAlpa = monthAbsensi.filter((a) => a.status === 'Alpa').length;
  const totalEntries = countHadir + countSakit + countIzin + countAlpa;

  const attendancePercentage = totalEntries > 0
    ? Math.round((countHadir / totalEntries) * 100)
    : 100;

  // Chart 1: Pie chart data for status distribution
  const pieData = [
    { name: 'Hadir', value: countHadir, color: STATUS_COLORS.Hadir },
    { name: 'Sakit', value: countSakit, color: STATUS_COLORS.Sakit },
    { name: 'Izin', value: countIzin, color: STATUS_COLORS.Izin },
    { name: 'Alpa', value: countAlpa, color: STATUS_COLORS.Alpa },
  ].filter((item) => item.value > 0);

  // Chart 2: Student breakdown data for Bar Chart
  const studentBarData = displayedSiswaList.map((s) => {
    const sAbs = monthAbsensi.filter((a) => a.nis === s.nis);
    const h = sAbs.filter((a) => a.status === 'Hadir').length;
    const sakit = sAbs.filter((a) => a.status === 'Sakit').length;
    const izin = sAbs.filter((a) => a.status === 'Izin').length;
    const alpa = sAbs.filter((a) => a.status === 'Alpa').length;
    return {
      nama: s.nama.length > 12 ? s.nama.slice(0, 12) + '...' : s.nama,
      namaLengkap: s.nama,
      Hadir: h,
      Sakit: sakit,
      Izin: izin,
      Alpa: alpa,
    };
  });

  // Export to CSV
  const handleExportCSV = () => {
    let csv = `Rekap Absensi Siswa - Bulan ${selectedMonth}\n`;
    csv += 'No;NIS;Nama Siswa;Hadir;Sakit;Izin;Alpa;Total Recorded;% Kehadiran;Keterangan\n';

    displayedSiswaList.forEach((s, idx) => {
      const sAbs = monthAbsensi.filter((a) => a.nis === s.nis);
      const h = sAbs.filter((a) => a.status === 'Hadir').length;
      const sakit = sAbs.filter((a) => a.status === 'Sakit').length;
      const izin = sAbs.filter((a) => a.status === 'Izin').length;
      const alpa = sAbs.filter((a) => a.status === 'Alpa').length;
      const total = h + sakit + izin + alpa;
      const pct = total > 0 ? Math.round((h / total) * 100) : 100;

      let ket = 'Sangat Rajin';
      if (pct < 75) ket = 'Perlu Perhatian';
      else if (pct < 85) ket = 'Cukup';
      else if (pct < 95) ket = 'Rajin';

      csv += `${idx + 1};${s.nis};${s.nama};${h};${sakit};${izin};${alpa};${total};${pct}%;${ket}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Absensi_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-sky-600" />
            Rekapitasi & Analisis Presensi Siswa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pantau ringkasan tingkat kehadiran, statistik sakit/izin/alpa, dan grafik tren bulanan.
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {isGuru && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <Users className="w-4 h-4 text-slate-400" />
              <select
                value={selectedSiswaNis}
                onChange={(e) => setSelectedSiswaNis(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="ALL">Semua Murid (Satu Kelas)</option>
                {siswaList.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <h4 className="text-xl font-bold text-emerald-600">{countHadir} <span className="text-xs text-slate-400 font-normal">hari</span></h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalEntries > 0 ? Math.round((countHadir / totalEntries) * 100) : 0}% dari total
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sakit</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <h4 className="text-xl font-bold text-amber-600">{countSakit} <span className="text-xs text-slate-400 font-normal">hari</span></h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Surat Keterangan Dokter</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Izin</span>
            <HelpCircle className="w-4 h-4 text-blue-500" />
          </div>
          <h4 className="text-xl font-bold text-blue-600">{countIzin} <span className="text-xs text-slate-400 font-normal">hari</span></h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Izin Orang Tua / Wali</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Alpa</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <h4 className="text-xl font-bold text-rose-600">{countAlpa} <span className="text-xs text-slate-400 font-normal">hari</span></h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Tanpa Keterangan</p>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-sky-500 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tingkat Kehadiran</span>
            <TrendingUp className="w-4 h-4 text-sky-500" />
          </div>
          <h4 className="text-xl font-extrabold text-sky-600">{attendancePercentage}%</h4>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
            <div
              className={`h-full transition-all duration-500 ${
                attendancePercentage >= 90
                  ? 'bg-emerald-500'
                  : attendancePercentage >= 75
                  ? 'bg-sky-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${attendancePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Donut/Pie Chart distribution */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-sky-600" /> Distribuasi Status Presensi
            </h4>
          </div>

          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} catatan`, 'Jumlah']}
                    contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4">
              <CalendarCheck className="w-8 h-8 mb-2 stroke-1" />
              <span>Belum ada catatan presensi untuk periode {selectedMonth}.</span>
            </div>
          )}
        </div>

        {/* Chart 2: Bar Chart Student Breakdown */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Grafik Presensi Per Siswa
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Bulan: {selectedMonth}</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentBarData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="nama"
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val: number, name: string) => [`${val} hari`, name]}
                  labelFormatter={(label: string, items: any[]) =>
                    items && items[0]?.payload?.namaLengkap ? items[0].payload.namaLengkap : label
                  }
                  contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }} />
                <Bar dataKey="Hadir" fill={STATUS_COLORS.Hadir} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sakit" fill={STATUS_COLORS.Sakit} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Izin" fill={STATUS_COLORS.Izin} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Alpa" fill={STATUS_COLORS.Alpa} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-600" /> Tabel Detail Rekapitulasi Presensi Murid
          </h4>
          <span className="text-xs text-slate-500">
            Total {displayedSiswaList.length} Murid
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-5">No</th>
                <th className="p-3">NIS</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3 text-center text-emerald-600">Hadir</th>
                <th className="p-3 text-center text-amber-600">Sakit</th>
                <th className="p-3 text-center text-blue-600">Izin</th>
                <th className="p-3 text-center text-rose-600">Alpa</th>
                <th className="p-3 text-center">Total Hari</th>
                <th className="p-3 text-center">% Kehadiran</th>
                <th className="p-3 pr-5 text-right">Predikat / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedSiswaList.map((s, idx) => {
                const sAbs = monthAbsensi.filter((a) => a.nis === s.nis);
                const h = sAbs.filter((a) => a.status === 'Hadir').length;
                const sakit = sAbs.filter((a) => a.status === 'Sakit').length;
                const izin = sAbs.filter((a) => a.status === 'Izin').length;
                const alpa = sAbs.filter((a) => a.status === 'Alpa').length;
                const total = h + sakit + izin + alpa;
                const pct = total > 0 ? Math.round((h / total) * 100) : 100;

                let predikat = 'Sangat Rajin';
                let colorClass = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
                if (pct < 75) {
                  predikat = 'Perlu Perhatian';
                  colorClass = 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300';
                } else if (pct < 85) {
                  predikat = 'Cukup';
                  colorClass = 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
                } else if (pct < 95) {
                  predikat = 'Rajin';
                  colorClass = 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300';
                }

                return (
                  <tr key={s.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-5 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">{s.nis}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{s.nama}</td>
                    <td className="p-3 text-center font-bold text-emerald-600">{h}</td>
                    <td className="p-3 text-center font-bold text-amber-600">{sakit}</td>
                    <td className="p-3 text-center font-bold text-blue-600">{izin}</td>
                    <td className="p-3 text-center font-bold text-rose-600">{alpa}</td>
                    <td className="p-3 text-center font-mono font-semibold text-slate-600 dark:text-slate-400">{total}</td>
                    <td className="p-3 text-center font-extrabold text-sky-600">{pct}%</td>
                    <td className="p-3 pr-5 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${colorClass}`}>
                        {predikat}
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
