import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setServiceData(data);
      } catch (err) {
        console.error("GET /services/:id error:", err?.response?.data || err);
        message.error(err?.response?.data?.message || "Hizmet yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/services/${id}`, formData);
      message.success("Hizmet güncellendi");
      navigate("/admin/services");
    } catch (err) {
      console.error("PUT /services/:id error:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Güncelleme başarısız.");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (!serviceData) return <p className="text-red-600">Hizmet bulunamadı.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Hizmet Düzenle</h1>
      <ServiceForm initialData={serviceData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditService;
