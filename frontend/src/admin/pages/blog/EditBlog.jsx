import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
  clampProgress,
} from "../../utils/progressBus";

function EditBlog({ onRequestClose }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/blogs/${id}`);
        if (!ignore) setInitialData(data);
      } catch (e) {
        console.error("GET /blogs/:id error:", e?.response?.data || e);
        showToast("Blog detayları alınamadı.", "error");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (fd) => {
    const taskId = createProgressTask("Blog güncelleniyor");
    try {
      setSubmitting(true);
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch (closeError) {
          console.warn("onRequestClose failed:", closeError);
        }
      }

      await api.put(`/blogs/${id}`, fd, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              clampProgress((evt.loaded / evt.total) * 100),
              "İçerik yükleniyor…"
            );
          }
        },
      });
      completeProgressTask(taskId, "Blog güncellendi");
      showToast("Blog güncellendi.", "success");
      navigate("/admin/blogs");
    } catch (e) {
      console.error("PUT /blogs/:id error:", e?.response?.data || e);
      failProgressTask(taskId, "Blog güncellenemedi");
      showToast(e?.response?.data?.message || "Güncelleme başarısız.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData) return <div className="p-4">Kayıt bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto max-w-5xl px-3 sm:px-4 md:px-6">
        <div className="admin-section p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
          <div className="relative flex items-start justify-between gap-3 mb-6">
            <div>
              <span className="badge-soft">Güncelle</span>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                Blogu Düzenle
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                İçerikleri koruyarak paneli baştan tasarladık.
              </p>
            </div>
          </div>

          <div className="relative">
            <BlogForm
              initialData={initialData}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>
        </div>

        {toast && (
          <ToastAlert
            msg={toast.msg}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default EditBlog;

EditBlog.propTypes = {
  onRequestClose: PropTypes.func,
};
