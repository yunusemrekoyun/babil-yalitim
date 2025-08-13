// src/pages/BlogDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 👈 eklendi
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import BlogDetail from "../components/Blog/BlogDetail";
import Breadcrumb from "../components/ui/Breadcrumb";
import api from "../api"; // 👈 eklendi

const BlogDetailPage = () => {
  const { id } = useParams(); // 👈 eklendi
  const [blogTitle, setBlogTitle] = useState(""); // 👈 eklendi

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/blogs/${id}`);
        setBlogTitle(data?.title || "");
      } catch {
        setBlogTitle(""); // hata durumunda boş bırak
      }
    })();
  }, [id]);

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-orange-100"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarPage />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
          <Breadcrumb
            titleMap={{
              blog: "Blog",
              // Eğer route'unuz /blog/detail/:id ise şu satırı da isteğe göre ekleyin:
              // detail: "Detay",
              [id]: blogTitle || "Yükleniyor...", // 👈 id yerine başlık
            }}
          />
        </div>

        {/* Content */}
        <section className="w-full flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
          <div className="w-full max-w-7xl">
            <BlogDetail />
          </div>
        </section>
      </motion.div>

      <Footer />
    </>
  );
};

export default BlogDetailPage;
