import React, { useState } from 'react';
import { Calendar, Save, CheckCircle2, Search } from 'lucide-react';
import { Siswa, AbsensiRecord, StatusAbsensi, Role } from '../types';

interface AbsensiViewProps {
  siswaList: Siswa[];
  absensiList: AbsensiRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
  onSaveAbsensi: (records: AbsensiRecord[]) => void;
}

export const AbsensiView: React.FC<AbsensiViewProps> = ({
  siswaList,
  absensiList,
  currentUserRole,
  currentUserNis,
  onSaveAbsensi,
}) => {
  const isGuru = currentUserRole === 'guru';
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Local state for today's draft statuses
  const dateRecords = absensiList.filter((a) => a.tanggal === selectedDate);

  const [draftStatuses, setDraftStatuses] = useState<
    Record<string, { status: StatusAbsensi; keterangan: string }>
  >(() => {
    const map: Record<string, { status: StatusAbsensi; keterangan: string }> = {};
    siswaList.forEach((s) => {
      const rec = dateRecords.find((a) => a.nis === s.nis);
      map[s.nis] = {
        status: rec ? rec.status : 'Hadir',
        keterangan: rec ? rec.keterangan : '',
      };
    });
    return map;
  });

  const handleStatusChange = (nis: string, status: StatusAbsensi) => {
    setDraftStatuses((prev) => ({
      ...prev,
      [nis]: { ...prev[nis], status },
    }));
  };

  const handleKeteranganChange = (nis: string, keterangan: string) => {
    setDraftStatuses((prev) => ({
      ...prev,
      [nis]: { ...prev[nis], keterangan },
    }));
  };

  const handleSave = () => {
    const updatedRecords: AbsensiRecord[] = siswaList.map((s) => {
      const draft = draftStatuses[s.nis] || { status: 'Hadir', keterangan: '' };
      return {
        id: `abs-${s.nis}-${selectedDate}`,
        siswaId: s.nis,
        nis: s.nis,
        nama: s.nama,
        tanggal: selectedDate,
        status: draft.status,
        keterangan: draft.keterangan,
      };
    });

    onSaveAbsensi(updatedRecords);
    setSuccessMsg(`Presensi tanggal ${selectedDate} berhasil disimpan!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  if (!isGuru) {
    const myAbsensi = absensiList.filter((a) => a.nis === currentUserNis);

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
            Riwayat Kehadiran Presensi Anda
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
                <tr>
                  <th className="p-3 rounded-l-lg">Tanggal</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-lg">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myAbsensi.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-slate-400">
                      Belum ada riwayat absensi.
                    </td>
                  </tr>
                ) : (
                  myAbsensi.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">
                        {item.tanggal}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            item.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.status === 'Sakit'
                              ? 'bg-amber-100 text-amber-700'
                              : item.status === 'Izin'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{item.keterangan || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Save Button */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            Pencatatan Presensi Kehadiran Kelas
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tentukan status kehadiran murid dan simpan ke Cloud
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent focus:outline-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Presensi</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Attendance Form Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-5">NIS</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3 text-center">Status Kehadiran</th>
                <th className="p-3 pr-5">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {siswaList.map((siswa) => {
                const currentDraft = draftStatuses[siswa.nis] || {
                  status: 'Hadir',
                  keterangan: '',
                };

                return (
                  <tr key={siswa.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 pl-5 font-mono text-slate-500">{siswa.nis}</td>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                      {siswa.nama}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as StatusAbsensi[]).map((st) => {
                          const isSelected = currentDraft.status === st;
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(siswa.nis, st)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                                isSelected
                                  ? st === 'Hadir'
                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                    : st === 'Sakit'
                                    ? 'bg-amber-500 text-white border-amber-500'
                                    : st === 'Izin'
                                    ? 'bg-sky-500 text-white border-sky-500'
                                    : 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-3 pr-5">
                      <input
                        type="text"
                        value={currentDraft.keterangan}
                        onChange={(e) => handleKeteranganChange(siswa.nis, e.target.value)}
                        placeholder="Catatan tambahan..."
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
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
