// src/components/ProjectForm.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ProjectForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        imageUrl: initialData.imageUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <input
        name="title"
        placeholder="Proje Başlığı"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        name="description"
        placeholder="Özet"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="category"
        placeholder="Kategori"
        value={formData.category}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <input
        name="imageUrl"
        placeholder="Resim URL"
        value={formData.imageUrl}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Kaydet
      </button>
    </form>
  );
};

ProjectForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default ProjectForm;
