import React, { useState } from 'react';
import { Bookmark, Plus, CheckCircle2 } from 'lucide-react';
import { CatatanGuruRecord, Siswa, Role } from '../types';

interface CatatanAnekdotViewProps {
  siswaList: Siswa[];
  catatanList: CatatanGuruRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
  onAddCatatan: (record: Omit<CatatanGuruRecord, 'id'>) => void;
}

export const CatatanAnekdotView: React.FC<CatatanAnekdotViewProps> = ({
  siswaList,
  catatanList,
  currentUserRole,
  currentUserNis,
  onAddCatatan,
}) => {
  const isGuru = currentUserRole === 'guru';
  const today = new Date().toISOString().split('T')[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSiswaNis, setSelectedSiswaNis] = useState(
    siswaList[0]?.nis || '2024001'
  );
  const [kategori, setKategori] = useState<
    'Prestasi' | 'Perilaku' | 'Kedisiplinan' | 'Evaluasi'
  >('Prestasi');
  const [deskripsi, setDeskripsi] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const displayList = isGuru
    ? catatanList
    : catatanList.filter((c) => c.siswaId === currentUserNis);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCatatan({
      siswaId: selectedSiswaNis,
      tanggal: today,
      kategori,
      deskripsi,
      tindakLanjut,
    });

    setShowAddModal(false);
    setDeskripsi('');
    setTindakLanjut('');
    setSuccessMsg('Catatan anekdot berhasil disimpan!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-sky-600" /> Catatan Anekdot & Observasi Murid
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Catatan peristiwa khusus, perilaku positif, prestasi, dan rencana tindak lanjut bimbingan
          </p>
        </div>

        {isGuru && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* List */}
      <div className="space-y-4">
        {displayList.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
            Belum ada catatan anekdot.
          </div>
        ) : (
          displayList.map((item) => {
            const siswa = siswaList.find((s) => s.nis === item.siswaId);

            return (
              <div
                key={item.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.kategori === 'Prestasi'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.kategori === 'Perilaku'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {item.kategori}
                    </span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-100">
                      Siswa: {siswa?.nama || item.siswaId}
                    </h5>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.tanggal}</span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-800 dark:text-slate-100">Deskripsi:</strong>{' '}
                  {item.deskripsi}
                </p>

                {item.tindakLanjut && (
                  <p className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-800 dark:text-slate-200">Tindak Lanjut:</strong>{' '}
                    {item.tindakLanjut}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Tambah Catatan Anekdot Guru
            </h4>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Pilih Siswa
                </label>
                <select
                  value={selectedSiswaNis}
                  onChange={(e) => setSelectedSiswaNis(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  {siswaList.map((s) => (
                    <option key={s.nis} value={s.nis}>
                      {s.nama} ({s.nis})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                >
                  <option value="Prestasi">Prestasi</option>
                  <option value="Perilaku">Perilaku Positif</option>
                  <option value="Kedisiplinan">Kedisiplinan</option>
                  <option value="Evaluasi">Evaluasi Belajar</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Deskripsi Kejadian / Peristiwa
                </label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  required
                  placeholder="Tuliskan peristiwa khusus secara mendetail..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Rencana Tindak Lanjut Guru
                </label>
                <input
                  type="text"
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  placeholder="Rencana apresiasi atau bimbingan..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
