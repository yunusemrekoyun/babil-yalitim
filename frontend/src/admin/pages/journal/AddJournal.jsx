import { useNavigate } from "react-router-dom";
import { message } from "antd";
import JournalForm from "../../components/JournalForm.jsx";
import api from "../../../api.js";

const AddJournal = () => {
  const navigate = useNavigate();

  const handleSubmit = async (fd) => {
    try {
      // FormData: Content-Type set etme!
      await api.post("/journals", fd);
      message.success("Haber eklendi");
      navigate("/admin/journals");
    } catch (err) {
      console.error("POST /journals error:", err?.response?.data || err);
      message.error(err?.response?.data?.message || "Haber eklenemedi.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Haber</h2>
      <JournalForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddJournal;
