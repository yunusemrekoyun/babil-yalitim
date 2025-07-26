import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import ServiceForm from "../../components/ServiceForm";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services/${id}`);
        if (!res.ok) throw new Error("Servis verisi alınamadı.");
        const data = await res.json();
        setInitialData(data);
      } catch (error) {
        console.error(error);
        message.error("Servis verisi alınamadı.");
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Servis güncellenemedi.");
      message.success("Servis başarıyla güncellendi!");
      navigate("/admin/services");
    } catch (error) {
      console.error(error);
      message.error("Servis güncellenirken hata oluştu.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Servisi Düzenle</h2>
      <ServiceForm onSubmit={handleSubmit} initialData={initialData} />
    </div>
  );
};

export default EditService;