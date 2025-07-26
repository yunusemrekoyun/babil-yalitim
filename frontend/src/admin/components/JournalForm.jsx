import { useState, useEffect } from "react";

const JournalForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
  });

  useEffect(() => {
    const hasData = Object.keys(initialData).length > 0;
    if (hasData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [JSON.stringify(initialData)]);

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
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
      >
        Kaydet
      </button>
    </form>
  );
};

export default JournalForm;
