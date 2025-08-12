// src/components/Blog/BlogPageComponent.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import api from "../../api";
import BlogItem from "./BlogItem";

const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/40 backdrop-blur-md shadow-md">
    <div className="w-full h-56 md:h-60 bg-gray-200/60 animate-pulse" />
    <div className="p-6">
      <div className="h-5 w-3/4 bg-gray-200/70 rounded mb-3 animate-pulse" />
      <div className="h-4 w-full bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200/70 rounded animate-pulse" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/30">
    <p className="text-secondaryColor font-semibold text-lg">
      Henüz blog eklenmemiş.
    </p>
    <p className="text-gray-600 mt-1">Yakında yeni yazılarla buradayız.</p>
  </div>
);

const BlogPageComponent = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/blogs");
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setBlogs(list);
      } catch (e) {
        console.error("Bloglar alınamadı:", e?.response?.data || e);
        if (!cancelled) setErr("Bloglar getirilemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (err) {
    return (
      <div className="text-center text-red-600 bg-white/40 border border-white/30 rounded-2xl py-10">
        {err}
      </div>
    );
  }

  if (!blogs.length) return <EmptyState />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
    >
      {blogs.map((b, i) => (
        <BlogItem key={b._id || i} item={b} index={i} />
      ))}
    </motion.div>
  );
};

export default BlogPageComponent;
