// src/components/Blog/BlogDetail.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import { Share2, Check, Link as LinkIcon, Clock } from "lucide-react";
import PropTypes from "prop-types";
import OtherBlogs from "./OtherBlogs";

/* ---------- helpers ---------- */
const stripHtml = (html) =>
  String(html || "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toParagraphs = (htmlOrText) => {
  if (!htmlOrText) return [];
  const plain = stripHtml(htmlOrText);
  // boş satır/satırsonuna göre parçala
  return plain
    .split(/\n{2,}|\r{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const readingTime = (htmlOrText) => {
  const words = stripHtml(htmlOrText).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220)); // ~220 wpm
};

// İçerikten h2/h3 başlıkları çıkar (TOC için)
const extractHeadings = (html) => {
  if (!html) return [];
  // basit parser: <h2>..</h2>, <h3>..</h3>
  const out = [];
  const h2 = [...String(html).matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(
    (m) => ({ level: 2, text: stripHtml(m[1]) })
  );
  const h3 = [...String(html).matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(
    (m) => ({ level: 3, text: stripHtml(m[1]) })
  );
  // sırayı koru
  const all = [...h2, ...h3];
  // metinde geçtiği sıraya göre sort etmek için indexOf kullan
  all.sort(
    (a, b) => String(html).indexOf(a.text) - String(html).indexOf(b.text)
  );
  // id üret
  let seen = new Set();
  for (const h of all) {
    let slug = h.text
      .toLowerCase()
      .replace(/[^\w\- ]+/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (!slug) slug = "bolum";
    // çakışmayı engelle
    let s = slug,
      i = 2;
    while (seen.has(s)) {
      s = `${slug}-${i++}`;
    }
    seen.add(s);
    out.push({ ...h, id: s });
  }
  return out;
};

// İçeriğe heading id'leri enjekte et (render için)
const injectHeadingIds = (html, toc) => {
  if (!html || toc.length === 0) return html;
  let temp = html;
  for (const h of toc) {
    const tag = h.level === 3 ? "h3" : "h2";
    // yalnızca ilk eşleşmeyi id ile değiştir
    const re = new RegExp(`<${tag}([^>]*)>([\\s\\S]*?)</${tag}>`, "i");
    temp = temp.replace(re, (m, attrs, inner) => {
      if (stripHtml(inner).includes(h.text)) {
        // zaten id varsa eklemeyelim
        if (/id="/i.test(attrs)) return m;
        return `<${tag} id="${h.id}" ${attrs}>${inner}</${tag}>`;
      }
      return m;
    });
  }
  return temp;
};

/* ---------- UI bits ---------- */
// progressive image (blur → sharp)
const ProgressiveImg = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`${className} transition-[filter,transform,opacity] duration-700 ${
        loaded
          ? "opacity-100 filter-none scale-100"
          : "opacity-80 blur-sm scale-[1.01]"
      }`}
      loading="lazy"
    />
  );
};
ProgressiveImg.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};
ProgressiveImg.defaultProps = {
  alt: "",
  className: "",
};

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

/* ---------- main ---------- */
const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", body: "" });

  // okuma ilerleme
  const articleRef = useRef(null);
  const [progress, setProgress] = useState(0);

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

  // progress hesapla
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const onScroll = () => {
      // eslint-disable-next-line no-unused-vars
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight - window.innerHeight * 0.6;
      const passed = Math.min(
        Math.max(window.scrollY - (el.offsetTop - window.innerHeight * 0.2), 0),
        total
      );
      setProgress(total > 0 ? Math.round((passed / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [blog]);

  const dateText = useMemo(() => {
    const d = blog?.createdAt;
    return d ? new Date(d).toLocaleDateString("tr-TR") : "";
  }, [blog]);

  const coverSrc =
    blog?.cover?.url ||
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc0MDBcJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IGZpbGw9JyNlZWUnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnLz48L3N2Zz4=";

  const rtime = useMemo(() => readingTime(blog?.content), [blog]);
  const toc = useMemo(() => extractHeadings(blog?.content), [blog]);
  const contentWithIds = useMemo(
    () => injectHeadingIds(blog?.content || "", toc),
    [blog, toc]
  );

  // içerik paragrafları + var ise assets’i akıllı yerleştir
  const paras = useMemo(() => toParagraphs(blog?.content), [blog]);
  // ---- BLOG MEDYA TOPLAYICI ----
  const assets = useMemo(() => {
    if (!blog) return [];

    const out = [];

    const pushNormalized = (m) => {
      if (!m) return;
      const url = m.url || m.secure_url || m.src;
      if (!url) return;
      const type =
        m.resourceType ||
        m.resource_type ||
        (/\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(url) ? "video" : "image");

      out.push({
        url,
        resourceType: type === "video" ? "video" : "image",
        caption: m.caption || m.alt || m.title || "",
      });
    };

    // 1) assets (bizim planladığımız)
    if (Array.isArray(blog.assets)) blog.assets.forEach(pushNormalized);

    // 2) olası alternatif alanlar
    if (Array.isArray(blog.media)) blog.media.forEach(pushNormalized);
    if (Array.isArray(blog.images)) blog.images.forEach(pushNormalized);
    if (Array.isArray(blog.gallery)) blog.gallery.forEach(pushNormalized);
    if (Array.isArray(blog.galleryDataUrls))
      blog.galleryDataUrls.forEach((url) => pushNormalized({ url }));

    // 3) kapak’ı da dahil etmek istersen (thumb amaçlı)
    // NOT: Kapak zaten hero’da görünüyor; istersen yorumu kaldır.
    // if (blog.cover?.url) pushNormalized({ url: blog.cover.url, caption: "Kapak" });

    // 4) URL’e göre uniq yap
    const seen = new Set();
    const uniq = [];
    for (const m of out) {
      if (!seen.has(m.url)) {
        seen.add(m.url);
        uniq.push(m);
      }
    }
    return uniq;
  }, [blog]);

  // lightbox state & helpers (assets sonrası)
  const [lbOpen, setLbOpen] = useState(false);
  const [lbIndex, setLbIndex] = useState(0);
  const openLb = (i) => {
    setLbIndex(i);
    setLbOpen(true);
  };
  const closeLb = () => setLbOpen(false);
  const prevLb = () =>
    setLbIndex((i) =>
      assets.length ? (i - 1 + assets.length) % assets.length : 0
    );
  const nextLb = () =>
    setLbIndex((i) => (assets.length ? (i + 1) % assets.length : 0));

  // medya yerleşimi: 3. paragraftan sonra ilk medya, sonra her 5 paragrafa bir
  const interleaved = useMemo(() => {
    if (!paras.length) return [];
    const blocks = [];
    let a = 0;
    for (let i = 0; i < paras.length; i++) {
      blocks.push({ type: "p", text: paras[i], key: `p-${i}` });
      const shouldDrop =
        assets.length > 0 &&
        ((i === 2 && a < assets.length) ||
          (i > 2 && (i - 2) % 5 === 0 && a < assets.length));
      if (shouldDrop) {
        blocks.push({ type: "media", m: assets[a], key: `m-${a}` });
        a++;
      }
    }
    // kalan medya varsa sona ekle
    while (a < assets.length) {
      blocks.push({ type: "media", m: assets[a], key: `m-${a}` });
      a++;
    }
    return blocks;
  }, [paras, assets]);

  /* --------------- render --------------- */
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
      {/* İlerleme çubuğu */}
      <div className="sticky top-0 z-40 h-1.5 bg-transparent">
        <div
          className="h-full bg-quaternaryColor transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

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
            <span className="inline-flex items-center gap-1 text-[11px] bg-secondaryColor/95 text-white px-2 py-1 rounded-full shadow">
              <Clock size={12} /> ~{rtime} dk okuma
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
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Makale */}
        <motion.article
          ref={articleRef}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-md p-5 md:p-8"
        >
          {/* Zengin içerik (başlık id’leri enjekte edilmiş) */}
          {/<[a-z][\s\S]*>/i.test(blog.content) ? (
            <div
              className="prose prose-sm md:prose-base lg:prose-lg prose-p:leading-7 prose-img:rounded-xl prose-headings:text-secondaryColor max-w-none"
              // Başlık bağlantısı için anchor ikonunu css ile göstereceğiz
              dangerouslySetInnerHTML={{ __html: contentWithIds }}
              onClick={(e) => {
                // başlığa tıkla → link kopyala
                const target = e.target;
                if (["H1", "H2", "H3"].includes(target.tagName) && target.id) {
                  const url = `${location.origin}${location.pathname}#${target.id}`;
                  navigator.clipboard.writeText(url).catch(() => {});
                }
              }}
            />
          ) : (
            // Plain içerik yolu: paragraflar arasına thumb serpiştir
            <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
              {interleaved.length ? (
                interleaved.map((b) =>
                  b.type === "p" ? (
                    <p key={b.key} className="text-gray-800 leading-7">
                      {b.text}
                    </p>
                  ) : (
                    <MediaThumb
                      key={b.key}
                      m={b.m}
                      onClick={() =>
                        openLb(assets.findIndex((x) => x.url === b.m.url))
                      }
                      className="my-4"
                    />
                  )
                )
              ) : (
                <p className="text-gray-500">İçerik yakında.</p>
              )}
            </div>
          )}
          {/* HTML içerik yolunda: altta galeri grid (thumb) */}
          {assets.length > 0 && /<[a-z]/i.test(blog.content) && (
            <h2 className="mt-6 mb-2 text-sm font-semibold text-secondaryColor">
              Medya
            </h2>
          )}{" "}
          <>
            <div className="h-px bg-gray-200/70 my-6" />
            <div className="grid gap-4 sm:grid-cols-2">
              {assets.map((m, i) => (
                <MediaThumb
                  key={m.publicId || i}
                  m={m}
                  onClick={() => openLb(i)}
                />
              ))}
            </div>
          </>
        </motion.article>

        {/* Yan panel (sticky) */}
        <div className="space-y-6 lg:sticky lg:top-6">
          <AsideTools toc={toc} onBack={() => navigate("/blog")} />
          <OtherBlogs currentId={blog._id} limit={6} />
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lbOpen && (
          <Lightbox
            items={assets}
            index={lbIndex}
            onClose={closeLb}
            onPrev={prevLb}
            onNext={nextLb}
          />
        )}
      </AnimatePresence>

      {/* Yorumlar */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="mt-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-md p-5 md:p-8"
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
              className="bg-white/90 rounded-xl px-4 py-3 border border-white/50"
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
            className="rounded-xl border border-gray-200 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor"
            value={form.name}
            onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="E-posta"
            className="rounded-xl border border-gray-200 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            required
          />
          <textarea
            placeholder="Yorumunuz"
            className="md:col-span-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor min-h-[110px]"
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

/* ---------- Reusable pieces ---------- */
/* ---------------- Lightbox ---------------- */
const Lightbox = ({ items, index, onClose, onPrev, onNext }) => {
  // ESC ve ok tuşları
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const cur = items[index];
  if (!cur) return null;

  const isVideo = cur?.resourceType === "video";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* İç kart (propagation stop) */}
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Medya */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
          {isVideo ? (
            <video
              src={cur.url}
              controls
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-contain"
            />
          ) : (
            <img
              src={cur.url}
              alt={cur.caption || "media"}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </div>

        {/* Caption */}
        {cur.caption && (
          <div className="mt-3 text-center text-sm text-white/90">
            {cur.caption}
          </div>
        )}

        {/* Kontroller */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-white text-gray-900 rounded-full px-3 py-1.5 shadow hover:shadow-md"
          aria-label="Kapat"
        >
          Kapat
        </button>

        {items.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 rounded-full p-2 shadow hover:bg-white"
              aria-label="Önceki"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 text-gray-900 rounded-full p-2 shadow hover:bg-white"
              aria-label="Sonraki"
            >
              ›
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};
Lightbox.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      resourceType: PropTypes.oneOf(["image", "video"]),
      caption: PropTypes.string,
    })
  ).isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

/* ---------------- Thumb (küçük önizleme) ---------------- */
const MediaThumb = ({ m, onClick, className = "" }) => {
  const isVideo = m?.resourceType === "video";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative rounded-xl overflow-hidden border border-white/50 bg-white/90 shadow ${className}`}
      title={m?.caption || (isVideo ? "Video" : "Görsel")}
    >
      <div className="relative w-full aspect-[16/9]">
        {isVideo ? (
          <>
            <video
              src={m.url}
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="rounded-full px-3 py-2 text-xs bg-black/60 text-white border border-white/30">
                ▶ Oynat
              </div>
            </div>
          </>
        ) : (
          <img
            src={m.url}
            alt="thumb"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
    </button>
  );
};
MediaThumb.propTypes = {
  m: PropTypes.shape({
    url: PropTypes.string.isRequired,
    resourceType: PropTypes.oneOf(["image", "video"]),
    caption: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

/* ---------------- Aside Tools ---------------- */
const AsideTools = ({ toc, onBack }) => {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = location.href;
    try {
      if (navigator.share) {
        await navigator.share({ url, title: document.title });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-6">
      {/* Araç kutusu */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-md p-5">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="px-3 py-2 text-sm rounded-full border border-secondaryColor text-secondaryColor hover:bg-secondaryColor hover:text-white transition"
          >
            Tüm Yazılar
          </button>
          <button
            onClick={share}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            title="Bağlantıyı paylaş"
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            {copied ? "Kopyalandı" : "Paylaş"}
          </button>
        </div>

        {/* İçindekiler */}
        {toc.length > 0 && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-secondaryColor mb-2">
              İçindekiler
            </p>
            <nav className="text-sm text-gray-700 space-y-1">
              {toc.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className="block rounded px-2 py-1 hover:bg-gray-100 transition"
                >
                  <span className="inline-flex items-center gap-2">
                    {h.level === 3 && (
                      <span className="w-3 h-px bg-gray-400 inline-block" />
                    )}
                    {h.text}
                  </span>
                </a>
              ))}
            </nav>
            <p className="mt-2 text-[11px] text-gray-400 inline-flex items-center gap-1">
              <LinkIcon size={12} /> Başlığa tıklayınca link kopyalanır
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
AsideTools.propTypes = {
  toc: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      level: PropTypes.oneOf([2, 3]).isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
  onBack: PropTypes.func.isRequired,
};
AsideTools.defaultProps = {
  toc: [],
};
