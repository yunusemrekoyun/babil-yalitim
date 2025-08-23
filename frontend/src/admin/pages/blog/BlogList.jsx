// src/admin/pages/blog/BlogList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";
import api from "../../../api";

// 2 satırlık çok satır ellipsis (Tailwind plugin gerektirmez)
const clamp2 = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // confirm
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
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
    };
    fetchBlogs();
  }, []);

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

  // Confirm "Evet"
  const confirmDelete = async () => {
    const id = confirmTargetId;
    setConfirmOpen(false);
    setConfirmTargetId(null);
    if (!id) return;

    try {
      await api.delete(`/blogs/${id}`);
      showToast("Blog silindi", "success");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      console.error("DELETE /blogs/:id error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Silme işlemi başarısız.", "error");
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setConfirmTargetId(null);
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    // overflow-x-hidden: olası 1-2px taşmaları kes
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Bloglar</h2>

        <div className="flex w-full gap-2 md:w-auto">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara (başlık/içerik/etiket)"
            className="min-w-0 w-full sm:w-72 rounded-md border px-3 py-2 text-sm"
          />
          <Link
            to="/admin/blogs/add"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            + Yeni Blog
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-gray-500">
          Kayıt bulunamadı.
        </div>
      ) : (
        <>
          {/* --- XS: Kart görünümü (scroll yok) --- */}
          <div className="grid gap-3 sm:hidden">
            {filtered.map((b) => (
              <div key={b._id} className="rounded-xl border bg-white p-3">
                <div className="flex items-start gap-3">
                  {b.cover?.url ? (
                    <img
                      src={b.cover.url}
                      alt={b.title}
                      className="h-16 w-24 rounded-md object-cover border shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-24 rounded-md border bg-gray-50 grid place-items-center text-xs text-gray-400 shrink-0">
                      Kapak yok
                    </div>
                  )}

                  {/* min-w-0: içeriğin kırılıp sarmasına izin ver */}
                  <div className="min-w-0 flex-1">
                    {/* BAŞLIK: artık 'truncate' yok; 2 satıra kadar sarıyor */}
                    <div
                      className="font-medium text-gray-900 leading-snug break-words"
                      style={clamp2}
                      title={b.title}
                    >
                      {b.title}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1">
                      {(b.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                      {(b.tags || []).length > 3 && (
                        <span className="text-[11px] text-gray-400">
                          +{b.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-1 text-[11px] text-gray-500">
                      {new Date(b.createdAt).toLocaleDateString("tr-TR")} •{" "}
                      Yorum:{" "}
                      {typeof b.commentsCount === "number"
                        ? b.commentsCount
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/admin/blogs/edit/${b._id}`}
                    className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-600 text-xs"
                  >
                    Düzenle
                  </Link>
                  <Link
                    to={`/admin/blogs/${b._id}/comments`}
                    className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700 text-xs"
                  >
                    Yorumlar
                  </Link>
                  <button
                    onClick={() => askDelete(b._id)}
                    className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700 text-xs"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- SM ve üstü: Tablo (kendi içinde yatay kaydırmalı) --- */}
          <div className="-mx-4 sm:mx-0 overflow-x-auto hidden sm:block">
            <table className="min-w-[900px] w-full border-collapse overflow-hidden rounded-lg border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="border p-2">Kapak</th>
                  <th className="border p-2">Başlık</th>
                  <th className="border p-2">Etiketler</th>
                  <th className="border p-2">Yorum</th>
                  <th className="border p-2">Tarih</th>
                  <th className="border p-2 w-56">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b._id} className="align-top">
                    <td className="border p-2">
                      {b.cover?.url ? (
                        <img
                          src={b.cover.url}
                          alt={b.title}
                          className="h-16 w-24 rounded-md object-cover"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="border p-2">
                      <div className="font-medium">{b.title}</div>
                    </td>
                    <td className="border p-2">
                      {(b.tags || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="mr-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                      {(b.tags || []).length > 3 && (
                        <span className="text-[11px] text-gray-400">
                          +{b.tags.length - 3}
                        </span>
                      )}
                    </td>
                    <td className="border p-2">
                      {typeof b.commentsCount === "number"
                        ? b.commentsCount
                        : "-"}
                    </td>
                    <td className="border p-2 whitespace-nowrap">
                      {new Date(b.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="border p-2">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/admin/blogs/edit/${b._id}`}
                          className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-600"
                        >
                          Düzenle
                        </Link>
                        <Link
                          to={`/admin/blogs/${b._id}/comments`}
                          className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700"
                        >
                          Yorumlar
                        </Link>
                        <button
                          onClick={() => askDelete(b._id)}
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
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="Silme Onayı"
        message="Bu blogu silmek istediğinize emin misiniz?"
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default BlogList;