import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import JournalForm from "../../components/JournalForm.jsx";
import api from "../../../api.js";

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOne = async () => {
    try {
      const { data } = await api.get(`/journals/${id}`);
      setInitialData(data);
    } catch (err) {
      console.error("GET /journals/:id error:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Haber getirilemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (fd) => {
    try {
      await api.put(`/journals/${id}`, fd);
      message.success("Haber güncellendi");
      navigate("/admin/journals");
    } catch (err) {
      console.error("PUT /journals/:id error:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Güncellenemedi.");
    }
  };

  const handleRemoveAsset = async (publicId) => {
    if (!window.confirm("Bu medyayı silmek istiyor musunuz?")) return;
    try {
      await api.delete(
        `/journals/${id}/assets/${encodeURIComponent(publicId)}`
      );
      message.success("Medya silindi");
      // local state güncelle
      setInitialData((prev) =>
        prev
          ? {
              ...prev,
              assets: (prev.assets || []).filter(
                (a) => a.publicId !== publicId
              ),
            }
          : prev
      );
    } catch (err) {
      console.error("DELETE asset error:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Medya silinemedi.");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData)
    return <div className="p-4 text-red-600">Haber bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Haberi Düzenle</h2>
      <JournalForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onRemoveAsset={handleRemoveAsset}
      />
    </div>
  );
};

export default EditJournal;
