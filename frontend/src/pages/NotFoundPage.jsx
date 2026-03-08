import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import NavbarPage from "../components/Navbar/NavbarPage";

export default function NotFoundPage() {
  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-stone-100 to-orange-100"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.35 }}
      >
        <NavbarPage />
        <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
          <span className="rounded-full border border-slate-300 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            404
          </span>
          <h1 className="mt-6 text-4xl font-bold text-secondaryColor md:text-6xl">
            Aradigin sayfa bulunamadi
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
            Baglanti hatali olabilir ya da icerik kaldirilmis olabilir. Ana
            sayfaya donerek gezintiye devam edebilirsin.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-full bg-quaternaryColor px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondaryColor"
            >
              Ana Sayfaya Don
            </Link>
            <Link
              to="/iletisim"
              className="rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white"
            >
              Iletisime Gec
            </Link>
          </div>
        </section>
      </motion.div>
      <Footer />
    </>
  );
}
