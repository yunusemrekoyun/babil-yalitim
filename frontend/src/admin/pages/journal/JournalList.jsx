// src/admin/pages/journal/JournalList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api.js";

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const { data } = await api.get("/journals");
        setJournals(data);
      } catch (err) {
        console.error("Journaller alınamadı", err);
        setError(
          err.response?.data?.message ||
            "Journaller getirilemedi. Lütfen tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu journali silmek istediğinize emin misiniz?"))
      return;

    try {
      await api.delete(`/journals/${id}`);
      setJournals((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      console.error("Silme işlemi başarısız", err);
      alert(err.response?.data?.message || "Silme sırasında hata oluştu");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Journal Listesi</h2>
        <Link
          to="/admin/journals/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Yeni Journal Ekle
        </Link>
      </div>

      {journals.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          Henüz journal eklenmemiş.
        </p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">Başlık</th>
              <th className="py-2 px-4 border-b">Tarih</th>
              <th className="py-2 px-4 border-b">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {journals.map((journal) => (
              <tr key={journal._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{journal.title}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(journal.date).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <Link
                    to={`/admin/journals/edit/${journal._id}`}
                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(journal._id)}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JournalList;
