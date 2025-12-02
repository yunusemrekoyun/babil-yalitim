// src/admin/pages/project/EditProject.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../../components/ProjectForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";
import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
} from "../../components/ProgressCenter";

const EditProject = ({ onRequestClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setInitialData(data);
      } catch (err) {
        console.error("GET /projects/:id error:", err?.response?.data || err);
        showToast(err?.response?.data?.message || "Proje yüklenemedi.", "error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (formData) => {
    const taskId = createProgressTask("Proje güncelleniyor");
    try {
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch {}
      }

      await api.put(`/projects/${id}`, formData, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              Math.round((evt.loaded / evt.total) * 100),
              "Medya yükleniyor…"
            );
          }
        },
      });
      completeProgressTask(taskId, "Proje güncellendi");
      showToast("Proje güncellendi", "success");
      setTimeout(() => navigate("/admin/projects"), 300);
    } catch (err) {
      console.error("PUT /projects/:id error:", err?.response?.data || err);
      failProgressTask(taskId, "Proje güncellenemedi");
      showToast(err?.response?.data?.message || "Güncellenemedi.", "error");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData)
    return <div className="p-4 text-red-600">Proje bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Güncelle
              </p>
              <h2 className="mb-2 text-2xl font-semibold text-slate-900">
                Projeyi Düzenle
              </h2>
            </div>
          </div>
          <ProjectForm initialData={initialData} onSubmit={handleSubmit} />
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
  );
};

export default EditProject;
