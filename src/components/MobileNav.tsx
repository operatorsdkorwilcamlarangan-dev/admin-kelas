import React from 'react';
import { PieChart, CheckSquare, BarChart2, Wallet, Printer } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const quickNav = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'kebiasaan', label: '7 Kebiasaan', icon: CheckSquare },
    { id: 'rekap_kebiasaan', label: 'Rekap 7', icon: BarChart2 },
    { id: 'tabungan', label: 'Tabungan', icon: Wallet },
    { id: 'rekap_pdf', label: 'Cetak PDF', icon: Printer },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-40 px-2 py-1.5 flex justify-around items-center">
      {quickNav.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              isActive
                ? 'text-sky-600 dark:text-sky-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-sky-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
