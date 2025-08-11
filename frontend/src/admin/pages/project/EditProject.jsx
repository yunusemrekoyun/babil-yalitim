// src/admin/pages/project/EditProject.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import ProjectForm from "../../components/ProjectForm";
import api from "../../../api";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setInitialData(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("GET /projects/:id error:", err.response?.data || err);
        message.error(err.response?.data?.message || "Proje yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      // Content-Type başlığını ELLE SET ETME!
      await api.put(`/projects/${id}`, formData);
      message.success("Proje güncellendi");
      navigate("/admin/projects");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("PUT /projects/:id error:", err.response?.data || err);
      message.error(err.response?.data?.message || "Güncellenemedi.");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData)
    return <div className="p-4 text-red-600">Proje bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Projeyi Düzenle</h2>
      <ProjectForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProject;
