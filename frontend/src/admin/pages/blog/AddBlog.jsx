// frontend/src/admin/pages/AddBlog.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BlogForm from "../../components/BlogForm";
import ToastAlert from "../../components/ToastAlert";
import api from "../../../api";

const AddBlog = () => {
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (fd) => {
    try {
      await api.post("/blogs", fd); // FormData — Content-Type elle set etme
      showToast("Blog eklendi", "success");
      // Toast görünsün diye ufak gecikme
      setTimeout(() => navigate("/admin/blogs"), 600);
    } catch (e) {
      console.error("POST /blogs error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Blog eklenemedi.", "error");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Blog</h2>
      <BlogForm onSubmit={handleSubmit} />

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

export default AddBlog;
