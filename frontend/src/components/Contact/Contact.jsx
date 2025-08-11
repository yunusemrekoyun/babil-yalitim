import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // burada API'ye post atmak istersen:
    // await api.post("/contact", form)
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", message: "" });
      alert("Mesajınız alındı. En kısa sürede dönüş yapacağız.");
    }, 800);
  };

  const card =
    "rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-md";

  return (
    <div className="max-w-7xl mx-auto py-10 md:py-14 px-4 md:px-8">
      {/* başlık */}
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-secondaryColor">
          İletişim
        </h2>
        <div className="h-1 w-24 bg-quaternaryColor mx-auto mt-3 rounded-full" />
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          Projeniz için doğru çözümleri konuşalım. Telefon, e‑posta veya form
          üzerinden bize ulaşabilirsiniz.
        </p>
      </div>

      {/* içerik grid */}
      <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
        {/* sol: iletişim kartları */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className={`${card} p-6`}>
            <h3 className="text-lg font-semibold text-secondaryColor mb-4">
              Bize Ulaşın
            </h3>
            <ul className="space-y-4 text-gray-800">
              <li className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-quaternaryColor text-white">
                  <Phone size={18} />
                </span>
                <div>
                  <p className="text-sm text-gray-600">Telefon</p>
                  <a
                    href="tel:+905551112233"
                    className="font-medium hover:underline"
                  >
                    +90 555 111 22 33
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-quaternaryColor text-white">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="text-sm text-gray-600">E‑posta</p>
                  <a
                    href="mailto:info@babilyalitim.com"
                    className="font-medium hover:underline"
                  >
                    info@babilyalitim.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-quaternaryColor text-white">
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="text-sm text-gray-600">Adres</p>
                  <p className="font-medium">
                    Atatürk Mah. İnşaat Cad. No:1, Çanakkale
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-quaternaryColor text-white">
                  <Clock size={18} />
                </span>
                <div>
                  <p className="text-sm text-gray-600">Çalışma Saatleri</p>
                  <p className="font-medium">Hafta içi 09:00 – 18:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={`${card} p-6`}>
            <h3 className="text-lg font-semibold text-secondaryColor mb-4">
              Harita
            </h3>
            <div className="rounded-xl overflow-hidden shadow">
              <iframe
                title="Babil Yalıtım Konumu"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.339230087954!2d26.404188!3d40.155187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b06f7784efdbf3%3A0x3b3de47d5d77e56e!2sAtatürk%20Mah.%20İn%C5%9Faat%20Cad.%20No%3A1%2C%20%C3%87anakkale!5e0!3m2!1str!2str!4v1690300123456"
                width="100%"
                height="280"
                allowFullScreen=""
                loading="lazy"
                className="w-full"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </motion.div>

        {/* sağ: form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className={`${card} p-6`}
        >
          <h3 className="text-lg font-semibold text-secondaryColor mb-4">
            Mesaj Gönderin
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Adınız Soyadınız</span>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={onChange}
                className="mt-1 w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-quaternaryColor"
                placeholder="Örn. Ali Veli"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">E‑posta Adresiniz</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={onChange}
                className="mt-1 w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-quaternaryColor"
                placeholder="ornek@mail.com"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Mesajınız</span>
              <textarea
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={onChange}
                className="mt-1 w-full p-3 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-quaternaryColor resize-y"
                placeholder="Kısaca bize ihtiyaçlarınızı anlatın…"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex items-center gap-2 bg-quaternaryColor text-white font-semibold py-3 px-5 rounded-lg hover:bg-secondaryColor transition disabled:opacity-60"
          >
            <Send size={18} />
            {submitting ? "Gönderiliyor..." : "Gönder"}
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Bu form yalnızca hızlı iletişim amaçlıdır. Detaylı teklif için
            lütfen telefonla arayınız.
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
