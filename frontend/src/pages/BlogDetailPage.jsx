// src/pages/BlogDetailPage.jsx
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import BlogDetail from "../components/Blog/BlogDetail";

const BlogDetailPage = () => {
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
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
          <nav className="flex items-center gap-2 text-xs text-gray-600">
            <a href="/blog" className="hover:text-secondaryColor transition">
              Blog
            </a>
            <span>•</span>
            <span>Detay</span>
          </nav>
        </section>

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
