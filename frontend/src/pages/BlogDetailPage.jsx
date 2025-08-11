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

        {/* Hero başlık şeridi (BlogDetail kendi kapak görselini de render ediyor) */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pt-10 md:pt-14">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <a href="/blog" className="hover:text-secondaryColor transition">
              Blog
            </a>
            <span>•</span>
            <span>Detay</span>
          </div>
        </section>

        {/* İçerik */}
        <section className="w-full flex flex-col items-center px-4 md:px-8 py-10 md:py-14">
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
