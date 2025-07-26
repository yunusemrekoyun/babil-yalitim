import { useNavigate } from "react-router-dom";
import { message } from "antd";
import ServiceForm from "../../components/ServiceForm";

const AddService = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Servis eklenemedi");

      message.success("Servis başarıyla eklendi!");
      navigate("/admin/services");
    } catch (error) {
      console.error(error);
      message.error("Servis eklenirken bir hata oluştu.");
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