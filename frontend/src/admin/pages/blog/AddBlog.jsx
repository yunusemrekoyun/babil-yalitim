// src/admin/pages/blog/AddBlog.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";

import {
  createProgressTask,
  updateProgressTask,
  completeProgressTask,
  failProgressTask,
} from "../../components/ProgressCenter";

function AddBlog({ onRequestClose }) {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const handleSubmit = async (fd) => {
    const taskId = createProgressTask("Blog yükleniyor");
    try {
      if (typeof onRequestClose === "function") {
        try {
          onRequestClose();
        } catch {}
      }

      await api.post("/blogs", fd, {
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
      completeProgressTask(taskId, "Blog eklendi");
      showToast("Blog eklendi.", "success");
      navigate("/admin/blogs");
    } catch (e) {
      console.error("POST /blogs error:", e?.response?.data || e);
      failProgressTask(taskId, "Blog eklenemedi");
      showToast(e?.response?.data?.message || "Blog eklenemedi.", "error");
    }
  };

  return (
    // overflow-x-hidden: olası taşmaları kes
    <div className="p-4 md:p-6 overflow-x-hidden">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6">
        <div className="glass-panel p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                Yeni kayıt
              </p>
              <h2 className="mb-2 text-2xl font-semibold text-slate-900">
                Yeni Blog
              </h2>
            </div>
          </div>

          <BlogForm onSubmit={handleSubmit} />
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

export default AddBlog;
