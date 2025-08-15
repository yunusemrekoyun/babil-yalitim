import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";
import ToastAlert from "../../components/ToastAlert";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // toast state
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
        showToast(
          err?.response?.data?.message || "Hizmet yüklenemedi.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/services/${id}`, formData);
      showToast("Hizmet güncellendi", "success");
      navigate("/admin/services");
    } catch (err) {

      console.error("PUT /services/:id error:", err?.response?.data || err);
      showToast(
        err?.response?.data?.message || "Güncelleme başarısız.",
        "error"
      );
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!serviceData) return <p className="text-red-600">Hizmet bulunamadı.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Hizmet Düzenle</h1>
      <ServiceForm initialData={serviceData} onSubmit={handleSubmit} />

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
