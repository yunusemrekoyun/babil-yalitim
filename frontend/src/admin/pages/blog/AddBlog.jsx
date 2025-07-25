import BlogForm from "../../components/BlogForm";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const navigate = useNavigate();

  const handleAdd = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ekleme başarısız");

      navigate("/admin/blogs"); // başarı sonrası listeye dön
    } catch (err) {
      console.error("Blog eklenirken hata oluştu:", err);
      alert("Blog eklenemedi");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yeni Blog Ekle</h2>
      <BlogForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddBlog;