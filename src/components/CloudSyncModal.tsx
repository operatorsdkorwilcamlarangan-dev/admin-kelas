import React, { useState } from 'react';
import {
  X,
  CloudCheck,
  CloudOff,
  Download,
  Upload,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CloudSyncService, SyncStatus } from '../services/cloudSync';

interface CloudSyncModalProps {
  isOpen: boolean;
  syncStatus: SyncStatus;
  onClose: () => void;
  onRefreshData: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  syncStatus,
  onClose,
  onRefreshData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonStr = CloudSyncService.exportFullDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jurnal-7kebiasaan-cloud-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const success = await CloudSyncService.importFullDataJSON(content);
      if (success) {
        setImportStatus('Data cloud berhasil diimpor dan disinkronkan!');
        onRefreshData();
      } else {
        setImportStatus('Gagal mengimpor file backup. Format tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Status Sinkronisasi Cloud
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akses data lintas perangkat secara aman
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            syncStatus === 'connected'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
              : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
          }`}
        >
          {syncStatus === 'connected' ? (
            <CloudCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <CloudOff className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold">
              {syncStatus === 'connected'
                ? 'Terhubung dengan Firebase Firestore Cloud'
                : 'Penyimpanan Lokal Aktif (Offline Ready)'}
            </h4>
            <p className="opacity-90 leading-relaxed">
              {syncStatus === 'connected'
                ? 'Semua perubahan data 7 Kebiasaan, Absensi, dan Tabungan secara otomatis tersimpan secara real-time di Firestore Cloud Database.'
                : 'Aplikasi berjalan lancar di mode offline. Anda dapat mengunduh atau mengunggah berkas JSON cadangan untuk memindahkan data antar perangkat.'}
            </p>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{importStatus}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Opsi Cadangan & Transfer Data
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-sky-600" />
              <span>Ekspor Backup JSON</span>
            </button>

            <label className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Impor Data Cloud</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <button
            onClick={() => {
              onRefreshData();
              setImportStatus('Status cloud diperbarui.');
            }}
            className="w-full flex items-center justify-center gap-2 p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md shadow-sky-600/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Muat Ulang & Resync Data</span>
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Enkripsi Cloud Firestore Enabled • Modus Multi-User Terisolasi
          </p>
        </div>
      </div>
    </div>
  );
};
