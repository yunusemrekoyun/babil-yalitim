// src/admin/pages/journal/AddJournal.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JournalForm from "../../components/JournalForm.jsx";
import ToastAlert from "../../components/ToastAlert";
import api from "../../../api.js";

// Global loader helper'larını LoadingToast'tan al
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

// Modül yüklenirken bir kez global loader'ı body'ye tak
mountGlobalLoadingToast();

const AddJournal = () => {
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (fd) => {
    try {
      // Global mini loader’ı aç
      showGlobalLoading("Kaydediliyor…");

      // FormData: Content-Type set etme!
      await api.post("/journals", fd);
      showToast("Haber eklendi", "success");
      setTimeout(() => navigate("/admin/journals"), 600);
    } catch (err) {
      console.error("POST /journals error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Haber eklenemedi.", "error");
    } finally {
      // Global mini loader’ı kapat
      hideGlobalLoading();
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Haber</h2>
      <JournalForm onSubmit={handleSubmit} />

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

export default AddJournal;