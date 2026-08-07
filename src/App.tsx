import React, { useState, useEffect } from 'react';
import {
  Siswa,
  AbsensiRecord,
  KebiasaanRecord,
  TabunganRecord,
  BukuPenghubungRecord,
  CatatanGuruRecord,
  UserSession,
  AppNotification,
  Role,
  SchoolSettings,
} from './types';
import { CloudSyncService, SyncStatus } from './services/cloudSync';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { KebiasaanView } from './components/KebiasaanView';
import { RekapKebiasaanBulanan } from './components/RekapKebiasaanBulanan';
import { AbsensiView } from './components/AbsensiView';
import { TabunganView } from './components/TabunganView';
import { RekapTabunganBulanan } from './components/RekapTabunganBulanan';
import { BukuPenghubungView } from './components/BukuPenghubungView';
import { CatatanAnekdotView } from './components/CatatanAnekdotView';
import { ManajemenSiswaView } from './components/ManajemenSiswaView';
import { RekapBulananPDFView } from './components/RekapBulananPDFView';
import { RekapAbsensiView } from './components/RekapAbsensiView';
import { NotifikasiKeuanganWeekend } from './components/NotifikasiKeuanganWeekend';
import { CloudSyncModal } from './components/CloudSyncModal';
import { PengaturanSekolahView } from './components/PengaturanSekolahView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('jurnal_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Core synchronized application state
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>([]);
  const [kebiasaanList, setKebiasaanList] = useState<KebiasaanRecord[]>([]);
  const [tabunganList, setTabunganList] = useState<TabunganRecord[]>([]);
  const [penghubungList, setPenghubungList] = useState<BukuPenghubungRecord[]>([]);
  const [catatanList, setCatatanList] = useState<CatatanGuruRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() =>
    CloudSyncService.getSchoolSettings()
  );

  // Load state from CloudSyncService
  const loadAllData = async () => {
    const status = await CloudSyncService.initializeCloud();
    setSyncStatus(status);

    setSiswaList(CloudSyncService.getSiswaList());
    setAbsensiList(CloudSyncService.getAbsensiList());
    setKebiasaanList(CloudSyncService.getKebiasaanList());
    setTabunganList(CloudSyncService.getTabunganList());
    setPenghubungList(CloudSyncService.getPenghubungList());
    setCatatanList(CloudSyncService.getCatatanList());
    setNotifications(CloudSyncService.getNotifications());
    setSchoolSettings(CloudSyncService.getSchoolSettings());
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogin = (role: Role, nis?: string, nama?: string, password?: string) => {
    let session: UserSession;
    if (role === 'guru') {
      session = {
        role: 'guru',
        data: {
          nama: nama || 'Bpk. Rusnoto, S.Pd.SD',
        },
      };
    } else {
      const foundSiswa = siswaList.find((s) => s.nis === nis) || {
        nis: nis || '2024001',
        nama: nama || 'Ahmad Rizky',
      };
      session = {
        role: 'siswa',
        data: {
          nis: foundSiswa.nis,
          nama: foundSiswa.nama,
        },
      };
    }

    setCurrentUser(session);
    localStorage.setItem('jurnal_current_user', JSON.stringify(session));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('jurnal_current_user');
  };

  // Handlers for updating data and syncing
  const handleSaveAbsensi = async (records: AbsensiRecord[]) => {
    await CloudSyncService.saveAbsensiList(records);
    setAbsensiList(CloudSyncService.getAbsensiList());
  };

  const handleSaveKebiasaan = async (record: KebiasaanRecord) => {
    await CloudSyncService.saveKebiasaanRecord(record);
    setKebiasaanList(CloudSyncService.getKebiasaanList());
  };

  const handleSaveTabungan = async (record: TabunganRecord) => {
    await CloudSyncService.addTabunganRecord(record);
    setTabunganList(CloudSyncService.getTabunganList());
    setSiswaList(CloudSyncService.getSiswaList());
  };

  const handleSavePenghubung = async (record: BukuPenghubungRecord) => {
    await CloudSyncService.savePenghubungRecord(record);
    setPenghubungList(CloudSyncService.getPenghubungList());
  };

  const handleSaveCatatan = async (record: Omit<CatatanGuruRecord, 'id'> | CatatanGuruRecord) => {
    const fullRecord: CatatanGuruRecord = 'id' in record ? record : { ...record, id: `cat-${Date.now()}` };
    await CloudSyncService.saveCatatanRecord(fullRecord);
    setCatatanList(CloudSyncService.getCatatanList());
  };

  const handleSaveSiswa = async (siswa: Siswa) => {
    await CloudSyncService.saveSiswa(siswa);
    setSiswaList(CloudSyncService.getSiswaList());
  };

  const handleImportSiswaBatch = async (batch: Siswa[]) => {
    await CloudSyncService.saveSiswaBatch(batch);
    setSiswaList(CloudSyncService.getSiswaList());
  };

  const handleDeleteSiswa = async (nis: string) => {
    await CloudSyncService.deleteSiswa(nis);
    setSiswaList(CloudSyncService.getSiswaList());
  };

  const handleMarkNotificationsRead = async () => {
    await CloudSyncService.markNotificationsAsRead();
    setNotifications(CloudSyncService.getNotifications());
  };

  const handleSaveSchoolSettings = async (newSettings: SchoolSettings) => {
    await CloudSyncService.saveSchoolSettings(newSettings);
    setSchoolSettings(CloudSyncService.getSchoolSettings());
  };

  if (!currentUser) {
    return (
      <LoginScreen
        siswaList={siswaList}
        onLoginSuccess={(session) => {
          setCurrentUser(session);
          localStorage.setItem('jurnal_current_user', JSON.stringify(session));
        }}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
      {/* Sleek App Header */}
      <Header
        currentUser={currentUser}
        syncStatus={syncStatus}
        notifications={notifications}
        schoolSettings={schoolSettings}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onLogout={handleLogout}
        onOpenNotificationModal={() => {
          if (currentUser.role === 'guru') {
            setActiveTab('notifikasi_keuangan');
          }
        }}
      />

      {/* Main Layout Container */}
      <div className="flex pt-16 pb-20 lg:pb-8">
        {/* Sidebar Navigation for Desktop */}
        <Sidebar
          activeTab={activeTab}
          userRole={currentUser.role}
          onSelectTab={(tabId) => setActiveTab(tabId)}
        />

        {/* Main View Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              siswaList={siswaList}
              absensiList={absensiList}
              kebiasaanList={kebiasaanList}
              tabunganList={tabunganList}
              onNavigate={(tabId) => setActiveTab(tabId)}
            />
          )}

          {activeTab === 'absensi' && (
            <AbsensiView
              siswaList={siswaList}
              absensiList={absensiList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
              onSaveAbsensi={handleSaveAbsensi}
            />
          )}

          {activeTab === 'rekap_absensi' && (
            <RekapAbsensiView
              siswaList={siswaList}
              absensiList={absensiList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
              onNavigate={(tabId) => setActiveTab(tabId)}
            />
          )}

          {activeTab === 'kebiasaan' && (
            <KebiasaanView
              siswaList={siswaList}
              kebiasaanList={kebiasaanList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
              onSaveKebiasaan={handleSaveKebiasaan}
            />
          )}

          {activeTab === 'rekap_kebiasaan' && (
            <RekapKebiasaanBulanan
              siswaList={siswaList}
              kebiasaanList={kebiasaanList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
            />
          )}

          {activeTab === 'tabungan' && (
            <TabunganView
              siswaList={siswaList}
              tabunganList={tabunganList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
              onSaveTabungan={handleSaveTabungan}
            />
          )}

          {activeTab === 'rekap_tabungan' && (
            <RekapTabunganBulanan
              siswaList={siswaList}
              tabunganList={tabunganList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
            />
          )}

          {activeTab === 'notifikasi_keuangan' && currentUser.role === 'guru' && (
            <NotifikasiKeuanganWeekend
              siswaList={siswaList}
              tabunganList={tabunganList}
              notifications={notifications}
              onRefreshNotifications={loadAllData}
            />
          )}

          {activeTab === 'penghubung' && (
            <BukuPenghubungView
              siswaList={siswaList}
              penghubungList={penghubungList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
              onSavePenghubung={handleSavePenghubung}
            />
          )}

          {activeTab === 'catatan' && (
            <CatatanAnekdotView
              siswaList={siswaList}
              catatanList={catatanList}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
              onAddCatatan={handleSaveCatatan}
            />
          )}

          {activeTab === 'rekap_pdf' && (
            <RekapBulananPDFView
              siswaList={siswaList}
              absensiList={absensiList}
              kebiasaanList={kebiasaanList}
              tabunganList={tabunganList}
              schoolSettings={schoolSettings}
              currentUserRole={currentUser.role}
              currentUserNis={currentUser.data.nis}
            />
          )}

          {activeTab === 'manajemen_siswa' && currentUser.role === 'guru' && (
            <ManajemenSiswaView
              siswaList={siswaList}
              onSaveSiswa={handleSaveSiswa}
              onImportSiswaBatch={handleImportSiswaBatch}
              onDeleteSiswa={handleDeleteSiswa}
            />
          )}

          {activeTab === 'pengaturan' && currentUser.role === 'guru' && (
            <PengaturanSekolahView
              settings={schoolSettings}
              onSaveSettings={handleSaveSchoolSettings}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} onSelectTab={(tabId) => setActiveTab(tabId)} />

      {/* Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        syncStatus={syncStatus}
        onClose={() => setIsSyncModalOpen(false)}
        onRefreshData={loadAllData}
      />
    </div>
  );
}
