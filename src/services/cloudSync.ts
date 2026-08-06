import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import {
  Siswa,
  AbsensiRecord,
  KebiasaanRecord,
  TabunganRecord,
  BukuPenghubungRecord,
  CatatanGuruRecord,
  AppNotification,
  WeekendReminderSetting,
} from '../types';

export type SyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

// Demo initial mock seed data
const DEFAULT_SISWA: Siswa[] = [
  {
    id: '2024001',
    nis: '2024001',
    nama: 'Ahmad Rizky',
    kelas: '5-A',
    username: '2024001',
    password: '123',
    namaOrtu: 'Budi Santoso',
    noHp: '08123456789',
    saldo: 175000,
    targetTabungan: 250000,
  },
  {
    id: '2024002',
    nis: '2024002',
    nama: 'Siti Nurhaliza',
    kelas: '5-A',
    username: '2024002',
    password: '123',
    namaOrtu: 'Rahmat Hidayat',
    noHp: '08198765432',
    saldo: 230000,
    targetTabungan: 300000,
  },
  {
    id: '2024003',
    nis: '2024003',
    nama: 'Dewi Lestari',
    kelas: '5-A',
    username: '2024003',
    password: '123',
    namaOrtu: 'Eko Prasetyo',
    noHp: '085211223344',
    saldo: 95000,
    targetTabungan: 200000,
  },
  {
    id: '2024004',
    nis: '2024004',
    nama: 'Bagas Pratama',
    kelas: '5-A',
    username: '2024004',
    password: '123',
    namaOrtu: 'Agus Supriadi',
    noHp: '087788990011',
    saldo: 120000,
    targetTabungan: 200000,
  },
];

const today = new Date().toISOString().split('T')[0];
const currentMonth = today.slice(0, 7);

const DEFAULT_ABSENSI: AbsensiRecord[] = [
  {
    id: `abs-2024001-${today}`,
    siswaId: '2024001',
    nis: '2024001',
    nama: 'Ahmad Rizky',
    tanggal: today,
    status: 'Hadir',
    keterangan: 'Tepat waktu',
  },
  {
    id: `abs-2024002-${today}`,
    siswaId: '2024002',
    nis: '2024002',
    nama: 'Siti Nurhaliza',
    tanggal: today,
    status: 'Hadir',
    keterangan: 'Tepat waktu',
  },
  {
    id: `abs-2024003-${today}`,
    siswaId: '2024003',
    nis: '2024003',
    nama: 'Dewi Lestari',
    tanggal: today,
    status: 'Sakit',
    keterangan: 'Demam ringan',
  },
  {
    id: `abs-2024004-${today}`,
    siswaId: '2024004',
    nis: '2024004',
    nama: 'Bagas Pratama',
    tanggal: today,
    status: 'Hadir',
    keterangan: 'Tepat waktu',
  },
];

const DEFAULT_KEBIASAAN: KebiasaanRecord[] = [
  {
    id: `keb-2024001-${today}`,
    siswaId: '2024001',
    tanggal: today,
    waktuBangun: '04:45',
    sholatList: ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'],
    olahragaDetail: 'Lari pagi 20 menit bersama kakek di lapangan',
    menuMakan: 'Nasi merah, Sayur bening bayam, Telur rebus, Apel',
    kegiatanMasyarakat: 'Membantu menyapu halaman rumah bersama tetangga',
    kegiatanBelajar: 'Membaca Buku IPA Bab 3 & Latihan Soal Matematika',
    waktuTidur: '21:00',
    verifikasiOrtu: true,
    catatanOrtu: 'Ahmad sangat rajin bangun pagi dan membantu rumah.',
    feedbackGuru: 'Sangat baik Ahmad! Pertahankan kebiasaan hebat ini.',
  },
  {
    id: `keb-2024002-${today}`,
    siswaId: '2024002',
    tanggal: today,
    waktuBangun: '04:50',
    sholatList: ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'],
    olahragaDetail: 'Senam irama di halaman bersama ibu',
    menuMakan: 'Nasi, Sup Ikan Gurame, Tempe Goreng, Pisang',
    kegiatanMasyarakat: 'Merawat tanaman bunga di depan rumah',
    kegiatanBelajar: 'Membaca cerita rakyat & merangkum nilai moral',
    waktuTidur: '20:45',
    verifikasiOrtu: true,
    catatanOrtu: 'Siti disiplin jadwal belajar.',
    feedbackGuru: 'Bagus sekali Siti, terus giat membaca!',
  },
];

