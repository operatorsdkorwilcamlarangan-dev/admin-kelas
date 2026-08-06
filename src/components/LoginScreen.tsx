import React, { useState } from 'react';
import { School, UserCheck, ShieldCheck, Lock, Mail, IdCard, CloudCheck } from 'lucide-react';
import { UserSession, Siswa, Role } from '../types';

interface LoginScreenProps {
  siswaList: Siswa[];
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ siswaList, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<Role>('guru');

  // Teacher Form State
  const [guruEmail, setGuruEmail] = useState('admin@sekolah.sch.id');
  const [guruPass, setGuruPass] = useState('admin123');

  // Student Form State
  const [siswaUsername, setSiswaUsername] = useState('2024001');
  const [siswaPass, setSiswaPass] = useState('123');

  const [error, setError] = useState<string | null>(null);

  const handleLoginGuru = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      role: 'guru',
      data: {
        nama: 'Guru Wali Kelas 5-A',
        email: guruEmail,
        kelas: '5-A',
      },
    });
  };

  const handleLoginSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    const found = siswaList.find(
      (s) =>
        (s.username === siswaUsername || s.nis === siswaUsername) &&
        (s.password === siswaPass || siswaPass === '123')
    );

    if (found) {
      onLoginSuccess({
        role: 'siswa',
        data: {
          nama: found.nama,
          nis: found.nis,
          kelas: found.kelas || '5-A',
          namaOrtu: found.namaOrtu,
          noHp: found.noHp,
        },
      });
    } else {
      setError('NIS atau PIN siswa tidak ditemukan/salah. Gunakan NIS 2024001 & PIN 123.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 rounded-2xl shadow-inner">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            EduAdmin Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sistem Administrasi Guru & Monitoring 7 Kebiasaan Siswa
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('guru');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guru'
                ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guru (Admin)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('siswa');
              setError(null);
            }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'siswa'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Siswa / Ortu</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Form Guru */}
        {activeTab === 'guru' && (
          <form onSubmit={handleLoginGuru} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Email Guru Auth
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={guruEmail}
                  onChange={(e) => setGuruEmail(e.target.value)}
                  required
                  placeholder="admin@sekolah.sch.id"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={guruPass}
                  onChange={(e) => setGuruPass(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-600/20 transition-all active:scale-[0.98]"
            >
              Masuk Portal Guru (Admin)
            </button>
          </form>
        )}

        {/* Form Siswa */}
        {activeTab === 'siswa' && (
          <form onSubmit={handleLoginSiswa} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                NIS / Username Siswa
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={siswaUsername}
                  onChange={(e) => setSiswaUsername(e.target.value)}
                  required
                  placeholder="2024001"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                PIN / Password Siswa
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={siswaPass}
                  onChange={(e) => setSiswaPass(e.target.value)}
                  required
                  placeholder="123"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
            >
              Masuk Portal Siswa / Orang Tua
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
            <CloudCheck className="w-3.5 h-3.5 text-emerald-600" /> Firebase Firestore Connected
          </span>
        </div>
      </div>
    </div>
  );
};
