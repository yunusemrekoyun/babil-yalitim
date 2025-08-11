import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "../../../api";
import ServiceForm from "../../components/ServiceForm";

const AddService = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Content-Type'ı elle set etme; interceptor halleder
      await api.post("/services", formData);
      message.success("Hizmet eklendi");
      navigate("/admin/services");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("POST /services error:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Hizmet eklenemedi.");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Yeni Hizmet Ekle</h1>
      <ServiceForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddService;