const DEFAULT_TABUNGAN: TabunganRecord[] = [
  {
    id: 'tab-1',
    siswaId: '2024001',
    nis: '2024001',
    nama: 'Ahmad Rizky',
    tanggal: `${currentMonth}-01`,
    jenis: 'setor',
    nominal: 100000,
    keterangan: 'Setoran awal bulan',
    saldoAkhir: 100000,
  },
  {
    id: 'tab-2',
    siswaId: '2024001',
    nis: '2024001',
    nama: 'Ahmad Rizky',
    tanggal: `${currentMonth}-05`,
    jenis: 'setor',
    nominal: 50000,
    keterangan: 'Setoran mingguan',
    saldoAkhir: 150000,
  },
  {
    id: 'tab-3',
    siswaId: '2024001',
    nis: '2024001',
    nama: 'Ahmad Rizky',
    tanggal: today,
    jenis: 'setor',
    nominal: 25000,
    keterangan: 'Uang kembalian buku',
    saldoAkhir: 175000,
  },
  {
    id: 'tab-4',
    siswaId: '2024002',
    nis: '2024002',
    nama: 'Siti Nurhaliza',
    tanggal: `${currentMonth}-02`,
    jenis: 'setor',
    nominal: 200000,
    keterangan: 'Setoran rutin bulan ini',
    saldoAkhir: 200000,
  },
  {
    id: 'tab-5',
    siswaId: '2024002',
    nis: '2024002',
    nama: 'Siti Nurhaliza',
    tanggal: today,
    jenis: 'setor',
    nominal: 30000,
    keterangan: 'Setoran Jumat Berkah',
    saldoAkhir: 230000,
  },
];

const DEFAULT_PENGHUBUNG: BukuPenghubungRecord[] = [
  {
    id: 'msg-1',
    siswaId: '2024001',
    tanggal: today,
    pengirim: 'Guru',
    judul: 'Persiapan Penilaian Tengah Semester',
    pesan: 'Mohon Bapak/Ibu mendampingi Ahmad mengulang materi Matematika Bab 3 malam ini.',
    tanggapan: 'Baik Pak Guru, terima kasih petunjuknya. Kami siap mendampingi.',
  },
];

const DEFAULT_CATATAN: CatatanGuruRecord[] = [
  {
    id: 'cat-1',
    siswaId: '2024001',
    tanggal: today,
    kategori: 'Prestasi',
    deskripsi: 'Mendapat nilai tertinggi pada kuis IPA materi ekosistem.',
    tindakLanjut: 'Diberikan apresiasi bintang prestasi dan ditunjuk menjadi ketua diskusi.',
  },
];

const DEFAULT_WEEKEND_REMINDER: WeekendReminderSetting = {
  enabled: true,
  day: 'Sabtu',
  time: '08:00',
  customMessage:
    'Pengingat Akhir Pekan: Mari evaluasi kebiasaan menabung dan 7 kebiasaan mulia Ananda minggu ini!',
  autoSendWhatsappHint: true,
};

// Application ID scope for Firebase Firestore
const APP_ID = 'jurnal-7kebiasaan-app';

let firebaseApp: FirebaseApp | null = null;
let db: Firestore | null = null;

// Firebase Init
try {
  const firebaseConfig = {
    apiKey: 'AIzaSyAP16073w1MgkV_-VTj3V49BfbrgkqCVYo',
    authDomain: 'jurnal-kelasku.firebaseapp.com',
    projectId: 'jurnal-kelasku',
    storageBucket: 'jurnal-kelasku.firebasestorage.app',
    messagingSenderId: '871817142762',
    appId: '1:871817142762:web:fc30e8b6d1f12a7295d293',
  };

  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
  db = getFirestore(firebaseApp);
} catch (err) {
  console.warn('Firebase init warning, operating with local fallback', err);
}

// Local Storage Helpers
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(`jurnal_${key}`);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`jurnal_${key}`, JSON.stringify(val));
  } catch (err) {
    console.error('LocalStorage error', err);
  }
}

export class CloudSyncService {
  private static status: SyncStatus = 'connected';
  private static statusListeners: ((status: SyncStatus) => void)[] = [];

