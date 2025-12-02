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
} from "../../components/ProgressCenter";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState(null);
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
      await api.put(`/services/${id}`, formData, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              Math.round((evt.loaded / evt.total) * 100),
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
    }
  };

  if (loading) return <div className="p-4">Yükleniyor...</div>;
  if (!serviceData) return <p className="p-4 text-red-600">Hizmet bulunamadı.</p>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto w-full max-w-[900px] px-2 sm:px-4">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Güncelle
              </p>
              <h1 className="text-2xl font-bold text-slate-900">
                Hizmeti Düzenle
              </h1>
            </div>
          </div>
          <ServiceForm initialData={serviceData} onSubmit={handleSubmit} />
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
