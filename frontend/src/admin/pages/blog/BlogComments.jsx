// frontend/src/admin/pages/BlogComments.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api";
import PropTypes from "prop-types";
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";

const Pill = ({ children, color = "gray" }) => (
  <span
    className={`inline-block rounded-full px-2 py-0.5 text-[11px] bg-${color}-100 text-${color}-700`}
  >
    {children}
  </span>
);
Pill.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "gray",
    "green",
    "yellow",
    "red",
    "blue",
    "sky",
    "emerald",
    "amber",
  ]),
};
Pill.defaultProps = { color: "gray" };

const BlogComments = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null); // { title, comments: [...] }
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | pending | approved

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // Confirm state (silme için)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/blogs/${id}/comments/all`);
      setBlog({
        title: data.title,
        comments: Array.isArray(data.comments) ? data.comments : [],
      });
    } catch (e) {
      console.error(
        "GET /blogs/:id/comments/all error:",
        e?.response?.data || e
      );
      showToast(e?.response?.data?.message || "Yorumlar alınamadı.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let arr = blog?.comments || [];
    if (filter === "approved") arr = arr.filter((c) => c.approved);
    if (filter === "pending") arr = arr.filter((c) => !c.approved);
    if (s) {
      arr = arr.filter(
        (c) =>
          c.name?.toLowerCase().includes(s) ||
          c.email?.toLowerCase().includes(s) ||
          c.body?.toLowerCase().includes(s)
      );
    }
    // son gelen üste
    return [...arr].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [blog, q, filter]);

  const toggleApprove = async (commentId, nextVal) => {
    try {
      await api.patch(`/blogs/${id}/comments/${commentId}/approve`, {
        approved: nextVal,
      });
      // optimistic update
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, approved: nextVal } : c
        ),
      }));
      showToast(nextVal ? "Yorum onaylandı." : "Onay kaldırıldı.", "success");
    } catch (e) {
      console.error("PATCH approve error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Güncellenemedi.", "error");
    }
  };

  // Sil'e basılınca sadece diyalogu aç
  const handleDeleteClick = (commentId) => {
    setPendingDeleteId(commentId);
    setConfirmOpen(true);
  };

  // Onay verilince gerçekten sil
  const confirmDelete = async () => {
    const commentId = pendingDeleteId;
    setConfirmOpen(false);
    setPendingDeleteId(null);
    if (!commentId) return;

    try {
      await api.delete(`/blogs/${id}/comments/${commentId}`);
      setBlog((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      showToast("Yorum silindi.", "success");
    } catch (e) {
      console.error("DELETE comment error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Silinemedi.", "error");
    }
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Yorumlar</h2>
          <p className="text-gray-500 text-sm">
            Blog: <span className="font-medium">{blog?.title || "-"}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara (ad/e‑posta/içerik)"
            className="w-full sm:w-72 rounded-md border px-3 py-2 text-sm"
          />
          <div className="flex gap-1">
            {[
              { k: "all", lbl: "Tümü" },
              { k: "pending", lbl: "Bekleyen" },
              { k: "approved", lbl: "Onaylı" },
            ].map(({ k, lbl }) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 py-2 text-sm rounded-md border ${
                  filter === k
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
          <Link
            to="/admin/blogs"
            className="inline-flex items-center justify-center rounded-md bg-gray-700 px-4 py-2 text-white text-sm hover:bg-gray-800"
          >
            ← Bloglara Dön
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-gray-500">
          Gösterilecek yorum yok.
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="border p-2">Kullanıcı</th>
                <th className="border p-2">Yorum</th>
                <th className="border p-2">Durum</th>
                <th className="border p-2">Tarih</th>
                <th className="border p-2 w-52">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="align-top">
                  <td className="border p-2">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-gray-500 text-xs">{c.email}</div>
                  </td>
                  <td className="border p-2">
                    <div className="whitespace-pre-wrap">{c.body}</div>
                  </td>
                  <td className="border p-2">
                    {c.approved ? (
                      <Pill color="green">Onaylı</Pill>
                    ) : (
                      <Pill color="yellow">Bekliyor</Pill>
                    )}
                  </td>
                  <td className="border p-2">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleString("tr-TR")
                      : "-"}
                  </td>
                  <td className="border p-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleApprove(c._id, !c.approved)}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-white ${
                          c.approved
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                      >
                        {c.approved ? "Onayı Kaldır" : "Onayla"}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(c._id)}
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

          <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t">
            Toplam: {blog?.comments?.length || 0} • Görüntülenen:{" "}
            {filtered.length}
          </div>
        </div>
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

      {/* Silme onayı */}
      <ConfirmDialog
        open={confirmOpen}
        title="Yorumu Sil"
        message="Bu yorumu silmek istediğinize emin misiniz?"
        confirmText="Evet, sil"
        cancelText="Vazgeç"
        type="error"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default BlogComments;
