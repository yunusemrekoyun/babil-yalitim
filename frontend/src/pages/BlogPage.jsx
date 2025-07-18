import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import GlassSection from "../components/Layout/GlassSection";
import BlogPageComponent from "../components/Blog/BlogPageComponent";
import Img1 from "../assets/banner.png";
import Img2 from "../assets/banner.png";

const blogData = [
  {
    id: 1,
    title: "Dış Cephe Yalıtımında Yeni Nesil Malzemeler",
    about:
      "Yalıtım teknolojisinde son gelişmeleri ele alıyoruz. Yeni nesil malzemeler sayesinde enerji tasarrufu daha da kolaylaşıyor.",
    date: "17 Temmuz 2025",
    image: Img1,
  },
  {
    id: 2,
    title: "Yalıtımda Sık Yapılan Hatalar ve Çözümleri",
    about:
      "Uygulama sırasında yapılan hatalar yapıların ömrünü kısaltabilir. Bu blogda bu hataları ve çözüm yollarını anlatıyoruz.",
    date: "12 Temmuz 2025",
    image: Img2,
  },
  {
    id: 3,
    title: "Yalıtımda Sık Yapılan Hatalar ve Çözümleri",
    about:
      "Uygulama sırasında yapılan hatalar yapıların ömrünü kısaltabilir. Bu blogda bu hataları ve çözüm yollarını anlatıyoruz.",
    date: "12 Temmuz 2025",
    image: Img2,
  },
];

const BlogPage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-orange-500 via-gray-100 to-orange-300 p-12"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <NavbarPage />

        <div className="px-4 py-16 flex flex-col items-center justify-center space-y-8">
          <GlassSection>
            <div className="w-full px-4 md:px-10 py-6 max-h-[80vh] overflow-y-auto pr-2 scroll-smooth">
              <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor text-center">
                Bloglar
              </h2>
              <div className="h-1 w-20 bg-secondaryColor/80 mx-auto my-4 rounded-full"></div>

              <BlogPageComponent data={blogData} />
            </div>
          </GlassSection>
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default BlogPage;
