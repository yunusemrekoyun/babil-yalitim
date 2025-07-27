// src/admin/pages/project/EditProject.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import ProjectForm from "../../components/ProjectForm.jsx";
import api from "../../../api.js";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setInitialData({
          title: data.title,
          description: data.description,
          category: data.category || "",
          image: data.image || "",
          date: data.date ? data.date.slice(0, 10) : "",
        });
      } catch (err) {
        console.error("Proje getirilirken hata:", err);
        message.error(
          err.response?.data?.message || "Proje bilgileri alınamadı."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleEdit = async (data) => {
    try {
      await api.put(`/projects/${id}`, {
        title: data.title,
        description: data.description,
        category: data.category,
        image: data.image,
        date: data.date,
      });
      message.success("Proje başarıyla güncellendi");
      navigate("/admin/projects");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      message.error(
        err.response?.data?.message || "Güncelleme sırasında hata oluştu."
      );
    }
  };

  if (loading) return <div className="p-4">Yükleniyor...</div>;
  if (!initialData)
    return <div className="p-4 text-red-500">Proje bulunamadı.</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Projeyi Düzenle</h2>
      <ProjectForm initialData={initialData} onSubmit={handleEdit} />
    </div>
  );
};

export default EditProject;
