import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";

const dummyComments = [
  { id: 1, name: "Ahmet", text: "Çok bilgilendirici bir yazı olmuş!" },
  {
    id: 2,
    name: "Zeynep",
    text: "Malzeme seçimi konusunda çok yardımcı oldu.",
  },
  {
    id: 3,
    name: "Mert",
    text: "Bu konuyu daha önce hiç bu kadar net okumamıştım.",
  },
  { id: 4, name: "Elif", text: "Yazılarınızın devamını bekliyorum!" },
  { id: 5, name: "Kerem", text: "Harika anlatım, teşekkürler." },
];

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-60 md:h-80 w-full rounded-2xl bg-gray-200/70 mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 p-6">
        <div className="h-8 w-2/3 bg-gray-200/80 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200/70 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200/70 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200/70 rounded" />
      </div>
      <div className="rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 p-6">
        <div className="h-5 w-24 bg-gray-200/80 rounded mb-4" />
        <div className="h-4 w-full bg-gray-200/70 rounded mb-2" />
        <div className="h-4 w-5/6 bg-gray-200/70 rounded mb-2" />
        <div className="h-4 w-4/6 bg-gray-200/70 rounded" />
      </div>
    </div>
  </div>
);

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleComments, setVisibleComments] = useState(3);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => console.error("Blog getirilemedi:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const coverSrc = useMemo(() => {
    if (!blog) return "";
    return (
      blog.imageDataUrl ||
      blog.imageUrl ||
      blog.image ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc0MDBcJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IGZpbGw9JyNlZWUnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnLz48L3N2Zz4="
    );
  }, [blog]);

  const dateText = useMemo(() => {
    if (!blog) return "";
    const d = blog.createdAt || blog.date;
    return d ? new Date(d).toLocaleDateString("tr-TR") : "";
  }, [blog]);

  if (loading) return <Skeleton />;

  if (!blog) {
    return (
      <div className="text-center py-20 text-red-500 text-xl font-semibold">
        Blog bulunamadı.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Kapak görseli + başlık */}
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
        {coverSrc ? (
          <motion.img
            key={coverSrc}
            src={coverSrc}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            {dateText && (
              <span className="text-[11px] tracking-wide uppercase bg-white/85 text-gray-700 px-2 py-1 rounded-full shadow">
                {dateText}
              </span>
            )}
            {blog.category && (
              <span className="text-[11px] tracking-wide uppercase bg-quaternaryColor/90 text-white px-2 py-1 rounded-full shadow">
                {blog.category}
              </span>
            )}
          </div>
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-sm">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* İçerik alanı */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol: Makale */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-md p-6"
        >
          {/* Özet */}
          {blog.summary && (
            <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-5">
              {blog.summary}
            </p>
          )}

          <div className="h-[1px] bg-gray-200/70 my-4" />

          {/* Detay + about */}
          <div className="prose prose-gray max-w-none prose-p:leading-7 prose-headings:text-secondaryColor">
            {blog.details && <p>{blog.details}</p>}
            {blog.about && <p className="whitespace-pre-wrap">{blog.about}</p>}
          </div>
        </motion.article>

        {/* Sağ: info paneli */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="space-y-6"
        >
          {/* Hızlı bilgiler */}
          <div className="rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-md p-6">
            <h3 className="text-base font-semibold text-secondaryColor mb-4">
              Yazı Bilgileri
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>Yayın:</strong> {dateText || "—"}
              </li>
              <li>
                <strong>Kategori:</strong> {blog.category || "—"}
              </li>
              {blog.author && (
                <li>
                  <strong>Yazar:</strong> {blog.author}
                </li>
              )}
            </ul>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate("/blog")}
                className="px-3 py-2 text-sm rounded-full border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-white transition"
              >
                Tüm Yazılar
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="px-3 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Başa Dön
              </button>
            </div>
          </div>

          {/* Küçük kapak kutusu */}
          <div className="rounded-2xl overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 shadow-md">
            <div className="w-full aspect-video bg-gray-100">
              {coverSrc && (
                <img
                  src={coverSrc}
                  alt="Öne çıkan görsel"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Yorumlar */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-10 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-secondaryColor mb-4">
          Yorumlar
        </h3>
        <div className="space-y-4">
          {dummyComments.slice(0, visibleComments).map((c) => (
            <div
              key={c.id}
              className="bg-white/70 rounded-lg px-4 py-3 border border-white/40"
            >
              <p className="text-sm font-semibold text-gray-800">{c.name}</p>
              <p className="text-sm text-gray-700">{c.text}</p>
            </div>
          ))}
        </div>
        {visibleComments < dummyComments.length && (
          <button
            onClick={() => setVisibleComments((p) => p + 2)}
            className="mt-4 text-sm text-secondaryColor underline hover:text-secondaryColor/80 transition"
          >
            Daha fazla yorum yükle
          </button>
        )}
      </motion.section>
    </div>
  );
};

export default BlogDetail;
 