  public static async initializeCloud(): Promise<SyncStatus> {
    if (db) {
      this.status = 'connected';
    } else {
      this.status = 'offline';
    }
    return this.status;
  }

  public static onStatusChange(listener: (status: SyncStatus) => void) {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  private static setStatus(newStatus: SyncStatus) {
    this.status = newStatus;
    this.statusListeners.forEach((l) => l(newStatus));
  }

  // Firestore path constructor following Rule 1: /artifacts/{appId}/public/data/{collectionName}/{docId}
  private static getDocRef(collectionName: string, docId: string) {
    if (!db) return null;
    return doc(db, 'artifacts', APP_ID, 'public', 'data', collectionName, docId);
  }

  private static getCollRef(collectionName: string) {
    if (!db) return null;
    return collection(db, 'artifacts', APP_ID, 'public', 'data', collectionName);
  }

  // Generic Save Document
  public static async saveDoc<T extends { id: string }>(collName: string, data: T): Promise<void> {
    this.setStatus('syncing');

    // Save to LocalStorage immediately
    const items = getLocal<T[]>(collName, []);
    const idx = items.findIndex((item) => item.id === data.id);
    if (idx >= 0) {
      items[idx] = data;
    } else {
      items.push(data);
    }
    setLocal(collName, items);

    // Save to Firebase Firestore if online
    if (db) {
      try {
        const docRef = this.getDocRef(collName, data.id);
        if (docRef) {
          await setDoc(docRef, data, { merge: true });
        }
        this.setStatus('connected');
      } catch (err) {
        console.warn(`Firestore save warning [${collName}/${data.id}], kept in local storage`, err);
        this.setStatus('offline');
      }
    } else {
      this.setStatus('offline');
    }
  }

  // Generic Delete Document
  public static async deleteDoc(collName: string, id: string): Promise<void> {
    this.setStatus('syncing');

    const items = getLocal<{ id: string }[]>(collName, []);
    const filtered = items.filter((item) => item.id !== id);
    setLocal(collName, filtered);

    if (db) {
      try {
        const docRef = this.getDocRef(collName, id);
        if (docRef) {
          await deleteDoc(docRef);
        }
        this.setStatus('connected');
      } catch (err) {
        console.warn(`Firestore delete warning [${collName}/${id}]`, err);
        this.setStatus('offline');
      }
    } else {
      this.setStatus('offline');
    }
  }

  // Domain Entity Accessors & Actions
  public static getSiswaList(): Siswa[] {
    return getLocal<Siswa[]>('siswa', DEFAULT_SISWA);
  }

  public static async saveSiswa(siswa: Siswa): Promise<void> {
    await this.saveDoc('siswa', siswa);
  }

  public static async deleteSiswa(nis: string): Promise<void> {
    const list = this.getSiswaList();
    const found = list.find((s) => s.nis === nis);
    if (found) {
      await this.deleteDoc('siswa', found.id);
    }
  }

  public static getAbsensiList(): AbsensiRecord[] {
    return getLocal<AbsensiRecord[]>('absensi', DEFAULT_ABSENSI);
  }

  public static async saveAbsensiList(records: AbsensiRecord[]): Promise<void> {
    for (const rec of records) {
      await this.saveDoc('absensi', rec);
    }
  }

  public static getKebiasaanList(): KebiasaanRecord[] {
    return getLocal<KebiasaanRecord[]>('kebiasaan', DEFAULT_KEBIASAAN);
  }

  public static async saveKebiasaanRecord(record: KebiasaanRecord): Promise<void> {
    await this.saveDoc('kebiasaan', record);
  }

  public static getTabunganList(): TabunganRecord[] {
    return getLocal<TabunganRecord[]>('tabungan', DEFAULT_TABUNGAN);
  }

  public static async addTabunganRecord(record: TabunganRecord): Promise<void> {
    await this.saveDoc('tabungan', record);

    // Update student's balance
    const siswaList = this.getSiswaList();
    const sIdx = siswaList.findIndex((s) => s.nis === record.siswaId || s.nis === record.nis);
    if (sIdx >= 0) {
      siswaList[sIdx].saldo = record.saldoAkhir;
      await this.saveSiswa(siswaList[sIdx]);
    }
  }

  public static getPenghubungList(): BukuPenghubungRecord[] {
    return getLocal<BukuPenghubungRecord[]>('penghubung', DEFAULT_PENGHUBUNG);
  }

  public static async savePenghubungRecord(record: BukuPenghubungRecord): Promise<void> {
    await this.saveDoc('penghubung', record);
  }

  public static getCatatanList(): CatatanGuruRecord[] {
    return getLocal<CatatanGuruRecord[]>('catatan', DEFAULT_CATATAN);
  }

  public static async saveCatatanRecord(record: CatatanGuruRecord): Promise<void> {
    await this.saveDoc('catatan', record);
  }

  public static getWeekendReminder(): WeekendReminderSetting {
    return getLocal<WeekendReminderSetting>('weekend_reminder', DEFAULT_WEEKEND_REMINDER);
  }

  public static async saveWeekendReminder(setting: WeekendReminderSetting): Promise<void> {
    setLocal('weekend_reminder', setting);
    await this.saveDoc('settings', { id: 'weekend_reminder', ...setting });
  }

  public static getNotifications(): AppNotification[] {
    return getLocal<AppNotification[]>('notifications', [
      {
        id: 'notif-1',
        title: 'Pengingat Akhir Pekan',
        message: 'Progres tabungan kelas bulan ini mencapai Rp 620.000! Pertahankan semangat menabung.',
        type: 'savings',
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: 'notif-2',
        title: '7 Kebiasaan Terisi',
        message: 'Ahmad Rizky telah menyelesaikan pengisian 7 kebiasaan hari ini.',
        type: 'habit',
        timestamp: new Date().toISOString(),
        read: true,
      },
    ]);
  }

  public static async addNotification(notif: Omit<AppNotification, 'id'>): Promise<void> {
    const notifications = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
    };
    notifications.unshift(newNotif);
    setLocal('notifications', notifications);
    await this.saveDoc('notifications', newNotif);
  }

