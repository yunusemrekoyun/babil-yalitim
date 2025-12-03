// src/admin/pages/journal/JournalList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api.js";
import ToastAlert from "../../components/ToastAlert";
import ConfirmModal from "../../components/ConfirmDialog.jsx";

const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    desc: "",
    onConfirm: null,
  });
  const inputCls =
    "w-full sm:w-72 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";
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

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (loading) return <p className="p-4 text-slate-500">Yükleniyor…</p>;
  if (err) return <p className="p-4 text-red-500">{err}</p>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden space-y-5">
      <div className="admin-section p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge-soft">Haberler</span>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Haberler
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Listeler ve butonlar koyu/açık temaya uygun hale getirildi.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara (başlık/içerik)"
              className={inputCls}
            />
            <Link to="/admin/journals/add" className="btn-admin-primary shrink-0">
              + Yeni Haber
            </Link>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card p-6 text-center text-slate-500 dark:text-slate-300">
          Kayıt bulunamadı.
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:hidden">
            {filtered.map((j) => (
              <div key={j._id} className="admin-card p-4 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  {j.cover?.url ? (
                    <img
                      src={j.cover.url}
                      alt={j.title}
                      className="h-16 w-24 object-cover rounded-md border border-slate-200/70 dark:border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-md border border-dashed bg-slate-100/70 grid place-items-center text-xs text-slate-400 shrink-0 dark:bg-slate-800/60 dark:border-slate-700">
                      Kapak yok
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div
                      className="font-semibold text-slate-900 leading-snug break-words dark:text-white"
                      style={clamp2}
                      title={j.title}
                    >
                      {j.title}
                    </div>
                    <div
                      className="mt-1 text-xs text-slate-500 break-words dark:text-slate-300"
                      style={clamp2}
                      title={j.content}
                    >
                      {j.content}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      {j.createdAt
                        ? new Date(j.createdAt).toLocaleDateString("tr-TR")
                        : "-"}{" "}
                      • Beğeni: {j.likesCount ?? 0}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/admin/journals/edit/${j._id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(j._id, j.title)}
                    className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="-mx-4 sm:mx-0 overflow-x-auto hidden sm:block">
            <div className="admin-card p-0 overflow-hidden">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-slate-50/70 text-left text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                  <tr>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Kapak
                    </th>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Başlık
                    </th>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Tarih
                    </th>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Beğeni
                    </th>
                    <th className="border border-slate-200/70 p-3 w-40 dark:border-slate-800/70">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr
                      key={j._id}
                      className="align-top transition hover:bg-indigo-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        {j.cover?.url ? (
                          <img
                            src={j.cover.url}
                            alt={j.title}
                            className="h-16 w-24 object-cover rounded-md shadow-sm"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {j.title}
                        </div>
                        <div className="mt-1 text-slate-500 max-w-[40ch] line-clamp-2 dark:text-slate-300">
                          {j.content}
                        </div>
                      </td>
                      <td className="border border-slate-200/70 p-3 whitespace-nowrap dark:border-slate-800/70">
                        {j.createdAt
                          ? new Date(j.createdAt).toLocaleDateString("tr-TR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        {j.likesCount ?? 0}
                      </td>
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/journals/edit/${j._id}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(j._id, j.title)}
                          className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
