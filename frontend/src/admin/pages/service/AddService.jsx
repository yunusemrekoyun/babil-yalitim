// src/admin/pages/service/AddService.jsx
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";
import ToastAlert from "../../components/ToastAlert";
import { useState } from "react";
import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
} from "../../components/ProgressCenter";

const AddService = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (formData) => {
    const taskId = createProgressTask("Hizmet yükleniyor");
    try {
      await api.post("/services", formData, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            updateProgressTask(taskId, pct, "Dosyalar gönderiliyor…");
          }
        },
      });
      completeProgressTask(taskId, "Hizmet eklendi");
      showToast("Hizmet eklendi", "success");
      navigate("/admin/services");
    } catch (err) {
      console.error("POST /services error:", err?.response?.data || err);
      failProgressTask(taskId, "Hizmet eklenemedi");
      showToast(err?.response?.data?.message || "Hizmet eklenemedi.", "error");
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[900px] px-2 sm:px-4">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Yeni kayıt
              </p>
              <h1 className="text-2xl font-bold text-slate-900">Hizmet Ekle</h1>
            </div>
          </div>
          <ServiceForm onSubmit={handleSubmit} />
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

export default AddService;
