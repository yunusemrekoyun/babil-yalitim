// src/admin/pages/project/AddProject.jsx
import { useNavigate } from "react-router-dom";
import ProjectForm from "../../components/ProjectForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";
import { useState } from "react";
import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
} from "../../components/ProgressCenter";

const AddProject = ({ onRequestClose }) => {
  const navigate = useNavigate();

  // toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (formData) => {
    const taskId = createProgressTask("Proje yükleniyor");
    try {
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch {}
      }

      await api.post("/projects", formData, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              Math.round((evt.loaded / evt.total) * 100),
              "Yükleniyor…"
            );
          }
        },
      });
      completeProgressTask(taskId, "Proje eklendi");
      showToast("Proje eklendi", "success");
      setTimeout(() => navigate("/admin/projects"), 300);
    } catch (err) {
      console.error("Create /projects error:", err?.response?.data || err);
      failProgressTask(taskId, "Proje eklenemedi");
      showToast(err?.response?.data?.message || "Proje eklenemedi.", "error");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Yeni kayıt
              </p>
              <h2 className="text-2xl font-semibold text-slate-900">
                Yeni Proje
              </h2>
            </div>
          </div>
          <ProjectForm onSubmit={handleSubmit} />
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

export default AddProject;
