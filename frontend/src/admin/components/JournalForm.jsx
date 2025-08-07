// src/components/JournalForm.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const JournalForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
    image: "",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        summary: initialData.summary || "",
        image: initialData.image || "",
        // map 'about' from backend to 'content' in form
        content: initialData.content ?? initialData.about ?? "",
        date: initialData.date ? initialData.date.slice(0, 10) : "",
      });
    }
  }, [initialData]);

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
      <input
        type="text"
        name="image"
        placeholder="Görsel URL"
        value={formData.image}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      {/* Önizleme */}
      {formData.image && (
        <img
          src={formData.image}
          alt="Önizleme"
          className="w-32 h-auto mt-2 rounded shadow"
        />
      )}
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Kaydet
      </button>
    </form>
  );
};

JournalForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
};

export default JournalForm;
