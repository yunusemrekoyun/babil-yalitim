import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const res = await fetch(`${apiUrl}/journals`);
        const data = await res.json();
        setJournals(data);
      } catch (error) {
        console.error("Journaller alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bu journalı silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${apiUrl}/journals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJournals((prev) => prev.filter((j) => j._id !== id));
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (error) {
      console.error("Silme hatası", error);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Journal Listesi</h2>
        <Link to="/admin/journals/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Yeni Journal Ekle
        </Link>
      </div>
      {journals.length === 0 ? (
        <p>Henüz journal eklenmemiş.</p>
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
              <tr key={journal._id}>
                <td className="py-2 px-4 border-b">{journal.title}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(journal.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <Link
                    to={`/admin/journals/edit/${journal._id}`}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(journal._id)}
                    className="text-red-600 hover:underline"
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