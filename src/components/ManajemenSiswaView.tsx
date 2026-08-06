import React, { useState, useRef } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  Download,
  HelpCircle,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import { Siswa } from '../types';

interface ManajemenSiswaViewProps {
  siswaList: Siswa[];
  onSaveSiswa: (siswa: Siswa) => void;
  onImportSiswaBatch?: (siswaList: Siswa[]) => void;
  onDeleteSiswa: (nis: string) => void;
}

export const ManajemenSiswaView: React.FC<ManajemenSiswaViewProps> = ({
  siswaList,
  onSaveSiswa,
  onImportSiswaBatch,
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

  // Import / Export States
  const [showImportModal, setShowImportModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [parsedImportList, setParsedImportList] = useState<Siswa[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Unduh Format Template CSV
  const handleDownloadTemplate = () => {
    const csvContent =
      'nis;nama;namaOrtu;noHp;targetTabungan;password\n' +
      '2024005;Budi Pratama;Bpk. Pratama;08123456789;200000;123\n' +
      '2024006;Citra Kirana;Ibu Kirana;08129876543;200000;123\n' +
      '2024007;Doni Kusuma;Bpk. Kusuma;085211223344;250000;123';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Format_Impor_Data_Siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Ekspor Data Siswa ke CSV
  const handleExportCSV = () => {
    let csv = 'NIS;Nama Siswa;Nama Ortu;No HP / WA;Target Tabungan (Rp);Saldo Current (Rp);PIN Login\n';
    siswaList.forEach((s) => {
      csv += `${s.nis};${s.nama};${s.namaOrtu || ''};${s.noHp || ''};${s.targetTabungan || 200000};${s.saldo || 0};${s.password || '123'}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Data_Siswa_Kelas_5A_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler Upload File Impor
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error('File kosong atau tidak dapat dibaca');

        let newList: Siswa[] = [];

        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          const rawArr = Array.isArray(json) ? json : json.siswa || [];
          newList = rawArr.map((item: any, idx: number) => {
            const itemNis = String(item.nis || item.NIS || `202400${idx + 10}`);
            const existing = siswaList.find((s) => s.nis === itemNis);
            return {
              id: itemNis,
              nis: itemNis,
              nama: item.nama || item.Nama || item['Nama Siswa'] || 'Siswa Baru',
              kelas: '5-A',
              username: itemNis,
              password: String(item.password || item.PIN || item.pin || '123'),
              namaOrtu: item.namaOrtu || item['Nama Ortu'] || item.ortu || '',
              noHp: String(item.noHp || item['No HP'] || item.phone || ''),
              saldo: existing ? existing.saldo : Number(item.saldo) || 0,
              targetTabungan: Number(item.targetTabungan || item['Target Tabungan']) || 200000,
            };
          });
        } else {
          // CSV Parser supporting comma (,) and semicolon (;)
          const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
          if (lines.length < 2) {
            throw new Error('File CSV harus memiliki baris header dan minimal 1 baris data murid.');
          }

          const firstLine = lines[0];
          const delimiter = firstLine.includes(';') ? ';' : ',';
          const headers = firstLine.split(delimiter).map((h) => h.trim().toLowerCase().replace(/["']/g, ''));

          const nisIdx = headers.findIndex((h) => h.includes('nis'));
          const namaIdx = headers.findIndex((h) => h.includes('nama') && !h.includes('ortu'));
          const ortuIdx = headers.findIndex((h) => h.includes('ortu'));
          const hpIdx = headers.findIndex((h) => h.includes('hp') || h.includes('wa') || h.includes('telepon'));
          const targetIdx = headers.findIndex((h) => h.includes('target'));
          const pinIdx = headers.findIndex((h) => h.includes('pin') || h.includes('password'));

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(delimiter).map((c) => c.trim().replace(/["']/g, ''));
            if (cols.length < 2) continue;

            const itemNis = (nisIdx >= 0 && cols[nisIdx]) ? cols[nisIdx] : cols[0];
            const itemNama = (namaIdx >= 0 && cols[namaIdx]) ? cols[namaIdx] : cols[1];

            if (!itemNis || !itemNama) continue;

            const itemOrtu = (ortuIdx >= 0 && cols[ortuIdx]) ? cols[ortuIdx] : (cols[2] || '');
            const itemHp = (hpIdx >= 0 && cols[hpIdx]) ? cols[hpIdx] : (cols[3] || '');
            const itemTarget = (targetIdx >= 0 && cols[targetIdx]) ? parseInt(cols[targetIdx], 10) : (cols[4] ? parseInt(cols[4], 10) : 200000);
            const itemPin = (pinIdx >= 0 && cols[pinIdx]) ? cols[pinIdx] : (cols[5] || '123');

            const existing = siswaList.find((s) => s.nis === itemNis);

            newList.push({
              id: itemNis,
              nis: itemNis,
              nama: itemNama,
              kelas: '5-A',
              username: itemNis,
              password: itemPin || '123',
              namaOrtu: itemOrtu,
              noHp: itemHp,
              saldo: existing ? existing.saldo : 0,
              targetTabungan: isNaN(itemTarget) ? 200000 : itemTarget,
            });
          }
        }

        if (newList.length === 0) {
          throw new Error('Tidak ada data siswa valid yang berhasil dibaca dari file.');
        }

        setParsedImportList(newList);
        setShowImportModal(true);
      } catch (err: any) {
        setImportError(err.message || 'Terjadi kesalahan saat mengimpor file.');
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = () => {
    if (onImportSiswaBatch) {
      onImportSiswaBatch(parsedImportList);
    } else {
      parsedImportList.forEach((s) => onSaveSiswa(s));
    }
    setShowImportModal(false);
    setSuccessMsg(`Berhasil mengimpor ${parsedImportList.length} data murid ke dalam sistem!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header & Main Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" /> Manajemen Data Siswa Kelas 5-A
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Kelola data murid, kredensial PIN login NIS, target tabungan, serta fitur impor/ekspor data kelas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Format Template Download */}
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200 dark:border-slate-700"
            title="Unduh contoh file CSV template impor"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Format Template</span>
          </button>

          {/* Impor Button */}
          <label className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all">
            <Upload className="w-4 h-4" />
            <span>Impor Data (CSV/JSON)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Ekspor Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            title="Ekspor daftar siswa saat ini ke CSV"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Data (CSV)</span>
          </button>

          {/* Tambah Manual Button */}
          <button
            onClick={openAddModal}
            className="px-3.5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Murid</span>
          </button>

          {/* Panduan Format Button */}
          <button
            onClick={() => setShowGuideModal(true)}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-xl transition-all"
            title="Petunjuk Format Impor"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {importError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>Gagal Impor: {importError}</span>
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
                <th className="p-3">Saldo / Target Tabungan</th>
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
                  <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">
                    <span className="text-emerald-600 font-bold">
                      Rp {(s.saldo || 0).toLocaleString('id-ID')}
                    </span>
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Target: Rp {(s.targetTabungan || 200000).toLocaleString('id-ID')}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-sky-600">
                    {s.password || '123'}
                  </td>
                  <td className="p-3 pr-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
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
                        className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
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

      {/* Import Preview Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-600" /> Konfirmasi Impor Data Siswa
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  File: <strong className="text-slate-700 dark:text-slate-300">{importFileName}</strong> (Ditemukan {parsedImportList.length} data murid)
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase text-[10px] sticky top-0">
                  <tr>
                    <th className="p-2.5 pl-3">NIS</th>
                    <th className="p-2.5">Nama Siswa</th>
                    <th className="p-2.5">Nama Ortu</th>
                    <th className="p-2.5">No. HP</th>
                    <th className="p-2.5">Target Tabungan</th>
                    <th className="p-2.5 pr-3">PIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parsedImportList.map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-2.5 pl-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                        {s.nis}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">
                        {s.nama}
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">{s.namaOrtu || '-'}</td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400 font-mono">{s.noHp || '-'}</td>
                      <td className="p-2.5 font-bold text-emerald-600">
                        Rp {(s.targetTabungan || 200000).toLocaleString('id-ID')}
                      </td>
                      <td className="p-2.5 pr-3 font-mono text-sky-600">{s.password || '123'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">
                Data NIS yang sudah ada akan diperbarui secara otomatis.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmImport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20"
                >
                  Proses & Simpan Impor ({parsedImportList.length} Murid)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" /> Panduan Format Impor Data Siswa
              </h4>
              <button
                onClick={() => setShowGuideModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Aplikasi mendukung pengimporan data murid secara massal melalui file <strong>CSV</strong> (Microsoft Excel) atau <strong>JSON</strong>.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-100">Header Kolom CSV:</p>
                <p className="text-sky-600 dark:text-sky-400">nis;nama;namaOrtu;noHp;targetTabungan;password</p>
                <p className="text-slate-500 pt-1">Contoh Baris Data:</p>
                <p>2024005;Budi Pratama;Bpk. Pratama;08123456789;200000;123</p>
              </div>

              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>nis</strong>: Nomor Induk Siswa (Unik & digunakan untuk login).</li>
                <li><strong>nama</strong>: Nama Lengkap Siswa.</li>
                <li><strong>namaOrtu</strong>: Nama Orang Tua / Wali murid.</li>
                <li><strong>noHp</strong>: Nomor WhatsApp / HP aktif.</li>
                <li><strong>targetTabungan</strong>: Target saldo tabungan (contoh: 200000).</li>
                <li><strong>password</strong>: PIN login siswa (default: 123).</li>
              </ul>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleDownloadTemplate}
                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Template CSV
              </button>
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
