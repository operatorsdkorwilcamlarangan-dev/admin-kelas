export type Role = 'guru' | 'siswa';

export interface Siswa {
  id: string;
  nis: string;
  nama: string;
  kelas: string;
  username: string;
  password: string;
  namaOrtu: string;
  noHp: string;
  saldo: number;
  targetTabungan?: number;
}

export type StatusAbsensi = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface AbsensiRecord {
  id: string;
  siswaId: string;
  nis: string;
  nama: string;
  tanggal: string; // YYYY-MM-DD
  status: StatusAbsensi;
  keterangan: string;
}

export type HabitKey =
  | 'bangunPagi'
  | 'beribadah'
  | 'berolahraga'
  | 'makanBergizi'
  | 'bermasyarakat'
  | 'gemarBelajar'
  | 'tidurCepat';

export interface HabitItemDef {
  key: HabitKey;
  number: number;
  title: string;
  description: string;
  targetCriteria: string;
  icon: string;
  colorBg: string;
  colorText: string;
  colorBorder: string;
}

export interface KebiasaanRecord {
  id: string;
  siswaId: string;
  tanggal: string; // YYYY-MM-DD
  waktuBangun: string; // e.g. "04:45"
  sholatList: string[]; // e.g. ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya']
  olahragaDetail: string;
  menuMakan: string;
  kegiatanMasyarakat: string;
  kegiatanBelajar: string;
  waktuTidur: string; // e.g. "21:00"
  verifikasiOrtu: boolean;
  catatanOrtu?: string;
  feedbackGuru?: string;
}

export type JenisTransaksiTabungan = 'setor' | 'tarik';

export interface TabunganRecord {
  id: string;
  siswaId: string;
  nis: string;
  nama: string;
  tanggal: string; // YYYY-MM-DD
  jenis: JenisTransaksiTabungan;
  nominal: number;
  keterangan: string;
  saldoAkhir: number;
}

export interface BukuPenghubungRecord {
  id: string;
  siswaId: string;
  tanggal: string; // YYYY-MM-DD
  pengirim: 'Guru' | 'Orang Tua';
  judul: string;
  pesan: string;
  tanggapan?: string;
}

export interface CatatanGuruRecord {
  id: string;
  siswaId: string;
  tanggal: string; // YYYY-MM-DD
  kategori: 'Prestasi' | 'Perilaku' | 'Kedisiplinan' | 'Evaluasi';
  deskripsi: string;
  tindakLanjut?: string;
}

export interface WeekendReminderSetting {
  enabled: boolean;
  day: 'Sabtu' | 'Minggu' | 'Setiap Akhir Pekan';
  time: string; // e.g. "08:00"
  customMessage: string;
  autoSendWhatsappHint: boolean;
  lastTriggered?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'savings' | 'habit' | 'info';
  timestamp: string;
  read: boolean;
  nis?: string;
}

export interface UserSession {
  role: Role;
  data: {
    nama: string;
    email?: string;
    nis?: string;
    kelas?: string;
    namaOrtu?: string;
    noHp?: string;
  };
}

export interface HabitSummaryResult {
  totalDaysRecorded: number;
  habitHabituatedCount: Record<HabitKey, number>; // Terbiasa count
  habitNotHabituatedCount: Record<HabitKey, number>; // Tidak Terbiasa count
  overallHabituatedCount: number;
  overallTotalChecks: number;
  percentage: number;
  statusLabel: 'Sangat Terbiasa' | 'Terbiasa' | 'Perlu Pembiasaan';
}
