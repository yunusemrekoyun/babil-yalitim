// src/admin/pages/service/EditService.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { message } from "antd";
import api from "../../../api.js";
import ServiceForm from "../../components/ServiceForm.jsx";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setInitialData(data);
      } catch (err) {
        console.error("Servis alınamadı:", err);
        message.error(
          err.response?.data?.message || "Servis bilgisi alınamadı"
        );
      }
    };
    fetchService();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await api.put(`/services/${id}`, formData);
      message.success("Servis başarıyla güncellendi!");
      navigate("/admin/services");
    } catch (err) {
      console.error("Servis güncellenemedi:", err);
      message.error(err.response?.data?.message || "Servis güncellenemedi");
    }
  };

  if (!initialData) {
    return <p className="p-4">Yükleniyor...</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Servisi Düzenle</h2>
      <ServiceForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditService;
