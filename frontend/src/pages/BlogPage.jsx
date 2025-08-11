import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import BlogPageComponent from "../components/Blog/BlogPageComponent";

const BlogPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-white-300"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
        <NavbarPage />

        <section className="px-4 md:px-12 py-16 max-w-7xl mx-auto">
          {/* Başlık */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor">
              Bloglar
            </h2>
            <div className="h-1 w-20 bg-secondaryColor/80 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Blog Listesi */}
          <BlogPageComponent />
        </section>
      </motion.div>

      <Footer />
    </>
  );
};

export default BlogPage;
