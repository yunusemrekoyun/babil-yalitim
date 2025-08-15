// src/admin/pages/project/EditProject.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm from "../../components/ProjectForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setInitialData(data);
      } catch (err) {

        console.error("GET /projects/:id error:", err?.response?.data || err);
        showToast(
          err?.response?.data?.message || "Proje yüklenemedi.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      // Content-Type başlığını ELLE set etme!
      await api.put(`/projects/${id}`, formData);
      showToast("Proje güncellendi", "success");
      setTimeout(() => navigate("/admin/projects"), 300);
    } catch (err) {

      console.error("PUT /projects/:id error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Güncellenemedi.", "error");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData)
    return <div className="p-4 text-red-600">Proje bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Projeyi Düzenle</h2>
      <ProjectForm initialData={initialData} onSubmit={handleSubmit} />

      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EditProject;
