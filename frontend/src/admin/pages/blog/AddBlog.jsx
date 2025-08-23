// src/admin/pages/blog/AddBlog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

// Global loader helper'ları
import {
  mountGlobalLoadingToast,
  showGlobalLoading,
  hideGlobalLoading,
} from "../../components/LoadingToast";

function ensureGlobalLoaderMounted() {
  if (typeof window !== "undefined" && !window.__GLT_MOUNTED__) {
    try {
      mountGlobalLoadingToast();
      window.__GLT_MOUNTED__ = true;
    } catch {}
  }
}

function AddBlog({ onRequestClose }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    ensureGlobalLoaderMounted();
  }, []);

  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (fd) => {
    try {
      showGlobalLoading("Kaydediliyor…");

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

  return (
    // overflow-x-hidden: olası taşmaları kes
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto max-w-3xl px-3 sm:px-4 md:px-6">
        <h2 className="mb-4 text-2xl font-semibold">Yeni Blog</h2>

        <BlogForm onSubmit={handleSubmit} />

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

export default AddBlog;
