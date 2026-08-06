import React from 'react';
import {
  PieChart,
  CalendarCheck,
  CheckSquare,
  BarChart2,
  Wallet,
  Coins,
  BellRing,
  MessageSquare,
  Bookmark,
  Printer,
  Users,
  Settings,
} from 'lucide-react';
import { Role } from '../types';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  guruOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard Utama', icon: PieChart },
  { id: 'absensi', label: 'Absensi Harian', icon: CalendarCheck },
  { id: 'kebiasaan', label: 'Input 7 Kebiasaan', icon: CheckSquare },
  { id: 'rekap_kebiasaan', label: 'Rekap 7 Kebiasaan', icon: BarChart2 },
  { id: 'tabungan', label: 'Tabungan Siswa', icon: Wallet },
  { id: 'rekap_tabungan', label: 'Rekap Tabungan', icon: Coins },
  { id: 'notifikasi_keuangan', label: 'Pengingat Keuangan', icon: BellRing, guruOnly: true },
  { id: 'penghubung', label: 'Buku Penghubung', icon: MessageSquare },
  { id: 'catatan', label: 'Catatan Anekdot', icon: Bookmark },
  { id: 'rekap_pdf', label: 'Cetak Laporan PDF', icon: Printer },
  { id: 'manajemen_siswa', label: 'Data Siswa', icon: Users, guruOnly: true },
  { id: 'pengaturan', label: 'Pengaturan Sekolah', icon: Settings, guruOnly: true },
];

interface SidebarProps {
  activeTab: string;
  userRole: Role;
  onSelectTab: (tabId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, userRole, onSelectTab }) => {
  const filteredItems = NAV_ITEMS.filter((item) => !item.guruOnly || userRole === 'guru');

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto z-20">
      <div className="mb-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Menu Utama Aplikasi
      </div>
      <nav className="space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
