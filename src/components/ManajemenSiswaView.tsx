import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Key, CheckCircle2 } from 'lucide-react';
import { Siswa } from '../types';

interface ManajemenSiswaViewProps {
  siswaList: Siswa[];
  onSaveSiswa: (siswa: Siswa) => void;
  onDeleteSiswa: (nis: string) => void;
}

export const ManajemenSiswaView: React.FC<ManajemenSiswaViewProps> = ({
  siswaList,
  onSaveSiswa,
  onDeleteSiswa,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editSiswa, setEditSiswa] = useState<Siswa | null>(null);

  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [password, setPassword] = useState('123');
  const [namaOrtu, setNamaOrtu] = useState('');
  const [noHp, setNoHp] = useState('');
  const [targetTabungan, setTargetTabungan] = useState('200000');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const openAddModal = () => {
    setEditSiswa(null);
    setNis(`202400${siswaList.length + 1}`);
    setNama('');
    setPassword('123');
    setNamaOrtu('');
    setNoHp('08123456789');
    setTargetTabungan('200000');
    setShowModal(true);
  };

  const openEditModal = (s: Siswa) => {
    setEditSiswa(s);
    setNis(s.nis);
    setNama(s.nama);
    setPassword(s.password || '123');
    setNamaOrtu(s.namaOrtu || '');
    setNoHp(s.noHp || '');
    setTargetTabungan((s.targetTabungan || 200000).toString());
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSiswa: Siswa = {
      id: nis,
      nis,
      nama,
      kelas: '5-A',
      username: nis,
      password,
      namaOrtu,
      noHp,
      saldo: editSiswa ? editSiswa.saldo : 0,
      targetTabungan: parseInt(targetTabungan, 10) || 200000,
    };

    onSaveSiswa(newSiswa);
    setShowModal(false);
    setSuccessMsg(`Data murid ${nama} berhasil disimpan ke Cloud!`);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" /> Manajemen Data Siswa Kelas 5-A
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data murid, kredensial PIN login NIS, dan target tabungan
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Murid Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-5">NIS / Username</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Orang Tua / Wali</th>
                <th className="p-3">No. HP / WA</th>
                <th className="p-3">PIN Login</th>
                <th className="p-3 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {siswaList.map((s) => (
                <tr key={s.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 pl-5 font-mono font-bold text-slate-700 dark:text-slate-300">
                    {s.nis}
                  </td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {s.nama}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{s.namaOrtu || '-'}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono">
                    {s.noHp || '-'}
                  </td>
                  <td className="p-3 font-mono font-bold text-sky-600">
                    {s.password || '123'}
                  </td>
                  <td className="p-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Edit Data"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Yakin menghapus murid ${s.nama}?`)) {
                            onDeleteSiswa(s.nis);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg"
                        title="Hapus Murid"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              {editSiswa ? 'Edit Data Murid' : 'Tambah Murid Baru'}
            </h4>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    NIS (Nomor Induk)
                  </label>
                  <input
                    type="text"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    required
                    disabled={!!editSiswa}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    PIN Login Siswa
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  placeholder="Nama lengkap..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={namaOrtu}
                    onChange={(e) => setNamaOrtu(e.target.value)}
                    placeholder="Nama orang tua"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    No. HP / WA
                  </label>
                  <input
                    type="text"
                    value={noHp}
                    onChange={(e) => setNoHp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Target Tabungan (Rp)
                </label>
                <input
                  type="number"
                  value={targetTabungan}
                  onChange={(e) => setTargetTabungan(e.target.value)}
                  placeholder="200000"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold"
                >
                  Simpan Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
