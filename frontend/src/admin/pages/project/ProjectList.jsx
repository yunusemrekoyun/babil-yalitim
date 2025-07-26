import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Projeler alınamadı:", error);
      message.error("Projeler alınamadı");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${apiUrl}/api/projects/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      message.success("Proje silindi");
      fetchProjects(); // yeniden listele
    } catch (error) {
      console.error("Silme hatası:", error);
      message.error("Proje silinemedi");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Projeler</h2>
        <Link
          to="/admin/projects/add"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Yeni Proje Ekle
        </Link>
      </div>
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project._id}
            className="border p-4 rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-gray-600 text-sm">{project.date?.slice(0, 10)}</p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/admin/projects/edit/${project._id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Düzenle
              </Link>
              <button
                onClick={() => handleDelete(project._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ProjectList;