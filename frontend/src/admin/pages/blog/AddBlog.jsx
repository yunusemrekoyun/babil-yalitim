// src/admin/pages/blog/AddBlog.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import BlogForm from "../../components/BlogForm.jsx";
import api from "../../../api.js";

const AddBlog = () => {
  const navigate = useNavigate();

  // Formu temiz tutmak için başlangıç verisi
  const initialData = useMemo(
    () => ({
      title: "",
      summary: "",
      about: "",
      image: "",
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD format
    }),
    []
  );

  const handleAdd = async (data) => {
    try {
      await api.post("/blogs", data);
      message.success("Blog başarıyla eklendi");
      navigate("/admin/blogs");
    } catch (err) {
      console.error("Blog eklenirken hata oluştu:", err);
      const errMsg =
        err.response?.data?.message ||
        "Blog eklenemedi. Lütfen tekrar deneyin.";
      message.error(errMsg);
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
