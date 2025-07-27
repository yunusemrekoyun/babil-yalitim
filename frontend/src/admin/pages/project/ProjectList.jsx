// src/admin/pages/project/ProjectList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import api from "../../../api.js";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/projects");
        setProjects(data);
      } catch (err) {
        console.error("Projeler alınamadı", err);
        const msg = err.response?.data?.message || "Projeler getirilemedi.";
        setError(msg);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      const { data } = await api.delete(`/projects/${id}`);
      message.success(data.message || "Proje silindi");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Silme işlemi başarısız", err);
      const msg = err.response?.data?.message || "Silme sırasında hata oluştu.";
      message.error(msg);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Projeler</h2>
        <Link
          to="/admin/projects/add"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Yeni Proje Ekle
        </Link>
      </div>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project._id}
            className="border p-4 rounded shadow hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{project.title}</h3>
              <div className="space-x-2">
                <Link
                  to={`/admin/projects/edit/${project._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="text-red-600 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
            {project.category && (
              <p className="text-sm text-gray-600 mt-1">
                Kategori: {project.category}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
