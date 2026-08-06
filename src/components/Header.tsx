import React from 'react';
import {
  School,
  LogOut,
  Cloud,
  CloudCheck,
  CloudOff,
  RefreshCw,
  Bell,
  UserCheck,
  ShieldCheck,
} from 'lucide-react';
import { UserSession, AppNotification } from '../types';
import { SyncStatus } from '../services/cloudSync';

interface HeaderProps {
  currentUser: UserSession;
  syncStatus: SyncStatus;
  notifications: AppNotification[];
  onLogout: () => void;
  onOpenSyncModal: () => void;
  onOpenNotificationModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  syncStatus,
  notifications,
  onLogout,
  onOpenSyncModal,
  onOpenNotificationModal,
}) => {
  const isGuru = currentUser.role === 'guru';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getSyncBadge = () => {
    switch (syncStatus) {
      case 'connected':
        return (
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
            title="Data Tersinkronisasi ke Cloud Firestore"
          >
            <CloudCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span className="hidden sm:inline">Cloud Synced</span>
          </button>
        );
      case 'syncing':
        return (
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800"
          >
            <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
            <span className="hidden sm:inline">Menyimpan...</span>
          </button>
        );
      default:
        return (
          <button
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100 transition-colors"
            title="Modus Lokal / Offline"
          >
            <CloudOff className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Mode Lokal</span>
          </button>
        );
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-sky-600/20">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-tight">
              EduAdmin 7 Kebiasaan
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Jurnal Kebiasaan, Presensi & Tabungan Siswa
            </p>
          </div>
        </div>

        {/* User Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Status Indicator */}
          {getSyncBadge()}

          {/* Weekend Notification Bell */}
          <button
            onClick={onOpenNotificationModal}
            className="relative p-2 text-slate-600 hover:text-sky-600 dark:text-slate-300 dark:hover:text-sky-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifikasi & Pengingat Akhir Pekan"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            )}
          </button>

          {/* User Profile Pill */}
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 text-xs font-bold">
              {isGuru ? <ShieldCheck className="w-4 h-4 text-sky-600" /> : <UserCheck className="w-4 h-4 text-emerald-600" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                {currentUser.data.nama}
              </p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                {isGuru ? 'Guru (Admin)' : `Siswa (${currentUser.data.nis})`}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Keluar dari Akun"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
