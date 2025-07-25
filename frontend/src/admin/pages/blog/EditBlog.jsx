import BlogForm from "../../components/BlogForm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error("Blog getirilirken hata:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleEdit = async (updatedData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      navigate("/admin/blogs");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme yapılamadı");
    }
  };

  if (!initialData) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Blog Düzenle</h2>
      <BlogForm initialData={initialData} onSubmit={handleEdit} />
    </div>
  );
};

export default EditBlog;