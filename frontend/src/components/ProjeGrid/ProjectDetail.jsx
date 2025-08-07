import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { motion } from "framer-motion";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data);
        setNotFound(false);
      })
      .catch((err) => {
        console.error("Proje bulunamadı:", err);
        setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20">Yükleniyor...</div>;
  }

  if (notFound || !project) {
    return (
      <div className="text-center py-20 text-red-500 text-xl font-semibold">
        Proje bulunamadı.
      </div>
    );
  }

  return (
    <section className="w-full px-4 py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Başlık */}
        <motion.h2
          className="text-4xl font-bold text-secondaryColor text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {project.title}
        </motion.h2>

        {/* Ana Görsel */}
        <motion.img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-[400px] object-cover rounded-xl mb-8 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />

        {/* Açıklama */}
        <motion.p
          className="text-gray-700 text-lg leading-relaxed mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {project.description}
        </motion.p>

        {/* Ek bilgiler */}
        <div className="text-sm text-gray-500 flex gap-6">
          <p>
            <strong>Kategori:</strong> {project.category || "Belirtilmemiş"}
          </p>
          <p>
            <strong>Tarih:</strong>{" "}
            {new Date(project.createdAt).toLocaleDateString("tr-TR")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;