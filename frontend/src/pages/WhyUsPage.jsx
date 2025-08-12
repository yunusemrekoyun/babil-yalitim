// src/pages/WhyUsPage.jsx
import { motion } from "framer-motion";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import {
  CheckCircle2,
  Wrench,
  ClipboardCheck,
  ShieldCheck,
  Timer,
  PhoneCall,
} from "lucide-react";

const steps = [
  {
    icon: PhoneCall,
    title: "İlk İletişim",
    desc: "İhtiyacı dinleriz, hızlı ön analiz yaparız.",
  },
  {
    icon: ClipboardCheck,
    title: "Keşif & Teklif",
    desc: "Yerinde keşif, net kapsam ve takvim.",
  },
  {
    icon: Wrench,
    title: "Uygulama",
    desc: "Doğru detay çözümü, doğru malzeme.",
  },
  {
    icon: ShieldCheck,
    title: "Teslim & Garanti",
    desc: "Testler, rapor ve garanti prosedürü.",
  },
];

const faqs = [
  {
    q: "Keşif ücretsiz mi?",
    a: "Evet. Bölgeye göre planlayıp ücretsiz keşif yapıyoruz.",
  },
  {
    q: "Garanti veriyor musunuz?",
    a: "Uygulama tipine göre yazılı garanti sağlıyoruz.",
  },
  {
    q: "Hangi ürünlerle çalışıyorsunuz?",
    a: "Sektörün önde gelen markalarının onaylı sistemleri.",
  },
];

const WhyUsPage = () => {
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

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-12">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-extrabold text-secondaryColor text-center"
            >
              Neden <span className="text-quaternaryColor">Babil</span>?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-center text-gray-600 max-w-2xl mx-auto"
            >
              Doğru çözüm = doğru keşif + doğru detay + doğru uygulama. Bunu
              disiplinle sağlıyoruz.
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-1 w-24 bg-quaternaryColor/90 rounded-full mx-auto mt-6 origin-left"
            />
          </div>
        </section>

        {/* Değer teklifleri */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-6">
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: CheckCircle2,
                t: "Sistem Yaklaşımı",
                d: "Ürün değil, sistem teklif ederiz; uzun ömürlü performans.",
              },
              {
                icon: Timer,
                t: "Zamanında Teslim",
                d: "Şantiye takvimlerine uyumlu, sürprizsiz yürütme.",
              },
              {
                icon: ShieldCheck,
                t: "Belgelendirme & Garanti",
                d: "Teslim öncesi testler, rapor ve yazılı garanti.",
              },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-6 shadow"
              >
                <div className="inline-flex items-center justify-center rounded-xl bg-quaternaryColor/90 p-3 text-white shadow">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-secondaryColor">
                  {t}
                </h3>
                <p className="mt-1 text-sm text-gray-700">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Süreç adımları */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-secondaryColor text-center">
            Çalışma Sürecimiz
          </h2>
          <div className="h-1 w-20 bg-quaternaryColor/90 rounded-full mx-auto mt-3 mb-8" />
          <div className="grid gap-6 md:grid-cols-4">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl p-6 text-center shadow"
              >
                <div className="mx-auto mb-3 inline-flex items-center justify-center rounded-full bg-quaternaryColor/90 p-3 text-white shadow">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-secondaryColor">{title}</h4>
                <p className="mt-1 text-sm text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Referans/rozet şeridi (isteğe bağlı: markalarla uyumlu) */}
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
          <div className="rounded-3xl border border-white/30 bg-white/30 backdrop-blur-xl p-6 md:p-8 text-center shadow">
            <p className="text-sm md:text-base text-gray-700">
              Onaylı sistemlerle çalışıyoruz; detay çözümünde üretici teknik
              föyleri esas alınır.
            </p>
          </div>
        </section>

        {/* SSS */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 pb-14">
          <h3 className="text-xl md:text-2xl font-bold text-secondaryColor text-center">
            Sık Sorulanlar
          </h3>
          <div className="h-1 w-16 bg-quaternaryColor/90 rounded-full mx-auto mt-3 mb-6" />
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details
                key={q}
                className="rounded-xl border border-white/40 bg-white/50 backdrop-blur-xl p-4 shadow"
              >
                <summary className="cursor-pointer font-medium text-secondaryColor">
                  {q}
                </summary>
                <p className="mt-2 text-sm text-gray-700">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="rounded-2xl border border-white/40 bg-quaternaryColor/90 text-white p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow">
              <div>
                <h4 className="text-lg md:text-xl font-semibold">
                  Projeniz için keşif talep edin
                </h4>
                <p className="text-white/90 text-sm">
                  Kısa bir ön görüşme ile aynı gün randevu planlayalım.
                </p>
              </div>
              <a
                href="/iletisim"
                className="inline-flex items-center rounded-full bg-white text-quaternaryColor px-5 py-2 font-semibold hover:bg-white/90"
              >
                İletişime Geç
              </a>
            </div>
          </div>
        </section>
      </motion.div>

      <Footer />
    </>
  );
};

export default WhyUsPage;
