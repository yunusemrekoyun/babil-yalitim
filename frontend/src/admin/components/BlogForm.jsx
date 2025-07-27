import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const BlogForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    about: "",
    image: "",
    date: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]); // ✅ eslint uyarısı çözüldü

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
        name="about"
        placeholder="İçerik"
        value={formData.about}
        onChange={handleChange}
        rows={6}
        className="w-full border p-2 rounded"
      />
      <input
        type="text"
        name="image"
        placeholder="Görsel URL"
        value={formData.image}
        onChange={handleChange}
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
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Kaydet
      </button>
    </form>
  );
};

BlogForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default BlogForm;
