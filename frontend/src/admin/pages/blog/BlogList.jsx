import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import api from "../../../api";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/blogs");
        setBlogs(Array.isArray(data) ? data : []);
      } catch (e) {

        console.error("GET /blogs error:", e?.response?.data || e);
        const msg = e?.response?.data?.message || "Bloglar getirilemedi.";
        setErr(msg);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let arr = [...blogs];
    if (s) {
      arr = arr.filter(
        (b) =>
          b.title?.toLowerCase().includes(s) ||
          b.content?.toLowerCase().includes(s) ||
          (b.tags || []).some((t) => t.toLowerCase().includes(s))
      );
    }
    return arr;
  }, [blogs, q]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu blogu silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      message.success("Blog silindi");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {

      console.error("DELETE /blogs/:id error:", e?.response?.data || e);
      message.error(e?.response?.data?.message || "Silme işlemi başarısız.");
    }
  };

  if (loading) return <div className="p-6">Yükleniyor…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">Bloglar</h2>
        <div className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara (başlık/içerik/etiket)"
            className="w-full sm:w-72 rounded-md border px-3 py-2 text-sm"
          />
          <Link
            to="/admin/blogs/add"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            + Yeni Blog
          </Link>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-gray-500">
          Kayıt bulunamadı.
        </div>
      ) : (
        <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="border p-2">Kapak</th>
              <th className="border p-2">Başlık</th>
              <th className="border p-2">Etiketler</th>
              <th className="border p-2">Yorum</th>
              <th className="border p-2">Tarih</th>
              <th className="border p-2 w-52">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b._id} className="align-top">
                <td className="border p-2">
                  {b.cover?.url ? (
                    <img
                      src={b.cover.url}
                      alt={b.title}
                      className="h-16 w-24 rounded-md object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2">
                  <div className="font-medium">{b.title}</div>
                </td>
                <td className="border p-2">
                  {(b.tags || []).slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="mr-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
                    >
                      {t}
                    </span>
                  ))}
                  {(b.tags || []).length > 3 && (
                    <span className="text-[11px] text-gray-400">
                      +{b.tags.length - 3}
                    </span>
                  )}
                </td>
                <td className="border p-2">
                  {typeof b.commentsCount === "number" ? b.commentsCount : "-"}
                </td>
                <td className="border p-2">
                  {new Date(b.createdAt).toLocaleDateString("tr-TR")}
                </td>
                <td className="border p-2">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/admin/blogs/edit/${b._id}`}
                      className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-600"
                    >
                      Düzenle
                    </Link>
                    <Link
                      to={`/admin/blogs/${b._id}/comments`}
                      className="inline-flex items-center rounded-md bg-sky-600 px-3 py-1.5 text-white hover:bg-sky-700"
                    >
                      Yorumlar
                    </Link>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
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
