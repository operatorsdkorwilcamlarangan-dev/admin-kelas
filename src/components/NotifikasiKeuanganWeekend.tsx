import React, { useState } from 'react';
import {
  BellRing,
  Send,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  Share2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Siswa, TabunganRecord, WeekendReminderSetting, AppNotification } from '../types';
import { CloudSyncService } from '../services/cloudSync';

interface NotifikasiKeuanganWeekendProps {
  siswaList: Siswa[];
  tabunganList: TabunganRecord[];
  notifications: AppNotification[];
  onRefreshNotifications: () => void;
}

export const NotifikasiKeuanganWeekend: React.FC<NotifikasiKeuanganWeekendProps> = ({
  siswaList,
  tabunganList,
  notifications,
  onRefreshNotifications,
}) => {
  const [setting, setSetting] = useState<WeekendReminderSetting>(
    CloudSyncService.getWeekendReminder()
  );
  const [testSentMessage, setTestSentMessage] = useState<string | null>(null);

  const totalClassSavings = siswaList.reduce((acc, curr) => acc + (curr.saldo || 0), 0);
  const avgSavings = siswaList.length > 0 ? Math.round(totalClassSavings / siswaList.length) : 0;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = tabunganList.filter((t) => t.tanggal.startsWith(currentMonth));
  const totalMonthlyDeposits = monthlyTransactions
    .filter((t) => t.jenis === 'setor')
    .reduce((acc, curr) => acc + curr.nominal, 0);

  const handleSaveSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    await CloudSyncService.saveWeekendReminder(setting);
    setTestSentMessage('Pengaturan pengingat akhir pekan berhasil disimpan!');
    setTimeout(() => setTestSentMessage(null), 3000);
  };

  const handleTriggerTestReminder = async () => {
    const alertTitle = 'Pengingat Keuangan Akhir Pekan';
    const alertMsg = `[Rekap Sabtu/Minggu]: Total tabungan kelas hingga akhir pekan ini mencapai Rp ${totalClassSavings.toLocaleString(
      'id-ID'
    )}. Terima kasih dukungan Ayah/Bunda!`;

    await CloudSyncService.addNotification({
      title: alertTitle,
      message: alertMsg,
      type: 'savings',
      timestamp: new Date().toISOString(),
      read: false,
    });

    onRefreshNotifications();
    setTestSentMessage('Pengingat akhir pekan berhasil dikirimkan ke daftar notifikasi!');
    setTimeout(() => setTestSentMessage(null), 4000);
  };

  const handleGenerateWhatsappText = (s: Siswa) => {
    const text = `Yth. Bapak/Ibu ${s.namaOrtu || 'Orang Tua'},\nBerikut pengingat akhir pekan progres tabungan Ananda *${
      s.nama
    }* (Kelas 5-A):\n- Saldo Tabungan: *Rp ${(s.saldo || 0).toLocaleString(
      'id-ID'
    )}*\n- Target Tabungan: *Rp ${(s.targetTabungan || 200000).toLocaleString(
      'id-ID'
    )}*\n\nMari tingkatkan kebiasaan hemat dan gemar menabung di minggu mendatang. Terima kasih! 🙏`;

    navigator.clipboard.writeText(text);
    setTestSentMessage(`Teks WA Pengingat untuk ${s.nama} telah disalin ke Clipboard!`);
    setTimeout(() => setTestSentMessage(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-700 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Fitur Otomasi Pengingat Akhir Pekan
          </span>
        </div>
        <h3 className="text-xl font-bold">Fitur Notifikasi Pengingat Progres Keuangan</h3>
        <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
          Sistem secara berkala setiap akhir pekan (Sabtu / Minggu) memicu notifikasi rekap
          kemajuan tabungan siswa kepada orang tua, membantu menumbuhkan kebiasaan hemat &
          akuntabilitas finansial sejak dini.
        </p>
      </div>

      {testSentMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{testSentMessage}</span>
        </div>
      )}

      {/* Grid Configuration & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configure Schedule Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <BellRing className="w-5 h-5 text-sky-600" />
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Jadwal Pengingat Akhir Pekan
            </h4>
          </div>

          <form onSubmit={handleSaveSetting} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Pengingat Aktif
              </span>
              <input
                type="checkbox"
                checked={setting.enabled}
                onChange={(e) => setSetting({ ...setting, enabled: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Hari Kirim Pengingat
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <select
                  value={setting.day}
                  onChange={(e) =>
                    setSetting({ ...setting, day: e.target.value as 'Sabtu' | 'Minggu' })
                  }
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Sabtu">Setiap Hari Sabtu</option>
                  <option value="Minggu">Setiap Hari Minggu</option>
                  <option value="Setiap Akhir Pekan">Sabtu & Minggu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Waktu Kirim (WIB)
              </label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={setting.time}
                  onChange={(e) => setSetting({ ...setting, time: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Pesan Notifikasi Kustom
              </label>
              <textarea
                rows={3}
                value={setting.customMessage}
                onChange={(e) => setSetting({ ...setting, customMessage: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition-all"
              >
                Simpan Jadwal Pengingat
              </button>

              <button
                type="button"
                onClick={handleTriggerTestReminder}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Uji Coba Sekarang</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview & Direct WA Sender */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Saldo Tabungan</p>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Rp {totalClassSavings.toLocaleString('id-ID')}
                </h4>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Rata-rata: Rp {avgSavings.toLocaleString('id-ID')} / siswa
                </p>
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Setoran Bulan Ini</p>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Rp {totalMonthlyDeposits.toLocaleString('id-ID')}
                </h4>
                <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                  {monthlyTransactions.length} Transaksi Tercatat
                </p>
              </div>
            </div>
          </div>

          {/* Student Direct Reminder Generator Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Kirim Pesan WhatsApp Pengingat Akhir Pekan
                </h4>
                <p className="text-xs text-slate-500">
                  Salin draf laporan kemajuan tabungan siswa untuk dikirim ke grup/WAG Orang Tua
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-lg">Siswa</th>
                    <th className="p-3">Orang Tua / WA</th>
                    <th className="p-3">Saldo</th>
                    <th className="p-3">Target</th>
                    <th className="p-3 rounded-r-lg text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {siswaList.map((s) => {
                    const target = s.targetTabungan || 200000;
                    const pct = Math.min(100, Math.round(((s.saldo || 0) / target) * 100));

                    return (
                      <tr key={s.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {s.nama}
                          <span className="block text-[10px] text-slate-400 font-mono">
                            NIS: {s.nis}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 dark:text-slate-400">
                          {s.namaOrtu || '-'}
                          <span className="block text-[10px] text-slate-400">{s.noHp}</span>
                        </td>
                        <td className="p-3 font-bold text-emerald-600">
                          Rp {(s.saldo || 0).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3">
                          <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-1 overflow-hidden">
                            <div
                              className="bg-sky-600 h-2 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500">{pct}% tercapai</span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleGenerateWhatsappText(s)}
                            className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 ml-auto"
                            title="Salin Teks Pesan Pengingat"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Salin WA</span>
                          </button>
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
    </div>
  );
};
