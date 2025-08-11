// src/admin/pages/project/AddProject.jsx
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../../components/ProjectForm";
import api from "../../../api";

const AddProject = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Content-Type başlığını ELLE SET ETME!
      await api.post("/projects", formData);
      message.success("Proje eklendi");
      navigate("/admin/projects");
    } catch (err) {
      // Hata detayını konsola basmak yardımcı olur
      // eslint-disable-next-line no-console
      console.error("Create /projects error:", err.response?.data || err);
      message.error(err.response?.data?.message || "Proje eklenemedi.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Proje</h2>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddProject;
