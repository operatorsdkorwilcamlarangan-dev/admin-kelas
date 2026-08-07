import React, { useState, useRef } from 'react';
import { Printer, Download, Calendar, School, FileText } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { Siswa, AbsensiRecord, KebiasaanRecord, TabunganRecord, SchoolSettings, Role } from '../types';
import { calculateHabitSummary } from '../data/habitData';

interface RekapBulananPDFViewProps {
  siswaList: Siswa[];
  absensiList: AbsensiRecord[];
  kebiasaanList: KebiasaanRecord[];
  tabunganList: TabunganRecord[];
  schoolSettings?: SchoolSettings;
  currentUserRole?: Role;
  currentUserNis?: string;
}

export const RekapBulananPDFView: React.FC<RekapBulananPDFViewProps> = ({
  siswaList,
  absensiList,
  kebiasaanList,
  tabunganList,
  schoolSettings,
  currentUserRole = 'guru',
  currentUserNis,
}) => {
  const isGuru = currentUserRole === 'guru';
  const [selectedSiswaNis, setSelectedSiswaNis] = useState<string>(
    isGuru ? 'ALL' : currentUserNis || 'ALL'
  );
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const displayedSiswaList = isGuru
    ? selectedSiswaNis === 'ALL'
      ? siswaList
      : siswaList.filter((s) => s.nis === selectedSiswaNis)
    : siswaList.filter((s) => s.nis === currentUserNis);

  const monthAbsensi = absensiList.filter((a) => a.tanggal.startsWith(selectedMonth));
  const monthKebiasaan = kebiasaanList.filter((k) => k.tanggal.startsWith(selectedMonth));
  const monthTabungan = tabunganList.filter((t) => t.tanggal.startsWith(selectedMonth));

  // Export to PDF using html2pdf.js
  const handleExportPDF = () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    const element = reportRef.current;
    const opt = {
      margin: 10,
      filename: `Laporan-Evaluasi-Bulanan-${selectedMonth}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => setIsExporting(false))
      .catch((err: any) => {
        console.error('PDF generation error', err);
        setIsExporting(false);
        window.print();
      });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Header (hidden in print) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" /> Cetak Laporan Evaluasi Bulanan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ekspor resmi dokumen evaluasi kelas (Presensi, 7 Kebiasaan, dan Tabungan) ke format PDF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isGuru && (
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 font-semibold">Pilih Siswa:</span>
              <select
                value={selectedSiswaNis}
                onChange={(e) => setSelectedSiswaNis(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                <option value="ALL">Semua Siswa (Seluruh Kelas)</option>
                {siswaList.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Memproses PDF...' : 'Unduh Berkas PDF'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Langsung</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document (A4 Styling) */}
      <div
        ref={reportRef}
        id="pdf-report-content"
        className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-lg space-y-8 print:border-none print:shadow-none print:p-0"
      >
        {/* KOP Surat Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <div className="flex items-center justify-center gap-4 mb-2">
            {schoolSettings?.logoSekolah ? (
              <img
                src={schoolSettings.logoSekolah}
                alt="Logo Sekolah"
                className="w-14 h-14 object-contain"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-xl">
                <School className="w-6 h-6" />
              </div>
            )}
            <div className="text-left">
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
                DINAS PENDIDIKAN & KEBUDAYAAN
              </h2>
              <h1 className="text-lg font-black uppercase text-sky-900">
                {schoolSettings?.namaSekolah || 'SD NEGERI KELAS UNGGULAN 5-A'}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                {schoolSettings?.kelas ? `Kelas: ${schoolSettings.kelas} • ` : ''}
                {schoolSettings?.tahunAjaran ? `Tahun Ajaran: ${schoolSettings.tahunAjaran}` : ''}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            {schoolSettings?.alamatSekolah || 'Jl. Pendidikan No. 45 • Telp: (021) 555-0199'}
          </p>
          <div className="pt-2">
            <h3 className="text-sm font-bold uppercase tracking-wider bg-slate-100 py-1.5 border border-slate-300">
              LAPORAN EVALUASI BULANAN SISWA{' '}
              {displayedSiswaList.length === 1
                ? `(${displayedSiswaList[0].nama} - NIS: ${displayedSiswaList[0].nis})`
                : ''}{' '}
              — PERIODE: {selectedMonth}
            </h3>
          </div>
        </div>

        {/* Section 1: Ringkasan Absensi & Presensi */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 text-slate-800">
            I. Rekapitulasi Kehadiran & Presensi
          </h4>
          <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                <th className="p-2 border border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border border-slate-300">NIS</th>
                <th className="p-2 border border-slate-300">Nama Siswa</th>
                <th className="p-2 border border-slate-300 text-center">Hadir (H)</th>
                <th className="p-2 border border-slate-300 text-center">Sakit (S)</th>
                <th className="p-2 border border-slate-300 text-center">Izin (I)</th>
                <th className="p-2 border border-slate-300 text-center">Alpa (A)</th>
                <th className="p-2 border border-slate-300 text-center">Kehadiran %</th>
              </tr>
            </thead>
            <tbody>
              {displayedSiswaList.map((s, idx) => {
                const sAbs = monthAbsensi.filter((a) => a.nis === s.nis);
                const h = sAbs.filter((a) => a.status === 'Hadir').length;
                const sakit = sAbs.filter((a) => a.status === 'Sakit').length;
                const izin = sAbs.filter((a) => a.status === 'Izin').length;
                const alpa = sAbs.filter((a) => a.status === 'Alpa').length;
                const totDays = sAbs.length || 1;
                const pct = Math.round((h / totDays) * 100);

                return (
                  <tr key={s.nis} className="border-b border-slate-200">
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-mono">{s.nis}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{s.nama}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700">{h}</td>
                    <td className="p-2 border border-slate-300 text-center text-amber-700">{sakit}</td>
                    <td className="p-2 border border-slate-300 text-center text-sky-700">{izin}</td>
                    <td className="p-2 border border-slate-300 text-center text-rose-700">{alpa}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {(() => {
                let totH = 0;
                let totS = 0;
                let totI = 0;
                let totA = 0;
                let totRec = 0;

                displayedSiswaList.forEach((s) => {
                  const sAbs = monthAbsensi.filter((a) => a.nis === s.nis);
                  totH += sAbs.filter((a) => a.status === 'Hadir').length;
                  totS += sAbs.filter((a) => a.status === 'Sakit').length;
                  totI += sAbs.filter((a) => a.status === 'Izin').length;
                  totA += sAbs.filter((a) => a.status === 'Alpa').length;
                  totRec += sAbs.length;
                });

                const avgPct = totRec > 0 ? Math.round((totH / totRec) * 100) : 100;

                return (
                  <tr className="bg-slate-200 dark:bg-slate-700 font-extrabold uppercase text-[10px]">
                    <td colSpan={3} className="p-2 border border-slate-300 text-center font-extrabold text-slate-800">
                      JUMLAH TOTAL
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-emerald-800 font-extrabold">{totH}</td>
                    <td className="p-2 border border-slate-300 text-center text-amber-800 font-extrabold">{totS}</td>
                    <td className="p-2 border border-slate-300 text-center text-sky-800 font-extrabold">{totI}</td>
                    <td className="p-2 border border-slate-300 text-center text-rose-800 font-extrabold">{totA}</td>
                    <td className="p-2 border border-slate-300 text-center font-extrabold">{avgPct}%</td>
                  </tr>
                );
              })()}
            </tfoot>
          </table>
        </div>

        {/* Section 2: Evaluasi Jurnal 7 Kebiasaan Anak Indonesia Hebat */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 text-slate-800">
            II. Evaluasi Pembiasaan Karakter (Jurnal 7 Kebiasaan)
          </h4>
          <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                <th className="p-2 border border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border border-slate-300">Nama Siswa</th>
                <th className="p-2 border border-slate-300 text-center">Terbiasa</th>
                <th className="p-2 border border-slate-300 text-center">Tidak Terbiasa</th>
                <th className="p-2 border border-slate-300 text-center">Skor %</th>
                <th className="p-2 border border-slate-300 text-center">Predikat Evaluasi</th>
              </tr>
            </thead>
            <tbody>
              {displayedSiswaList.map((s, idx) => {
                const sRecords = monthKebiasaan.filter((k) => k.siswaId === s.nis);
                const sSum = calculateHabitSummary(sRecords);

                return (
                  <tr key={s.nis} className="border-b border-slate-200">
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{s.nama}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700">
                      {sSum.overallHabituatedCount} Checklist
                    </td>
                    <td className="p-2 border border-slate-300 text-center text-amber-700">
                      {sSum.overallTotalChecks - sSum.overallHabituatedCount} Checklist
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-sky-700">
                      {sSum.percentage}%
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-semibold">
                      {sSum.statusLabel}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 3: Rekapitulasi Tabungan Siswa */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase border-b border-slate-300 pb-1 text-slate-800">
            III. Rekapitulasi Keuangan & Tabungan Siswa
          </h4>
          <table className="w-full text-[11px] text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 font-bold uppercase text-[10px]">
                <th className="p-2 border border-slate-300 w-10 text-center">No</th>
                <th className="p-2 border border-slate-300">Nama Siswa</th>
                <th className="p-2 border border-slate-300 text-right">Setoran Bulan Ini</th>
                <th className="p-2 border border-slate-300 text-right">Penarikan Bulan Ini</th>
                <th className="p-2 border border-slate-300 text-right">Saldo Akhir Tabungan</th>
              </tr>
            </thead>
            <tbody>
              {displayedSiswaList.map((s, idx) => {
                const sTxs = monthTabungan.filter((t) => t.siswaId === s.nis);
                const mSetor = sTxs.filter((t) => t.jenis === 'setor').reduce((a, b) => a + b.nominal, 0);
                const mTarik = sTxs.filter((t) => t.jenis === 'tarik').reduce((a, b) => a + b.nominal, 0);

                return (
                  <tr key={s.nis} className="border-b border-slate-200">
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{s.nama}</td>
                    <td className="p-2 border border-slate-300 text-right font-semibold text-emerald-700">
                      Rp {mSetor.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-semibold text-rose-700">
                      Rp {mTarik.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-bold text-slate-900">
                      Rp {(s.saldo || 0).toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              {(() => {
                const totalSetor = displayedSiswaList.reduce((acc, s) => {
                  const sTxs = monthTabungan.filter((t) => t.siswaId === s.nis);
                  return acc + sTxs.filter((t) => t.jenis === 'setor').reduce((a, b) => a + b.nominal, 0);
                }, 0);

                const totalTarik = displayedSiswaList.reduce((acc, s) => {
                  const sTxs = monthTabungan.filter((t) => t.siswaId === s.nis);
                  return acc + sTxs.filter((t) => t.jenis === 'tarik').reduce((a, b) => a + b.nominal, 0);
                }, 0);

                const totalSaldo = displayedSiswaList.reduce((acc, s) => acc + (s.saldo || 0), 0);

                return (
                  <tr className="bg-slate-200 dark:bg-slate-700 font-extrabold uppercase text-[10px]">
                    <td colSpan={2} className="p-2 border border-slate-300 text-center font-extrabold text-slate-800">
                      JUMLAH TOTAL
                    </td>
                    <td className="p-2 border border-slate-300 text-right text-emerald-800 font-extrabold">
                      Rp {totalSetor.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 border border-slate-300 text-right text-rose-800 font-extrabold">
                      Rp {totalTarik.toLocaleString('id-ID')}
                    </td>
                    <td className="p-2 border border-slate-300 text-right text-slate-900 font-extrabold">
                      Rp {totalSaldo.toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })()}
            </tfoot>
          </table>
        </div>

        {/* Signature Blocks */}
        <div className="pt-10 flex justify-between items-end text-xs font-semibold">
          <div className="text-center space-y-12">
            <p>
              Mengetahui,<br />
              Kepala Sekolah {schoolSettings?.namaSekolah || ''}
            </p>
            <div>
              <p className="font-bold underline underline-offset-4">
                ( {schoolSettings?.kepalaSekolah || 'Dr. Hj. Siti Aminah, M.Pd.'} )
              </p>
              {schoolSettings?.nipKepalaSekolah && (
                <p className="text-[10px] text-slate-600 font-normal">
                  NIP. {schoolSettings.nipKepalaSekolah}
                </p>
              )}
            </div>
          </div>

          <div className="text-center space-y-12">
            <p>
              Wali Kelas {schoolSettings?.kelas || '5-A'},<br />
              Guru Pembimbing
            </p>
            <div>
              <p className="font-bold underline underline-offset-4">
                ( {schoolSettings?.namaGuru || 'Bpk. Rusnoto, S.Pd.SD'} )
              </p>
              {schoolSettings?.nipGuru && (
                <p className="text-[10px] text-slate-600 font-normal">
                  NIP. {schoolSettings.nipGuru}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
