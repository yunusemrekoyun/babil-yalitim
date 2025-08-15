// src/admin/pages/project/AddProject.jsx
import { useNavigate } from "react-router-dom";
import ProjectForm from "../../components/ProjectForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";
import { useState } from "react";
const AddProject = () => {
  const navigate = useNavigate();

  // toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (formData) => {
    try {
      // Content-Type başlığını ELLE set etme!
      await api.post("/projects", formData);
      showToast("Proje eklendi", "success");
      setTimeout(() => navigate("/admin/projects"), 300);
    } catch (err) {

      console.error("Create /projects error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Proje eklenemedi.", "error");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Proje</h2>
      <ProjectForm onSubmit={handleSubmit} />

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

export default AddProject;
