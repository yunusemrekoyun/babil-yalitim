// src/admin/components/BlogForm.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

function BlogForm({ initialData, onSubmit, onStartSubmit })
{
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [coverFile, setCoverFile] = useState(null);
  const [assetsFiles, setAssetsFiles] = useState([]);

  useEffect(() =>
  {
    if (initialData)
    {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
    }
  }, [initialData]);

  const handleFileChange = (e) =>
  {
    const file = e.target.files?.[0];
    setCoverFile(file || null);
  };

  const handleAssetsChange = (e) =>
  {
    const files = Array.from(e.target.files || []);
    setAssetsFiles(files);
  };

  const handleSubmit = async (e) =>
  {
    e.preventDefault();

    // Parent’a "başladı" sinyali ver → modal hemen kapansın
    if (typeof onStartSubmit === "function")
    {
      try { onStartSubmit(); } catch {}
    }

    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("content", content);

    if (coverFile) fd.append("cover", coverFile);
    if (assetsFiles?.length)
    {
      assetsFiles.forEach((f) => fd.append("assets", f));
    }

    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Başlık</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md border px-3 py-2 outline-none focus:ring"
          placeholder="Blog başlığı"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">İçerik</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[160px] rounded-md border px-3 py-2 outline-none focus:ring"
          placeholder="İçeriği yazın…"
          required
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Kapak (opsiyonel)</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        {initialData?.cover?.url && (
          <div className="text-xs text-gray-500">Mevcut: {initialData.cover.url}</div>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Ek Medya (opsiyonel)</label>
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleAssetsChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Kaydet
        </button>
      </div>
    </form>
  );
}

BlogForm.propTypes = {
  initialData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    cover: PropTypes.shape({
      url: PropTypes.string,
      publicId: PropTypes.string,
      resourceType: PropTypes.oneOf(["image", "video"])
    }),
    assets: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        publicId: PropTypes.string,
        resourceType: PropTypes.oneOf(["image", "video"])
      })
    )
  }),
  onSubmit: PropTypes.func.isRequired,
  // Modalı submit başında kapatmak için (opsiyonel)
  onStartSubmit: PropTypes.func
};

export default BlogForm;