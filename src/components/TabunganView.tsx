import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  List,
  CheckCircle2,
} from 'lucide-react';
import { TabunganRecord, Siswa, Role, JenisTransaksiTabungan } from '../types';

interface TabunganViewProps {
  siswaList: Siswa[];
  tabunganList: TabunganRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
  onAddTransaction: (tx: Omit<TabunganRecord, 'id'>, newSaldo: number) => void;
}

export const TabunganView: React.FC<TabunganViewProps> = ({
  siswaList,
  tabunganList,
  currentUserRole,
  currentUserNis,
  onAddTransaction,
}) => {
  const isGuru = currentUserRole === 'guru';
  const today = new Date().toISOString().split('T')[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSiswaNis, setSelectedSiswaNis] = useState(
    siswaList[0]?.nis || '2024001'
  );
  const [jenisTx, setJenisTx] = useState<JenisTransaksiTabungan>('setor');
  const [nominalTx, setNominalTx] = useState<string>('50000');
  const [tanggalTx, setTanggalTx] = useState<string>(today);
  const [ketTx, setKetTx] = useState<string>('Setoran rutin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [detailModalNis, setDetailModalNis] = useState<string | null>(null);

  const displaySiswaList = isGuru
    ? siswaList
    : siswaList.filter((s) => s.nis === currentUserNis);

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    const siswa = siswaList.find((s) => s.nis === selectedSiswaNis);
    if (!siswa) return;

    const nom = parseInt(nominalTx, 10);
    if (isNaN(nom) || nom <= 0) {
      setErrorMsg('Nominal transaksi harus lebih dari 0.');
      return;
    }

    const curSaldo = siswa.saldo || 0;
    if (jenisTx === 'tarik' && nom > curSaldo) {
      setErrorMsg('Gagal: Saldo tabungan murid tidak mencukupi!');
      return;
    }

    const newSaldo = jenisTx === 'setor' ? curSaldo + nom : curSaldo - nom;

    onAddTransaction(
      {
        siswaId: siswa.nis,
        nis: siswa.nis,
        nama: siswa.nama,
        tanggal: tanggalTx,
        jenis: jenisTx,
        nominal: nom,
        keterangan: ketTx,
        saldoAkhir: newSaldo,
      },
      newSaldo
    );

    setShowAddModal(false);
    setErrorMsg(null);
    setSuccessMsg(`Transaksi ${jenisTx} Rp ${nom.toLocaleString('id-ID')} berhasil dicatat!`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const studentUser = !isGuru
    ? siswaList.find((s) => s.nis === currentUserNis)
    : null;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Student View Banner */}
      {!isGuru && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-xl space-y-2">
          <p className="text-xs text-emerald-100 font-bold">Saldo Tabungan Anda Saat Ini</p>
          <h2 className="text-3xl font-black">
            Rp {(studentUser?.saldo || 0).toLocaleString('id-ID')}
          </h2>
          <p className="text-xs text-emerald-100 opacity-90">
            Target Tabungan: Rp {(studentUser?.targetTabungan || 200000).toLocaleString('id-ID')}
          </p>
        </div>
      )}

      {/* Teacher View Header & Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Manajemen Tabungan Siswa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pencatatan setoran & penarikan dana tabungan siswa secara real-time
          </p>
        </div>

        {isGuru && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi Baru</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Student Balances List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-5">NIS</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Nama Orang Tua</th>
                <th className="p-3">Saldo Tabungan</th>
                <th className="p-3 pr-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displaySiswaList.map((siswa) => (
                <tr key={siswa.nis} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 pl-5 font-mono text-slate-500">{siswa.nis}</td>
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                    {siswa.nama}
                  </td>
                  <td className="p-3 text-slate-500">{siswa.namaOrtu || '-'}</td>
                  <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                    Rp {(siswa.saldo || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3 pr-5 text-right">
                    <button
                      onClick={() => setDetailModalNis(siswa.nis)}
                      className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 hover:bg-sky-100 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Riwayat</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Input Transaksi Tabungan Baru
            </h4>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateTx} className="space-y-4 text-xs">
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
                      {s.nama} ({s.nis}) - Saldo: Rp {(s.saldo || 0).toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Jenis Transaksi
                  </label>
                  <select
                    value={jenisTx}
                    onChange={(e) => setJenisTx(e.target.value as JenisTransaksiTabungan)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    <option value="setor">Setor (+)</option>
                    <option value="tarik">Tarik (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    value={tanggalTx}
                    onChange={(e) => setTanggalTx(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nominal (Rp)
                </label>
                <input
                  type="number"
                  value={nominalTx}
                  onChange={(e) => setNominalTx(e.target.value)}
                  required
                  min="1000"
                  step="1000"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Keterangan Transaksi
                </label>
                <input
                  type="text"
                  value={ketTx}
                  onChange={(e) => setKetTx(e.target.value)}
                  placeholder="Contoh: Setoran rutin mingguan"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Transaction History */}
      {detailModalNis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Riwayat Transaksi - {siswaList.find((s) => s.nis === detailModalNis)?.nama}
              </h4>
              <button
                onClick={() => setDetailModalNis(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Tutup
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {tabunganList.filter((t) => t.siswaId === detailModalNis).length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Belum ada transaksi</p>
              ) : (
                tabunganList
                  .filter((t) => t.siswaId === detailModalNis)
                  .map((t) => (
                    <div
                      key={t.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {t.tanggal}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {t.keterangan || t.jenis}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-bold block ${
                            t.jenis === 'setor' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {t.jenis === 'setor' ? '+' : '-'} Rp {t.nominal.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Saldo: Rp {t.saldoAkhir.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
