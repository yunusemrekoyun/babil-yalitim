import { useState, useEffect } from "react";

const ServiceForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
  if (initialData && Object.keys(initialData).length > 0) {
    setFormData((prev) => ({ ...prev, ...initialData }));
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
      <textarea
        name="description"
        placeholder="Açıklama"
        value={formData.description}
        onChange={handleChange}
        rows={6}
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

export default ServiceForm;