// src/admin/pages/journal/AddJournal.jsx
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import JournalForm from "../../components/JournalForm.jsx";
import api from "../../../api.js";

const AddJournal = () => {
  const navigate = useNavigate();

  // Form’un initialData’sı
  const initialData = useMemo(
    () => ({
      title: "",
      summary: "",
      content: "",
      image: "",
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    }),
    []
  );

  const handleAdd = async (data) => {
    try {
      await api.post("/journals", {
        title: data.title,
        summary: data.summary,
        about: data.content,
        image: data.image,
        date: data.date,
      });
      message.success("Journal başarıyla eklendi");
      navigate("/admin/journals");
    } catch (err) {
      console.error("Journal eklenirken hata oluştu:", err);
      message.error(
        err.response?.data?.message ||
          "Journal eklenemedi. Lütfen tekrar deneyin."
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yeni Journal Ekle</h2>
      <JournalForm initialData={initialData} onSubmit={handleAdd} />
    </div>
  );
};

export default AddJournal;