  public static async markNotificationsAsRead(): Promise<void> {
    const notifications = this.getNotifications().map((n) => ({ ...n, read: true }));
    setLocal('notifications', notifications);
    for (const notif of notifications) {
      await this.saveDoc('notifications', notif);
    }
  }

  public static exportFullDataJSON() {
    const fullData = {
      timestamp: new Date().toISOString(),
      siswa: getLocal('siswa', DEFAULT_SISWA),
      absensi: getLocal('absensi', DEFAULT_ABSENSI),
      kebiasaan: getLocal('kebiasaan', DEFAULT_KEBIASAAN),
      tabungan: getLocal('tabungan', DEFAULT_TABUNGAN),
      penghubung: getLocal('penghubung', DEFAULT_PENGHUBUNG),
      catatan: getLocal('catatan', DEFAULT_CATATAN),
      weekend_reminder: getLocal('weekend_reminder', DEFAULT_WEEKEND_REMINDER),
    };
    return JSON.stringify(fullData, null, 2);
  }

  public static async importFullDataJSON(jsonStr: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.siswa && Array.isArray(parsed.siswa)) {
        setLocal('siswa', parsed.siswa);
        parsed.siswa.forEach((item: Siswa) => this.saveDoc('siswa', item));
      }
      if (parsed.absensi && Array.isArray(parsed.absensi)) {
        setLocal('absensi', parsed.absensi);
        parsed.absensi.forEach((item: AbsensiRecord) => this.saveDoc('absensi', item));
      }
      if (parsed.kebiasaan && Array.isArray(parsed.kebiasaan)) {
        setLocal('kebiasaan', parsed.kebiasaan);
        parsed.kebiasaan.forEach((item: KebiasaanRecord) => this.saveDoc('kebiasaan', item));
      }
      if (parsed.tabungan && Array.isArray(parsed.tabungan)) {
        setLocal('tabungan', parsed.tabungan);
        parsed.tabungan.forEach((item: TabunganRecord) => this.saveDoc('tabungan', item));
      }
      if (parsed.penghubung && Array.isArray(parsed.penghubung)) {
        setLocal('penghubung', parsed.penghubung);
        parsed.penghubung.forEach((item: BukuPenghubungRecord) => this.saveDoc('penghubung', item));
      }
      if (parsed.catatan && Array.isArray(parsed.catatan)) {
        setLocal('catatan', parsed.catatan);
        parsed.catatan.forEach((item: CatatanGuruRecord) => this.saveDoc('catatan', item));
      }
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  }
}
