// src/admin/pages/project/ProjectList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import PropTypes from "prop-types";
import api from "../../../api";

const Card = ({ project, onDelete }) => {
  const coverIsVideo = project?.cover?.resourceType === "video";
  const coverSrc = project?.cover?.url || "";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
        {coverIsVideo ? (
          <video
            src={coverSrc}
            className="h-full w-full object-cover"
            controls={false}
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={coverSrc}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="mt-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {project.description}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span className="px-2 py-0.5 rounded bg-gray-100">
            {project.category || "Kategori yok"}
          </span>
          <span>{new Date(project.createdAt).toLocaleDateString("tr-TR")}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/admin/projects/edit/${project._id}`}
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-white text-sm hover:bg-indigo-700"
        >
          Düzenle
        </Link>
        <button
          onClick={() => onDelete(project._id)}
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-700"
        >
          Sil
        </button>
      </div>
    </div>
  );
};

Card.propTypes = {
  project: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    cover: PropTypes.shape({
      resourceType: PropTypes.oneOf(["image", "video"]),
      url: PropTypes.string,
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const ProjectList = () => {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);

  // filtre durumları
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("-createdAt"); // -createdAt / createdAt / title

  useEffect(() => {
    const run = async () => {
      try {
        const { data } = await api.get("/projects");
        setAll(data || []);
      } catch (err) {
        console.error(err);
        message.error(err.response?.data?.message || "Projeler getirilemedi.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const cats = useMemo(() => {
    const set = new Set();
    all.forEach((p) => p.category && set.add(p.category));
    return ["all", ...Array.from(set)];
  }, [all]);

  const filtered = useMemo(() => {
    let arr = [...all];
    if (q.trim()) {
      const s = q.toLowerCase();
      arr = arr.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
      );
    }
    if (cat !== "all") arr = arr.filter((p) => p.category === cat);

    if (sort === "-createdAt")
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "createdAt")
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "title")
      arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    return arr;
  }, [all, q, cat, sort]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const { data } = await api.delete(`/projects/${id}`);
      message.success(data?.message || "Proje silindi");
      setAll((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Silme işleminde hata.");
    }
  };

  if (loading) return <div className="p-4">Yükleniyor…</div>;

  return (
    <div className="p-4 md:p-6">
      {/* header */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Projeler</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara (başlık/açıklama)"
            className="w-full sm:w-64 rounded-md border px-3 py-2 text-sm"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {cats.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Tüm Kategoriler" : c}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="-createdAt">Yeniden → Eskiye</option>
            <option value="createdAt">Eskiden → Yeniye</option>
            <option value="title">Başlığa göre</option>
          </select>
          <Link
            to="/admin/projects/add"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            Yeni Proje
          </Link>
        </div>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p._id} project={p} onDelete={handleDelete} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-md border p-6 text-center text-gray-500">
            Kayıt bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
