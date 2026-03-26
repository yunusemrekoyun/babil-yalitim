// src/admin/pages/blog/BlogList.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";
import OrderSelect from "../../components/OrderSelect";
import api from "../../../api";

// 2 satırlık çok satır ellipsis (Tailwind plugin gerektirmez)
const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const BlogList = () => {
  const inputCls =
    "w-full sm:w-72 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState("");
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/blogs");
      setBlogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("GET /blogs error:", e?.response?.data || e);
      const msg = e?.response?.data?.message || "Bloglar getirilemedi.";
      setErr(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let arr = [...blogs];
    if (s) {
      arr = arr.filter(
        (b) =>
          b.title?.toLowerCase().includes(s) ||
          b.content?.toLowerCase().includes(s) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(s))
      );
    }
    return arr;
  }, [blogs, q]);

  // Sil butonuna basılınca: confirm aç
  const askDelete = (id) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  const handleOrderChange = async (id, nextOrder) => {
    try {
      setOrderingId(id);
      await api.patch(`/blogs/${id}/order`, { displayOrder: nextOrder });
      await fetchBlogs();
      showToast("Blog sırası güncellendi.", "success", 2500);
    } catch (e) {
      console.error("PATCH /blogs/:id/order error:", e?.response?.data || e);
      showToast(
        e?.response?.data?.message || "Blog sırası güncellenemedi.",
        "error"
      );
    } finally {
      setOrderingId("");
    }
  };

  // Confirm "Evet"
  const confirmDelete = async () => {
    const id = confirmTargetId;
    if (!id) return;

    try {
      setConfirmLoading(true);
      await api.delete(`/blogs/${id}`);
      await fetchBlogs();
      showToast("Blog silindi", "success");
    } catch (e) {
      console.error("DELETE /blogs/:id error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Silme işlemi başarısız.", "error");
    } finally {
      setConfirmLoading(false);
      setConfirmOpen(false);
      setConfirmTargetId(null);
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmTargetId(null);
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden space-y-5">
      <div className="admin-section p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge-soft">İçerik</span>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Bloglar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Listeler, butonlar ve kartlar koyu/açık temaya göre yenilendi.
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara (başlık/içerik/etiket)"
              className={inputCls}
            />
            <Link to="/admin/blogs/add" className="btn-admin-primary shrink-0">
              + Yeni Blog
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
            {filtered.map((b) => (
              <div key={b._id} className="admin-card p-4 relative overflow-hidden">
                <div className="flex items-start gap-3">
                  {b.cover?.url ? (
                    <img
                      src={b.cover.url}
                      alt={b.title}
                      className="h-16 w-24 rounded-md object-cover border border-slate-200/70 dark:border-slate-800 shrink-0"
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
                      title={b.title}
                    >
                      {b.title}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {(b.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                      {(b.tags || []).length > 3 && (
                        <span className="text-[11px] text-slate-400">
                          +{b.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Sıra #{b.displayOrder || 1} •{" "}
                      {new Date(b.createdAt).toLocaleDateString("tr-TR")} • Yorum:{" "}
                      {typeof b.commentsCount === "number" ? b.commentsCount : "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Gösterim sırası
                  </div>
                  <OrderSelect
                    value={b.displayOrder || 1}
                    max={blogs.length || 1}
                    onChange={(value) => handleOrderChange(b._id, value)}
                    disabled={orderingId === b._id}
                    className="w-full"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/admin/blogs/edit/${b._id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                  >
                    Düzenle
                  </Link>
                  <Link
                    to={`/admin/blogs/${b._id}/comments`}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-700"
                  >
                    Yorumlar
                  </Link>
                  <button
                    onClick={() => askDelete(b._id)}
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
                      Sıra
                    </th>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Etiketler
                    </th>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Yorum
                    </th>
                    <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      Tarih
                    </th>
                    <th className="border border-slate-200/70 p-3 w-56 dark:border-slate-800/70">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr
                      key={b._id}
                      className="align-top transition hover:bg-indigo-50/60 dark:hover:bg-slate-800/40"
                    >
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        {b.cover?.url ? (
                          <img
                            src={b.cover.url}
                            alt={b.title}
                            className="h-16 w-24 rounded-md object-cover shadow-sm"
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        <div className="font-medium text-slate-800 dark:text-slate-100">
                          {b.title}
                        </div>
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        <OrderSelect
                          value={b.displayOrder || 1}
                          max={blogs.length || 1}
                          onChange={(value) => handleOrderChange(b._id, value)}
                          disabled={orderingId === b._id}
                        />
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        {(b.tags || []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="mr-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          >
                            {t}
                          </span>
                        ))}
                        {(b.tags || []).length > 3 && (
                          <span className="text-[11px] text-slate-400">
                            +{b.tags.length - 3}
                          </span>
                        )}
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        {typeof b.commentsCount === "number"
                          ? b.commentsCount
                          : "-"}
                      </td>
                      <td className="border border-slate-200/70 p-3 whitespace-nowrap dark:border-slate-800/70">
                        {new Date(b.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to={`/admin/blogs/edit/${b._id}`}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                          >
                            Düzenle
                          </Link>
                          <Link
                            to={`/admin/blogs/${b._id}/comments`}
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-700"
                          >
                            Yorumlar
                          </Link>
                          <button
                            onClick={() => askDelete(b._id)}
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

      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Silme Onayı"
        message="Bu blogu silmek istediğinize emin misiniz?"
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => {
          if (confirmLoading) return;
          cancelDelete();
        }}
        loading={confirmLoading}
      />
    </div>
  );
};

export default BlogList;
