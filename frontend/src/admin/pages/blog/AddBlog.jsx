import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

// Global loader'ı mount et ve helper'ları al (YENİ DOSYA YOK)
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

// Modül yüklenirken bir kez global loader'ı body'ye takar
mountGlobalLoadingToast();

function AddBlog({ onRequestClose }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (fd) => {
    try {
      // Global mini loader’ı aç
      showGlobalLoading("Kaydediliyor…");

      // Modal kullanıyorsan burada kapat (component unmount olsa da loader kalır)
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch {}
      }

      await api.post("/blogs", fd);
      showToast("Blog eklendi.", "success");
      navigate("/admin/blogs");
    } catch (e) {
      console.error("POST /blogs error:", e?.response?.data || e);
      showToast(e?.response?.data?.message || "Blog eklenemedi.", "error");
    } finally {
      hideGlobalLoading();
    }
  };

  // Modalı submit içinde kapattığımız için burada tetiklemiyoruz
  const handleStartSubmit = undefined;

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Blog</h2>

      <BlogForm onSubmit={handleSubmit} onStartSubmit={handleStartSubmit} />

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

export default AddBlog;