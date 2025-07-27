// src/admin/pages/service/AddService.jsx
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "../../../api.js";
import ServiceForm from "../../components/ServiceForm.jsx";

const AddService = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await api.post("/services", formData);
      message.success("Servis başarıyla eklendi!");
      navigate("/admin/services");
    } catch (err) {
      console.error("Servis eklenirken hata:", err);
      message.error(err.response?.data?.message || "Servis eklenemedi");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Yeni Servis Ekle</h2>
      <ServiceForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddService;
