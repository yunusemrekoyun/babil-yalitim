// src/admin/pages/service/AddService.jsx
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";
import ToastAlert from "../../components/ToastAlert";
import { useState } from "react";
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

mountGlobalLoadingToast();

const AddService = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (formData) => {
    try {
      showGlobalLoading("Kaydediliyor…");
      await api.post("/services", formData);
      showToast("Hizmet eklendi", "success");
      navigate("/admin/services");
    } catch (err) {
      console.error("POST /services error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Hizmet eklenemedi.", "error");
    } finally {
      hideGlobalLoading();
    }
  };

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[820px] px-2 sm:px-4">
        <h1 className="text-xl font-bold mb-6">Yeni Hizmet Ekle</h1>
        <ServiceForm onSubmit={handleSubmit} />
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