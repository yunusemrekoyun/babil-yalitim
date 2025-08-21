// src/admin/pages/journal/EditJournal.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import JournalForm from "../../components/JournalForm.jsx";
import ToastAlert from "../../components/ToastAlert";
import api from "../../../api.js";

// Global loader helper'larını LoadingToast'tan al
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

// Modül yüklenirken bir kez global loader'ı body'ye tak
mountGlobalLoadingToast();

const EditJournal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Toast state
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const fetchOne = async () => {
    try {
      const { data } = await api.get(`/journals/${id}`);
      setInitialData(data);
    } catch (err) {
      console.error("GET /journals/:id error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Haber getirilemedi.", "error");
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
      // Global mini loader’ı aç
      showGlobalLoading("Güncelleniyor…");

      await api.put(`/journals/${id}`, fd);
      showToast("Haber güncellendi", "success");
      setTimeout(() => navigate("/admin/journals"), 600);
    } catch (err) {
      console.error("PUT /journals/:id error:", err?.response?.data || err);
      showToast(err?.response?.data?.message || "Güncellenemedi.", "error");
    } finally {
      // Global mini loader’ı kapat
      hideGlobalLoading();
    }
  };

  const handleRemoveAsset = async (publicId) => {
    if (!window.confirm("Bu medyayı silmek istiyor musunuz?")) return;
    try {
      // Asset silerken de kısa süreli loader göstermek istersen:
      showGlobalLoading("Siliniyor…");

      await api.delete(
        `/journals/${id}/assets/${encodeURIComponent(publicId)}`
      );
      showToast("Medya silindi", "success");
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
      showToast(err?.response?.data?.message || "Medya silinemedi.", "error");
    } finally {
      hideGlobalLoading();
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

      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EditJournal;