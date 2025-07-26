import JournalForm from "../../components/JournalForm";
import { useNavigate } from "react-router-dom";

const AddJournal = () => {
  const navigate = useNavigate();

  const handleAdd = async (data) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/journals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Ekleme başarısız");

      navigate("/admin/journals");
    } catch (err) {
      console.error("Journal eklenirken hata oluştu:", err);
      alert("Journal eklenemedi");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Yeni Journal Ekle</h2>
      <JournalForm onSubmit={handleAdd} />
    </div>
  );
};

export default AddJournal;