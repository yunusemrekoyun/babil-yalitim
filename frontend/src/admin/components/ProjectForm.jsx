import { useState, useEffect } from "react";

const ProjectForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [JSON.stringify(initialData)]); // yalnızca veri gerçekten değiştiğinde güncelle

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <input
        type="text"
        name="title"
        placeholder="Başlık"
        value={formData.title}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="summary"
        placeholder="Özet"
        value={formData.summary}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />
      <textarea
        name="content"
        placeholder="İçerik"
        value={formData.content}
        onChange={handleChange}
        rows={6}
        className="w-full border p-2 rounded"
      />
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
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

export default ProjectForm;