// src/admin/pages/journal/EditJournal.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { message } from "antd";
import JournalForm from "../../components/JournalForm.jsx";
import api from "../../../api.js";

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const { data } = await api.get(`/journals/${id}`);
        setInitialData({
          title: data.title,
          summary: data.summary,
          content: data.about || "",
          image: data.image || "",
          date: data.date ? data.date.slice(0, 10) : "",
        });
      } catch (err) {
        console.error("Journal getirilirken hata:", err);
        message.error(
          err.response?.data?.message || "Journal bilgileri alınamadı."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchJournal();
  }, [id]);

  const handleEdit = async (data) => {
    try {
      await api.put(`/journals/${id}`, {
        title: data.title,
        summary: data.summary,
        about: data.content,
        image: data.image,
        date: data.date,
      });
      message.success("Journal başarıyla güncellendi");
      navigate("/admin/journals");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      message.error(
        err.response?.data?.message || "Güncelleme sırasında hata oluştu."
      );
    }
  };

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (!initialData)
    return <div className="p-6 text-red-500">Journal bulunamadı.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Journal Düzenle</h2>
      <JournalForm initialData={initialData} onSubmit={handleEdit} />
    </div>
  );
};

export default EditJournal;
