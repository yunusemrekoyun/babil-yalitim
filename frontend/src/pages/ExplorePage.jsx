import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import ExplorePageComponent from "../components/Explore/ExplorePageComponent";

const ExplorePage = () => {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100"
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 32 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <NavbarPage />


        {/* <section className="relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 md:px-8 pt-12 md:pt-16">
            <div className="relative rounded-3xl p-8 md:p-12 bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-quaternaryColor/20 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-secondaryColor/20 blur-2xl" />
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-secondaryColor">
                Hizmetlerimiz
              </h1>
              <p className="mt-3 md:mt-4 text-gray-700 max-w-2xl">
                Uzman ekibimizle, yapınızın ihtiyaçlarına özel su yalıtımı ve
                kaplama çözümlerini uçtan uca sunuyoruz. Aşağıdan hizmetleri
                keşfedin.
              </p>


              <div className="mt-6 flex flex-wrap gap-2">
                {["Su Yalıtımı", "Polyurea", "Geomembran", "Teras-Çatı"].map(
                  (chip) => (
                    <span
                      key={chip}
                      className="text-xs md:text-sm px-3 py-1 rounded-full bg-white/60 border border-white/70 text-secondaryColor"
                    >
                      {chip}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section> */}

        {/* Grid */}
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
          <ExplorePageComponent />
        </div>
      </motion.div>

      <Footer />
    </>
  );
};

export default ExplorePage;
