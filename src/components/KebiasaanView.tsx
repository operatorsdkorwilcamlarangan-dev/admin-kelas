import React, { useState } from 'react';
import {
  Calendar,
  Save,
  CheckCircle2,
  Sun,
  HeartHandshake,
  Activity,
  Apple,
  Users,
  BookOpen,
  Moon,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { KebiasaanRecord, Siswa, Role } from '../types';
import { HABIT_DEFINITIONS } from '../data/habitData';

interface KebiasaanViewProps {
  siswaList: Siswa[];
  kebiasaanList: KebiasaanRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
  onSaveKebiasaan: (record: KebiasaanRecord) => void;
}

export const KebiasaanView: React.FC<KebiasaanViewProps> = ({
  siswaList,
  kebiasaanList,
  currentUserRole,
  currentUserNis,
  onSaveKebiasaan,
}) => {
  const isGuru = currentUserRole === 'guru';
  const today = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedSiswaNis, setSelectedSiswaNis] = useState<string>(
    isGuru ? siswaList[0]?.nis || '2024001' : currentUserNis || '2024001'
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active record for selected student & date
  const activeRecord = kebiasaanList.find(
    (k) => k.siswaId === selectedSiswaNis && k.tanggal === selectedDate
  ) || {
    id: `keb-${selectedSiswaNis}-${selectedDate}`,
    siswaId: selectedSiswaNis,
    tanggal: selectedDate,
    waktuBangun: '04:45',
    sholatList: ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'],
    olahragaDetail: '',
    menuMakan: '',
    kegiatanMasyarakat: '',
    kegiatanBelajar: '',
    waktuTidur: '21:00',
    verifikasiOrtu: false,
    catatanOrtu: '',
    feedbackGuru: '',
  };

  const [formState, setFormState] = useState<KebiasaanRecord>(activeRecord);

  // Sync state if student/date changes
  React.useEffect(() => {
    setFormState(activeRecord);
  }, [selectedSiswaNis, selectedDate, kebiasaanList]);

  const handleSholatToggle = (sholatKey: string) => {
    const list = formState.sholatList || [];
    const newList = list.includes(sholatKey)
      ? list.filter((s) => s !== sholatKey)
      : [...list, sholatKey];
    setFormState({ ...formState, sholatList: newList });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKebiasaan(formState);
    setSuccessMsg('Jurnal 7 Kebiasaan berhasil disimpan ke Cloud!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const activeSiswa = siswaList.find((s) => s.nis === selectedSiswaNis);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Borang Jurnal Harian Kebiasaan
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              7 Kebiasaan Anak Indonesia Hebat
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isGuru
                ? `Melihat & memberi umpan balik jurnal murid: ${activeSiswa?.nama}`
                : `Input kegiatan harian ${activeSiswa?.nama} dengan verifikasi Orang Tua`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-none"
              />
            </div>

            {isGuru && (
              <select
                value={selectedSiswaNis}
                onChange={(e) => setSelectedSiswaNis(e.target.value)}
                className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none"
              >
                {siswaList.map((s) => (
                  <option key={s.nis} value={s.nis}>
                    {s.nama} ({s.nis})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Bangun Pagi */}
          <div className="p-5 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <Sun className="w-5 h-5 text-amber-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Bangun Pagi Tepat Waktu
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Waktu bangun pagi hari ini (Kriteria Terbiasa: ≤ 05.00 WIB)
            </p>
            <div className="pl-9 pt-1">
              <input
                type="time"
                value={formState.waktuBangun || '04:45'}
                onChange={(e) => setFormState({ ...formState, waktuBangun: e.target.value })}
                required
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* 2. Beribadah */}
          <div className="p-5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Beribadah Tepat Waktu (Sholat 5 Waktu)
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Centang ibadah fardhu yang dikerjakan hari ini (Kriteria Terbiasa: 5 Waktu lengkap)
            </p>
            <div className="pl-9 pt-1 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((s) => {
                const isChecked = (formState.sholatList || []).includes(s);
                return (
                  <label
                    key={s}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold'
                        : 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSholatToggle(s)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="text-xs capitalize">{s}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 3. Berolahraga */}
          <div className="p-5 bg-rose-50/70 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <Activity className="w-5 h-5 text-rose-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Berolahraga & Aktivitas Fisik
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Jenis olahraga / senam / aktivitas fisik yang dilakukan
            </p>
            <div className="pl-9 pt-1">
              <input
                type="text"
                value={formState.olahragaDetail || ''}
                onChange={(e) => setFormState({ ...formState, olahragaDetail: e.target.value })}
                placeholder="Contoh: Lari pagi 20 menit, Senam sehat bersama keluarga"
                className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-rose-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* 4. Makan Bergizi */}
          <div className="p-5 bg-lime-50/70 dark:bg-lime-950/30 rounded-2xl border border-lime-200 dark:border-lime-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-lime-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </span>
              <Apple className="w-5 h-5 text-lime-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Makan Bergizi & Sehat
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Menu makanan seimbang yang dikonsumsi hari ini
            </p>
            <div className="pl-9 pt-1">
              <input
                type="text"
                value={formState.menuMakan || ''}
                onChange={(e) => setFormState({ ...formState, menuMakan: e.target.value })}
                placeholder="Contoh: Nasi, Sayur Bening Bayam, Telur Rebus, Apel Segar"
                className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-lime-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-lime-400"
              />
            </div>
          </div>

          {/* 5. Bermasyarakat */}
          <div className="p-5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                5
              </span>
              <Users className="w-5 h-5 text-indigo-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Bermasyarakat & Gotong Royong
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Aksi sosial, membantu rumah tangga, atau gotong royong lingkungan
            </p>
            <div className="pl-9 pt-1">
              <input
                type="text"
                value={formState.kegiatanMasyarakat || ''}
                onChange={(e) =>
                  setFormState({ ...formState, kegiatanMasyarakat: e.target.value })
                }
                placeholder="Contoh: Membantu menyapu halaman rumah bersama tetangga"
                className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* 6. Gemar Belajar */}
          <div className="p-5 bg-sky-50/70 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                6
              </span>
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Gemar Belajar & Literasi
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Materi pelajaran yang diulang atau buku cerita yang dibaca
            </p>
            <div className="pl-9 pt-1">
              <input
                type="text"
                value={formState.kegiatanBelajar || ''}
                onChange={(e) => setFormState({ ...formState, kegiatanBelajar: e.target.value })}
                placeholder="Contoh: Membaca Buku IPA Bab 3 & Latihan Soal Matematika"
                className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* 7. Tidur Cepat */}
          <div className="p-5 bg-purple-50/70 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                7
              </span>
              <Moon className="w-5 h-5 text-purple-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Tidur Cepat / Istirahat Cukup
              </h5>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-9">
              Waktu tidur malam (Kriteria Terbiasa: ≤ 21.30 WIB)
            </p>
            <div className="pl-9 pt-1">
              <input
                type="time"
                value={formState.waktuTidur || '21:00'}
                onChange={(e) => setFormState({ ...formState, waktuTidur: e.target.value })}
                required
                className="px-4 py-2 text-xs font-bold bg-white dark:bg-slate-800 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Verifikasi Orang Tua & Umpan Balik Guru */}
          <div className="p-6 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                Verifikasi Orang Tua & Umpan Balik Guru
              </h5>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verifikasiOrtuCheck"
                checked={formState.verifikasiOrtu}
                onChange={(e) => setFormState({ ...formState, verifikasiOrtu: e.target.checked })}
                className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
              />
              <label
                htmlFor="verifikasiOrtuCheck"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Saya (Orang Tua) mengonfirmasi bahwa data 7 Kebiasaan di atas diisi secara jujur.
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Catatan Pesan Orang Tua (Opsional)
              </label>
              <textarea
                rows={2}
                value={formState.catatanOrtu || ''}
                onChange={(e) => setFormState({ ...formState, catatanOrtu: e.target.value })}
                placeholder="Pesan perkembangan anak dari orang tua untuk guru wali kelas..."
                className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {isGuru && (
              <div>
                <label className="block text-xs font-semibold text-sky-700 dark:text-sky-300 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" /> Umpan Balik / Apresiasi Guru Wali Kelas
                </label>
                <textarea
                  rows={2}
                  value={formState.feedbackGuru || ''}
                  onChange={(e) => setFormState({ ...formState, feedbackGuru: e.target.value })}
                  placeholder="Apresiasi dan motivasi guru untuk murid..."
                  className="w-full p-2.5 text-xs bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-600/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Jurnal 7 Kebiasaan Ke Cloud</span>
          </button>
        </form>
      </div>
    </div>
  );
};
