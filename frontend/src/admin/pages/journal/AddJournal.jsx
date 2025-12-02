// src/admin/pages/journal/AddJournal.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JournalForm from "../../components/JournalForm.jsx";
import ToastAlert from "../../components/ToastAlert";
import api from "../../../api.js";

import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
} from "../../components/ProgressCenter";

const AddJournal = () => {
  const navigate = useNavigate();

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (fd) => {
    const taskId = createProgressTask("Haber yükleniyor");
    try {
      await api.post("/journals", fd, {
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
      completeProgressTask(taskId, "Haber eklendi");
      showToast("Haber eklendi", "success");
      setTimeout(() => navigate("/admin/journals"), 600);
    } catch (err) {
      console.error("POST /journals error:", err?.response?.data || err);
      failProgressTask(taskId, "Haber eklenemedi");
      showToast(err?.response?.data?.message || "Haber eklenemedi.", "error");
    }
  };

  return (
    // dışta genel padding, taşmaları kes
    <div className="p-4 md:p-6 overflow-x-hidden">
      {/* içerik konteyneri: ortalı + genişlik sınırlı + ek yatay padding */}
      <div className="mx-auto w-full max-w-[900px] px-2 sm:px-4">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Yeni kayıt
              </p>
              <h2 className="mb-2 text-2xl font-semibold text-slate-900">
                Yeni Haber
              </h2>
            </div>
          </div>

          <JournalForm onSubmit={handleSubmit} />
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

export default AddJournal;
