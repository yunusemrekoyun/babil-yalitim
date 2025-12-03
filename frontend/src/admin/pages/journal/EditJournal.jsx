// src/admin/pages/journal/EditJournal.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JournalForm from "../../components/JournalForm.jsx";
import ToastAlert from "../../components/ToastAlert";
import api from "../../../api.js";

import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
  clampProgress,
} from "../../components/ProgressCenter";

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const fetchOne = async () => {
    try {
      const { data } = await api.get(`/journals/${id}`);
      setInitialData(data);
    } catch (err) {
      console.error("GET /journals/:id error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Haber getirilemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (fd) => {
    const taskId = createProgressTask("Haber güncelleniyor");
    try {
      setSubmitting(true);
      await api.put(`/journals/${id}`, fd, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              clampProgress((evt.loaded / evt.total) * 100),
              "Medya yükleniyor…"
            );
          }
        },
      });
      completeProgressTask(taskId, "Haber güncellendi");
      showToast("Haber güncellendi", "success");
      setTimeout(() => navigate("/admin/journals"), 600);
    } catch (err) {
      console.error("PUT /journals/:id error:", err?.response?.data || err);
      failProgressTask(taskId, "Haber güncellenemedi");
      showToast(err?.response?.data?.message || "Güncellenemedi.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveAsset = async (publicId) => {
    if (!window.confirm("Bu medyayı silmek istiyor musunuz?")) return;
    const taskId = createProgressTask("Medya siliniyor");
    try {
      await api.delete(`/journals/${id}/assets/${encodeURIComponent(publicId)}`);
      completeProgressTask(taskId, "Medya silindi");
      showToast("Medya silindi", "success");
      setInitialData((prev) =>
        prev
          ? {
              ...prev,
              assets: (prev.assets || []).filter((a) => a.publicId !== publicId),
            }
          : prev
      );
    } catch (err) {
      console.error("DELETE asset error:", err?.response?.data || err);
      failProgressTask(taskId, "Medya silinemedi");
      showToast(err?.response?.data?.message || "Medya silinemedi.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData) return <div className="p-4 text-red-600">Haber bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1000px] px-2 sm:px-4">
        <div className="admin-section p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
          <div className="relative flex items-start justify-between gap-3 mb-6">
            <div>
              <span className="badge-soft">Güncelle</span>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                Haberi Düzenle
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Medyalar korundu, panel görüntüsü tamamen değişti.
              </p>
            </div>
          </div>

          <div className="relative">
          <JournalForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onRemoveAsset={handleRemoveAsset}
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
};

export default EditJournal;
