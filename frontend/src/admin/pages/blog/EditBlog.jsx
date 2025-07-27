// src/admin/pages/blog/EditBlog.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import BlogForm from "../../components/BlogForm.jsx";
import api from "../../../api.js";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setInitialData({
          title: data.title,
          summary: data.summary,
          about: data.about,
          image: data.image,
          date: data.date.slice(0, 10), // yyyy-MM-dd format
        });
      } catch (err) {
        console.error("Blog getirilirken hata:", err);
        message.error(
          err.response?.data?.message || "Blog bilgileri alınamadı."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleEdit = async (updatedData) => {
    try {
      await api.put(`/blogs/${id}`, updatedData);
      message.success("Blog başarıyla güncellendi");
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      message.error(
        err.response?.data?.message || "Güncelleme sırasında hata oluştu."
      );
    }
  };

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  if (!initialData) {
    return <div className="p-6 text-red-500">Blog bulunamadı.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Blog Düzenle</h2>
      <BlogForm initialData={initialData} onSubmit={handleEdit} />
    </div>
  );
};

export default EditBlog;
