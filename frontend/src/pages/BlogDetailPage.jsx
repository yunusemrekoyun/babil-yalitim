import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import BlogDetail from "../components/Blog/BlogDetail";
import Img1 from "../assets/banner.png"; // geçici

const dummyData = {
  id: 1,
  title: "Dış Cephe Yalıtımında Yeni Nesil Malzemeler",
  about:
    "Yalıtım teknolojisinde son gelişmeleri ele alıyoruz. Yeni nesil malzemeler sayesinde enerji tasarrufu daha da kolaylaşıyor.",
  date: "17 Temmuz 2025",
  image: Img1,
};

const BlogDetailPage = () => {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-orange-500 via-gray-100 to-orange-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <NavbarPage />

      <section className="w-full flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-6xl">
          <BlogDetail blog={dummyData} />
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default BlogDetailPage;
