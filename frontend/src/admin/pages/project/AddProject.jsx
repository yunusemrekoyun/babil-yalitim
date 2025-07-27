// src/admin/pages/project/AddProject.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import ProjectForm from "../../components/ProjectForm.jsx";
import api from "../../../api.js";

const AddProject = () => {
  const navigate = useNavigate();

  // Form'un ilk değerleri
  const initialData = useMemo(
    () => ({
      title: "",
      description: "",
      category: "",
      image: "",
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    }),
    []
  );

  const handleAdd = async (data) => {
    try {
      await api.post("/projects", {
        title: data.title,
        description: data.description,
        category: data.category,
        image: data.image,
        date: data.date,
      });
      message.success("Proje başarıyla eklendi");
      navigate("/admin/projects");
    } catch (err) {
      console.error("Proje eklenirken hata oluştu:", err);
      message.error(
        err.response?.data?.message ||
          "Proje eklenemedi. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Yeni Proje Ekle</h2>
      <ProjectForm initialData={initialData} onSubmit={handleAdd} />
    </div>
  );
};

export default AddProject;
