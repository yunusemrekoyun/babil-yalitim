// src/admin/pages/service/AddService.jsx
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";
import ToastAlert from "../../components/ToastAlert";
import { useState } from "react";

// Global loader helper'ları (components/LoadingToast.jsx içinden)
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

// Modül yüklenirken global loader'ı body'ye bir kez tak
mountGlobalLoadingToast();

const AddService = () => {
  const navigate = useNavigate();

  // toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (formData) => {
    try {
      // Global mini loader’ı aç
      showGlobalLoading("Kaydediliyor…");

      // Content-Type'ı ELLE set etme; interceptor halleder
      await api.post("/services", formData);
      showToast("Hizmet eklendi", "success");
      navigate("/admin/services");
    } catch (err) {
      console.error("POST /services error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Hizmet eklenemedi.", "error");
    } finally {
      // Global mini loader’ı kapat
      hideGlobalLoading();
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl font-bold mb-6">Yeni Hizmet Ekle</h1>
      <ServiceForm onSubmit={handleSubmit} />

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