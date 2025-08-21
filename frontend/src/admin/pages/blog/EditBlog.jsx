import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

// Global loader'ı mount et ve helper'ları al
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

// Modül yüklenirken bir kez global loader'ı body'ye takar
mountGlobalLoadingToast();

function EditBlog({ onRequestClose }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/blogs/${id}`);
        if (!ignore) setInitialData(data);
      } catch (e) {
        console.error("GET /blogs/:id error:", e?.response?.data || e);
        showToast("Blog detayları alınamadı.", "error");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id]);

  const handleSubmit = async (fd) => {
    try {
      // Global mini loader’ı aç
      showGlobalLoading("Güncelleniyor…");

      // Modal kullanıyorsan burada kapat
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch {}
      }

      await api.put(`/blogs/${id}`, fd);
      showToast("Blog güncellendi.", "success");
      navigate("/admin/blogs");
    } catch (e) {
      console.error("PUT /blogs/:id error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Güncelleme başarısız.", "error");
    } finally {
      hideGlobalLoading();
    }
  };

  // Modalı submit içinde kapattığımız için burada tetiklemiyoruz
  const handleStartSubmit = undefined;

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData) return <div className="p-4">Kayıt bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Blogu Düzenle</h2>

      <BlogForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onStartSubmit={handleStartSubmit}
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
}

export default EditBlog;