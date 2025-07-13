import { motion } from "framer-motion";

const ProjectsPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-white p-12"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Projeler</h1>
      <p className="text-gray-600 text-center">
        Tüm projeler burada listeleniyor.
      </p>
    </motion.div>
  );
};

export default ProjectsPage;
