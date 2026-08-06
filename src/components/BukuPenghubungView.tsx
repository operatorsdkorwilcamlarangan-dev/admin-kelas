import React, { useState } from 'react';
import { MessageSquare, Plus, Reply, CheckCircle2, Send } from 'lucide-react';
import { BukuPenghubungRecord, Siswa, Role } from '../types';

interface BukuPenghubungViewProps {
  siswaList: Siswa[];
  penghubungList: BukuPenghubungRecord[];
  currentUserRole: Role;
  currentUserNis?: string;
  onAddMessage: (msg: Omit<BukuPenghubungRecord, 'id'>) => void;
  onReplyMessage: (id: string, tanggapan: string) => void;
}

export const BukuPenghubungView: React.FC<BukuPenghubungViewProps> = ({
  siswaList,
  penghubungList,
  currentUserRole,
  currentUserNis,
  onAddMessage,
  onReplyMessage,
}) => {
  const isGuru = currentUserRole === 'guru';
  const today = new Date().toISOString().split('T')[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [replyModalId, setReplyModalId] = useState<string | null>(null);
  const [targetSiswaNis, setTargetSiswaNis] = useState(siswaList[0]?.nis || '2024001');
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [tanggapanText, setTanggapanText] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const displayList = isGuru
    ? penghubungList
    : penghubungList.filter((m) => m.siswaId === currentUserNis);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const activeNis = isGuru ? targetSiswaNis : currentUserNis || '2024001';

    onAddMessage({
      siswaId: activeNis,
      tanggal: today,
      pengirim: isGuru ? 'Guru' : 'Orang Tua',
      judul,
      pesan,
      tanggapan: '',
    });

    setShowAddModal(false);
    setJudul('');
    setPesan('');
    setSuccessMsg('Pesan buku penghubung berhasil dikirim!');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyModalId && tanggapanText) {
      onReplyMessage(replyModalId, tanggapanText);
      setReplyModalId(null);
      setTanggapanText('');
      setSuccessMsg('Tanggapan berhasil dikirim!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-600" /> Buku Penghubung Digital
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Komunikasi 2 arah secara transparan antara Wali Kelas dan Orang Tua
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Pesan Baru</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {displayList.length === 0 ? (
          <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
            Belum ada catatan buku penghubung.
          </div>
        ) : (
          displayList.map((msg) => {
            const siswa = siswaList.find((s) => s.nis === msg.siswaId);

            return (
              <div
                key={msg.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        msg.pengirim === 'Guru'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      Dari: {msg.pengirim}
                    </span>
                    <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100">
                      {msg.judul}
                    </h5>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {msg.tanggal} | Murid: {siswa?.nama || msg.siswaId}
                  </span>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {msg.pesan}
                </p>

                {msg.tanggapan ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1">
                    <p className="font-bold text-slate-500 text-[10px]">Tanggapan / Balasan:</p>
                    <p className="text-slate-700 dark:text-slate-300">{msg.tanggapan}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyModalId(msg.id)}
                    className="text-xs text-sky-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Beri Tanggapan</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add Message */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Buat Pesan Buku Penghubung
            </h4>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              {isGuru && (
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Ditujukan Untuk Siswa
                  </label>
                  <select
                    value={targetSiswaNis}
                    onChange={(e) => setTargetSiswaNis(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                  >
                    {siswaList.map((s) => (
                      <option key={s.nis} value={s.nis}>
                        {s.nama} ({s.nis})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Judul Perihal
                </label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  required
                  placeholder="Contoh: Perkembangan Belajar / Izin Kegiatan"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Isi Pesan
                </label>
                <textarea
                  rows={4}
                  value={pesan}
                  onChange={(e) => setPesan(e.target.value)}
                  required
                  placeholder="Tuliskan pesan secara lengkap..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold"
                >
                  Kirim Pesan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reply */}
      {replyModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
              Beri Tanggapan Balasan
            </h4>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Isi Tanggapan
                </label>
                <textarea
                  rows={3}
                  value={tanggapanText}
                  onChange={(e) => setTanggapanText(e.target.value)}
                  required
                  placeholder="Tuliskan balasan..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModalId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Balasan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
