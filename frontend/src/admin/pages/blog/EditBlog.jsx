// frontend/src/admin/pages/EditBlog.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // Confirm (güncelleme onayı)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFd, setPendingFd] = useState(null); // onaydan sonra PUT edilecek FD

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/blogs/${id}`);
        setInitialData(data);
      } catch (e) {
        console.error("GET /blogs/:id error:", e?.response?.data || e);
        showToast(e?.response?.data?.message || "Blog yüklenemedi.", "error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  // Form’dan gelen submit’i önce onaya bağla
  const handleSubmit = async (fd) => {
    setPendingFd(fd);
    setConfirmOpen(true);
  };

  // Onaylandı → PUT
  const confirmUpdate = async () => {
    const fd = pendingFd;
    setConfirmOpen(false);
    setPendingFd(null);
    if (!fd) return;

    try {
      await api.put(`/blogs/${id}`, fd);
      showToast("Blog güncellendi", "success");
      navigate("/admin/blogs");
    } catch (e) {
      console.error("PUT /blogs/:id error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Güncelleme başarısız.", "error");
    }
  };

  const cancelUpdate = () => {
    setConfirmOpen(false);
    setPendingFd(null);
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (!initialData)
    return <div className="p-6 text-red-600">Blog bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Blogu Düzenle</h2>

      <BlogForm initialData={initialData} onSubmit={handleSubmit} />

      {/* Toast */}
      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* Güncelleme onayı */}
      <ConfirmDialog
        open={confirmOpen}
        title="Güncellemeyi Onayla"
        message="Bu blogu güncellemek istediğinize emin misiniz?"
        confirmText="Evet, güncelle"
        cancelText="Vazgeç"
        type="info"
        onConfirm={confirmUpdate}
        onCancel={cancelUpdate}
      />
    </div>
  );
};

export default EditBlog;
