// src/components/Blog/BlogDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api";

/* ---------------- helpers ---------------- */
const stripHtml = (html) =>
  String(html || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toParagraphs = (htmlOrText) => {
  if (!htmlOrText) return [];
  // HTML gelirse tag'leri kaldırıp satır sonlarını korumaya çalış
  const plain = stripHtml(htmlOrText);
  return plain
    .split(/\n{2,}|\r{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const readingTime = (htmlOrText) => {
  const words = stripHtml(htmlOrText).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
};

/* ---------------- ui ---------------- */
const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-64 md:h-80 w-full rounded-2xl bg-gray-200/70 mb-6" />
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
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", body: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${id}`);
        if (!cancelled) {
          setBlog(res.data || null);
          setErr("");
        }
      } catch (e) {
        console.error("Blog getirilemedi:", e?.response?.data || e);
        if (!cancelled) setErr("Blog bulunamadı.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const dateText = useMemo(() => {
    const d = blog?.createdAt;
    return d ? new Date(d).toLocaleDateString("tr-TR") : "";
  }, [blog]);

  const coverSrc =
    blog?.cover?.url ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc0MDBcJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IGZpbGw9JyNlZWUnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnLz48L3N2Zz4=";

  const contentParas = useMemo(() => toParagraphs(blog?.content), [blog]);
  const rtime = useMemo(() => readingTime(blog?.content), [blog]);

  if (loading) return <Skeleton />;
  if (err || !blog) {
    return (
      <div className="text-center py-20 text-red-500 text-lg font-semibold bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40">
        {err || "Blog bulunamadı."}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Kapak + başlık */}
      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg">
        <motion.img
          key={coverSrc}
          src={coverSrc}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {dateText && (
              <span className="text-[11px] tracking-wide uppercase bg-white/90 text-gray-700 px-2 py-1 rounded-full shadow">
                {dateText}
              </span>
            )}
            <span className="text-[11px] bg-secondaryColor/90 text-white px-2 py-1 rounded-full shadow">
              ~{rtime} dk okuma
            </span>
            {Array.isArray(blog.tags) &&
              blog.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-1 rounded-full bg-white/80 text-secondaryColor border border-white/60"
                >
                  {t}
                </span>
              ))}
          </div>
          <h1 className="text-white text-2xl md:text-4xl font-bold drop-shadow-sm">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* İçerik + yan panel */}
      <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Makale */}
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 rounded-2xl bg-white/65 backdrop-blur-xl border border-white/40 shadow-md p-6"
        >
          <div className="prose max-w-none prose-p:leading-7 prose-headings:text-secondaryColor">
            {contentParas.length ? (
              contentParas.map((p, i) => (
                <p key={i} className="text-gray-800">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-gray-500">İçerik yakında.</p>
            )}
          </div>

          {/* Asset galerisi */}
          {Array.isArray(blog.assets) && blog.assets.length > 0 && (
            <>
              <div className="h-px bg-gray-200/70 my-6" />
              <div className="grid gap-3 sm:grid-cols-2">
                {blog.assets.map((m, i) =>
                  m.resourceType === "video" ? (
                    <video
                      key={m.publicId || i}
                      src={m.url}
                      controls
                      className="w-full aspect-video rounded-xl border"
                    />
                  ) : (
                    <img
                      key={m.publicId || i}
                      src={m.url}
                      alt={`asset-${i}`}
                      loading="lazy"
                      className="w-full rounded-xl border object-cover"
                    />
                  )
                )}
              </div>
            </>
          )}
        </motion.article>

        {/* Yan panel */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="space-y-6"
        >
          <div className="rounded-2xl bg-white/65 backdrop-blur-xl border border-white/40 shadow-md p-6">
            <h3 className="text-base font-semibold text-secondaryColor mb-4">
              Yazı Bilgileri
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li>
                <strong>Yayın:</strong> {dateText || "—"}
              </li>
              {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                <li className="flex flex-wrap gap-2">
                  <strong className="mr-1">Etiketler:</strong>
                  {blog.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-1 rounded-full bg-quaternaryColor/10 text-quaternaryColor border border-quaternaryColor/30"
                    >
                      {t}
                    </span>
                  ))}
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

          {/* Küçük kapak */}
          <div className="rounded-2xl overflow-hidden bg-white/65 backdrop-blur-xl border border-white/40 shadow-md">
            <div className="w-full aspect-video bg-gray-100">
              <img
                src={coverSrc}
                alt="Öne çıkan görsel"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Onaylı yorumlar + yorum gönder */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-8 rounded-2xl bg-white/65 backdrop-blur-xl border border-white/40 shadow-md p-6"
      >
        <h3 className="text-xl font-semibold text-secondaryColor mb-4">
          Yorumlar
        </h3>

        <div className="space-y-4">
          {(blog.comments || []).length === 0 && (
            <p className="text-gray-500">Henüz yorum yok.</p>
          )}
          {(blog.comments || []).map((c) => (
            <div
              key={c._id}
              className="bg-white/80 rounded-lg px-4 py-3 border border-white/40"
            >
              <p className="text-sm font-semibold text-gray-800">{c.name}</p>
              <p className="text-sm text-gray-700">{c.body}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {c.createdAt
                  ? new Date(c.createdAt).toLocaleString("tr-TR")
                  : ""}
              </p>
            </div>
          ))}
        </div>

        {/* Yorum formu */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setSending(true);
              await api.post(`/blogs/${id}/comments`, form);
              alert("Yorum alındı, onay bekliyor.");
              setForm({ name: "", email: "", body: "" });
            } catch (e2) {
              console.error(e2);
              alert("Yorum gönderilemedi.");
            } finally {
              setSending(false);
            }
          }}
          className="mt-6 grid gap-3 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Adınız"
            className="rounded-xl border border-gray-200 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="E‑posta"
            className="rounded-xl border border-gray-200 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
          <textarea
            placeholder="Yorumunuz"
            className="md:col-span-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor min-h-[110px]"
            value={form.body}
            onChange={(e) => setForm((s) => ({ ...s, body: e.target.value }))}
            required
          />
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2 rounded-full bg-quaternaryColor text-white hover:bg-quaternaryColor/90 disabled:opacity-60 transition"
            >
              {sending ? "Gönderiliyor…" : "Yorumu Gönder"}
            </button>
          </div>
        </form>
      </motion.section>
    </div>
  );
};

export default BlogDetail;
