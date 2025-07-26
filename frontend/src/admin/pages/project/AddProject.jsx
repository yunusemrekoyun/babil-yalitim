import ProjectForm from "../../components/ProjectForm";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const AddProject = () => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleAdd = async (newData) => {
    try {
      const res = await fetch(`${apiUrl}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (!res.ok) {
        throw new Error("Kayıt başarısız.");
      }

      message.success("Yeni proje başarıyla eklendi!");
      navigate("/admin/projects");
    } catch (error) {
      console.error("Proje eklenemedi:", error);
      message.error("Proje eklenemedi!");
    }
  };

  return (
    <main className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Yeni Proje Ekle</h2>
      <ProjectForm onSubmit={handleAdd} />
    </main>
  );
};

export default AddProject;