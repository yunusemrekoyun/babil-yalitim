import { useNavigate } from "react-router-dom";
import { message } from "antd";
import BlogForm from "../../components/BlogForm";
import api from "../../../api";

const AddBlog = () => {
  const navigate = useNavigate();

  const handleSubmit = async (fd) => {
    try {
      await api.post("/blogs", fd); // FormData — Content-Type elle set etme
      message.success("Blog eklendi");
      navigate("/admin/blogs");
    } catch (e) {

      console.error("POST /blogs error:", e?.response?.data || e);
      message.error(e?.response?.data?.message || "Blog eklenemedi.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="mb-4 text-2xl font-semibold">Yeni Blog</h2>
      <BlogForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddBlog;
