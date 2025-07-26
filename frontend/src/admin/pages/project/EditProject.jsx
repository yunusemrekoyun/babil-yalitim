import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import ProjectForm from "../../components/ProjectForm";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`${apiUrl}/projects/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (error) {
        console.error("Proje alınamadı:", error);
        message.error("Proje bilgileri alınamadı");
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        message.success("Proje güncellendi");
        navigate("/admin/projects");
      } else {
        message.error("Güncelleme başarısız");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      message.error("Proje güncellenemedi");
    }
  };

  return (
    <main className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Projeyi Düzenle</h2>
      {initialData ? (
        <ProjectForm initialData={initialData} onSubmit={handleSubmit} />
      ) : (
        <p>Yükleniyor...</p>
      )}
    </main>
  );
};

export default EditProject;