import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setInitialData(data);
      } catch (e) {

        console.error("GET /blogs/:id error:", e?.response?.data || e);
        message.error(e?.response?.data?.message || "Blog yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const handleSubmit = async (fd) => {
    try {
      await api.put(`/blogs/${id}`, fd); // FormData
      message.success("Blog güncellendi");
      navigate("/admin/blogs");
    } catch (e) {

      console.error("PUT /blogs/:id error:", e?.response?.data || e);
      message.error(e?.response?.data?.message || "Güncelleme başarısız.");
    }
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (!initialData)
    return <div className="p-6 text-red-600">Blog bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Blogu Düzenle</h2>
      <BlogForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditBlog;
