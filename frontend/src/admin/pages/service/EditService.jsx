// src/admin/pages/service/EditService.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";
import ToastAlert from "../../components/ToastAlert";
import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
  clampProgress,
} from "../../utils/progressBus";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setServiceData(data);
      } catch (err) {
        console.error("GET /services/:id error:", err?.response?.data || err);
        showToast(err?.response?.data?.message || "Hizmet yüklenemedi.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (formData) => {
    const taskId = createProgressTask("Hizmet güncelleniyor");
    try {
      setSubmitting(true);
      await api.put(`/services/${id}`, formData, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              clampProgress((evt.loaded / evt.total) * 100),
              "Dosyalar yükleniyor…"
            );
          }
        },
      });
      completeProgressTask(taskId, "Hizmet güncellendi");
      showToast("Hizmet güncellendi", "success");
      navigate("/admin/services");
    } catch (err) {
      console.error("PUT /services/:id error:", err?.response?.data || err);
      failProgressTask(taskId, "Hizmet güncellenemedi");
      showToast(err?.response?.data?.message || "Güncelleme başarısız.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Yükleniyor...</div>;
  if (!serviceData) return <p className="p-4 text-red-600">Hizmet bulunamadı.</p>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[1000px] px-2 sm:px-4">
        <div className="admin-section p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
          <div className="relative flex items-start justify-between gap-3 mb-6">
            <div>
              <span className="badge-soft">Güncelle</span>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                Hizmeti Düzenle
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Aynı alanlar, çok daha koyu ve modern bir panel.
              </p>
            </div>
          </div>
          <div className="relative">
          <ServiceForm initialData={serviceData} onSubmit={handleSubmit} submitting={submitting} />
        </div>
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

export default EditService;
