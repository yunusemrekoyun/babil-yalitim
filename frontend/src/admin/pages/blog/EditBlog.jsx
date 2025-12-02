// src/admin/pages/blog/EditBlog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
} from "../../components/ProgressCenter";

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
    const taskId = createProgressTask("Blog güncelleniyor");
    try {
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch {}
      }

      await api.put(`/blogs/${id}`, fd, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            updateProgressTask(
              taskId,
              Math.round((evt.loaded / evt.total) * 100),
              "İçerik yükleniyor…"
            );
          }
        },
      });
      completeProgressTask(taskId, "Blog güncellendi");
      showToast("Blog güncellendi.", "success");
      navigate("/admin/blogs");
    } catch (e) {
      console.error("PUT /blogs/:id error:", e?.response?.data || e);
      failProgressTask(taskId, "Blog güncellenemedi");
      showToast(e?.response?.data?.message || "Güncelleme başarısız.", "error");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;
  if (!initialData) return <div className="p-4">Kayıt bulunamadı.</div>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Güncelle
              </p>
              <h2 className="mb-2 text-2xl font-semibold text-slate-900">
                Blogu Düzenle
              </h2>
            </div>
          </div>

          <BlogForm initialData={initialData} onSubmit={handleSubmit} />
        </div>

        {toast && (
          <ToastAlert
            msg={toast.msg}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default EditBlog;
