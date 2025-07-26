import { useMemo } from "react";
import BlogForm from "../../components/BlogForm";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();

  const initialData = useMemo(() => ({
    title: "",
    summary: "",
    about: "",
    image: "",
    date: "",
  }), []); // 🔒 Sadece ilk render'da oluşur

  const handleAdd = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ekleme başarısız");

      navigate("/admin/blogs");
    } catch (err) {
      console.error("Blog eklenirken hata oluştu:", err);
      alert("Blog eklenemedi");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yeni Blog Ekle</h2>
      <BlogForm initialData={initialData} onSubmit={handleAdd} />
    </div>
  );
};

export default AddBlog;