import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";
import api from "../../api";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_HOURS,
  CONTACT_MAP_URL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
} from "../../config/site";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setStatus(null);
      const { data } = await api.post("/contact", form);
      setSubmitting(false);
      setForm({ name: "", email: "", message: "", company: "" });
      setStatus({
        type: "success",
        text: data?.message || "Mesajiniz alindi. En kisa surede donus yapacagiz.",
      });
    } catch (error) {
      setSubmitting(false);
      setStatus({
        type: "error",
        text:
          error?.response?.data?.message ||
          error?.friendlyMessage ||
          "Mesaj gonderilemedi. Lutfen daha sonra tekrar deneyin.",
      });
    }
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
                    href={`tel:${CONTACT_PHONE_LINK}`}
                    className="font-medium hover:underline"
                  >
                    {CONTACT_PHONE_DISPLAY}
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
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="font-medium hover:underline"
                  >
                    {CONTACT_EMAIL}
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
                    {CONTACT_ADDRESS}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-quaternaryColor text-white">
                  <Clock size={18} />
                </span>
                <div>
                  <p className="text-sm text-gray-600">Çalışma Saatleri</p>
                  <p className="font-medium">{CONTACT_HOURS}</p>
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
                src={CONTACT_MAP_URL}
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
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={onChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
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

          {status && (
            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                status.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {status.text}
            </div>
          )}

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
