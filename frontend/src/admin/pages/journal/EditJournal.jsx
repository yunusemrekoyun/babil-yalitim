import JournalForm from "../../components/JournalForm";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals/${id}`);
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error("Journal getirilirken hata:", err);
      }
    };
    fetchJournal();
  }, [id]);

  const handleEdit = async (updatedData) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) throw new Error("Güncelleme başarısız");

      navigate("/admin/journals");
    } catch (err) {
      console.error("Güncelleme hatası:", err);
      alert("Güncelleme yapılamadı");
    }
  };

  if (!initialData) return <div className="p-6">Yükleniyor...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Journal Düzenle</h2>
      <JournalForm initialData={initialData} onSubmit={handleEdit} />
    </div>
  );
};

export default EditJournal;