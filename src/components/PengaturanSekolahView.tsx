import React, { useState } from 'react';
import {
  School,
  UserCheck,
  Award,
  Upload,
  Save,
  CheckCircle2,
  Building,
  Calendar,
  Layers,
  FileText,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { SchoolSettings } from '../types';

interface PengaturanSekolahViewProps {
  settings: SchoolSettings;
  onSaveSettings: (newSettings: SchoolSettings) => Promise<void> | void;
}

export const PengaturanSekolahView: React.FC<PengaturanSekolahViewProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logoSekolah: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    setFormData((prev) => ({ ...prev, logoSekolah: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onSaveSettings(formData);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <School className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Pengaturan Identitas Sekolah & Guru</h2>
              <p className="text-xs text-sky-100 mt-0.5">
                Kelola nama sekolah, kepala sekolah, wali kelas, serta logo untuk kop surat dan laporan PDF
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {isSaved && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Pengaturan sekolah berhasil disimpan dan diperbarui!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Logo Sekolah */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-sky-600" />
            Logo Sekolah
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center overflow-hidden shrink-0 relative group">
              {formData.logoSekolah ? (
                <img
                  src={formData.logoSekolah}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-400 p-2 text-center">
                  <School className="w-10 h-10 text-slate-400 mb-1" />
                  <span className="text-[10px]">Belum Ada Logo</span>
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Unggah logo sekolah (format PNG/JPG, maksimal 2MB) atau masukkan tautan gambar. Logo akan otomatis ditampilkan di header dan kop laporan PDF.
              </p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Unggah Gambar Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {formData.logoSekolah && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Hapus Logo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Identitas Sekolah */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
            <Building className="w-5 h-5 text-sky-600" />
            Informasi Sekolah & Kelas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="namaSekolah"
                required
                value={formData.namaSekolah}
                onChange={handleChange}
                placeholder="Contoh: SD Negeri 1 Nusantara"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Sekolah
              </label>
              <input
                type="text"
                name="alamatSekolah"
                value={formData.alamatSekolah || ''}
                onChange={handleChange}
                placeholder="Contoh: Jl. Ki Hajar Dewantara No. 45"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Kelas
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="kelas"
                  value={formData.kelas || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 5-A"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tahun Ajaran
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="tahunAjaran"
                  value={formData.tahunAjaran || ''}
                  onChange={handleChange}
                  placeholder="Contoh: 2024/2025"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Data Kepala Sekolah & Wali Kelas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-sky-600" />
            Penanggung Jawab (Pendidik & Kepala Sekolah)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kepala Sekolah <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="kepalaSekolah"
                required
                value={formData.kepalaSekolah}
                onChange={handleChange}
                placeholder="Contoh: Dr. Hj. Siti Aminah, M.Pd."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                name="nipKepalaSekolah"
                value={formData.nipKepalaSekolah || ''}
                onChange={handleChange}
                placeholder="Contoh: 19700510 199503 2 001"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Guru Wali Kelas <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="namaGuru"
                  required
                  value={formData.namaGuru}
                  onChange={handleChange}
                  placeholder="Contoh: Bpk. Rusnoto, S.Pd.SD"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NIP Guru Wali Kelas
              </label>
              <input
                type="text"
                name="nipGuru"
                value={formData.nipGuru || ''}
                onChange={handleChange}
                placeholder="Contoh: 19850115 201001 1 002"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold rounded-xl text-sm shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
