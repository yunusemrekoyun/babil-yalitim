// src/pages/BlogPage.jsx
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import BlogPageComponent from "../components/Blog/BlogPageComponent";
import Breadcrumb from "../components/ui/Breadcrumb"; // <-- EKLENDİ

const BlogPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-orange-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarPage />

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
          <Breadcrumb titleMap={{ blog: "Blog" }} />
        </div>

        <section className="px-4 md:px-8 lg:px-10 py-14 md:py-16 max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-secondaryColor">
              Blog
            </h1>
            <div className="h-1 w-24 bg-quaternaryColor/90 mx-auto mt-4 rounded-full" />
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Güncel bilgiler, teknik notlar ve hikâyeler.
            </p>
          </div>

          <BlogPageComponent />
        </section>
      </motion.div>

      <Footer />
    </>
  );
};

export default BlogPage;
