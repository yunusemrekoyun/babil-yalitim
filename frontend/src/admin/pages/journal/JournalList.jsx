// frontend/src/admin/pages/JournalList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api.js";
import ToastAlert from "../../components/ToastAlert";
import ConfirmModal from "../../components/ConfirmDialog.jsx";

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // Confirm state
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    desc: "",
    onConfirm: null,
  });
  const openConfirm = (title, desc, onConfirm) =>
    setConfirm({ open: true, title, desc, onConfirm });
  const closeConfirm = () =>
    setConfirm((c) => ({ ...c, open: false, onConfirm: null }));

  const fetchAll = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/journals");
      setJournals(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("GET /journals error:", e?.response?.data || e);
      const msg = e?.response?.data?.message || "Haberler getirilemedi.";
      setErr(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(
    () => {
      fetchAll();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return journals;
    return journals.filter(
      (x) =>
        x.title?.toLowerCase().includes(s) ||
        x.content?.toLowerCase().includes(s)
    );
  }, [journals, q]);

  const handleDeleteClick = (id, title) => {
    openConfirm(
      "Haberi Sil",
      `“${title || "Adsız"}” başlıklı haberi silmek istiyor musunuz?`,
      async () => {
        try {
          await api.delete(`/journals/${id}`);
          setJournals((prev) => prev.filter((j) => j._id !== id));
          showToast("Haber silindi", "success");
        } catch (e) {
          console.error("DELETE /journals/:id error:", e?.response?.data || e);
          showToast(e?.response?.data?.message || "Silinemedi.", "error");
        } finally {
          closeConfirm();
        }
      }
    );
  };

  if (loading) return <p className="p-4">Yükleniyor…</p>;
  if (err) return <p className="p-4 text-red-600">{err}</p>;

  return (
    <div className="p-4 md:p-6">
      {/* başlık + aksiyonlar */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Haberler</h2>
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara (başlık/içerik)"
            className="w-60 rounded-md border px-3 py-2 text-sm"
          />
          <Link
            to="/admin/journals/add"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            + Yeni Haber
          </Link>
        </div>
      </div>

      {/* grid/table */}
      {filtered.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-gray-500">
          Kayıt bulunamadı.
        </div>
      ) : (
        <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="border p-2">Kapak</th>
              <th className="border p-2">Başlık</th>
              <th className="border p-2">Tarih</th>
              <th className="border p-2">Beğeni</th>
              <th className="border p-2 w-40">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((j) => (
              <tr key={j._id} className="align-top">
                <td className="border p-2">
                  {j.cover?.url ? (
                    <img
                      src={j.cover.url}
                      alt={j.title}
                      className="h-16 w-24 object-cover rounded-md"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2">
                  <div className="font-medium">{j.title}</div>
                  <div className="mt-1 line-clamp-2 text-gray-500 max-w-[40ch]">
                    {j.content}
                  </div>
                </td>
                <td className="border p-2">
                  {j.createdAt
                    ? new Date(j.createdAt).toLocaleDateString("tr-TR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </td>
                <td className="border p-2">{j.likesCount ?? 0}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/journals/edit/${j._id}`}
                      className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-600"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(j._id, j.title)}
                      className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Confirm & Toast */}
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.desc}
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        onConfirm={confirm.onConfirm || (() => {})}
        onCancel={closeConfirm}
        onClose={closeConfirm}
      />

      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default JournalList;
