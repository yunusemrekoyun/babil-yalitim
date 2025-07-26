import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${apiUrl}/blogs`);
        const data = await res.json();
        setBlogs(data);
      } catch (error) {
        console.error("Bloglar alınamadı", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bu blogu silmek istediğinize emin misiniz?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${apiUrl}/api/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b._id !== id));
      } else {
        alert("Silme işlemi başarısız.");
      }
    } catch (error) {
      console.error("Silme hatası", error);
    }
  };

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Blog Listesi</h2>
        <Link
          to="/admin/blogs/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <span>➕</span> Yeni Blog Ekle
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          Henüz blog eklenmemiş. 📭
        </p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">Başlık</th>
              <th className="py-2 px-4 border-b">Tarih</th>
              <th className="py-2 px-4 border-b">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{blog.title}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(blog.date).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 border-b flex gap-2">
                  <Link
                    to={`/admin/blogs/edit/${blog._id}`}
                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BlogList;