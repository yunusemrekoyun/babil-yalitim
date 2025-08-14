import Logo from "../../assets/logo.png";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-buzbeyazseffaf text-secondaryColor pt-12 pb-6 px-4 border-t border-secondaryColor">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & Kısa Açıklama */}
        <div className="flex flex-col gap-4">
          <img src={Logo} alt="Logo" className="w-36 mb-2" />
          <p className="text-secondaryColor text-sm">
            10+ yıllık tecrübe ile su yalıtımında uzman, güvenilir ve yenilikçi
            çözümler sunuyoruz. Kalite ve müşteri memnuniyeti önceliğimizdir.
          </p>
        </div>

        {/* Site Haritası */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-quaternaryColor">
            Site Haritası
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="#about"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Hakkımızda
              </a>
            </li>
            <li>
              <a
                href="#Service"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Projeler
              </a>
            </li>
            <li>
              <a
                href="#journal"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="#search"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Arama
              </a>
            </li>
          </ul>
        </div>

        {/* İletişim Bilgileri */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-quaternaryColor">
            İletişim
          </h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 ">
              <MapPin size={18} className="text-secondaryColor" /> Kütahya,
              Türkiye
            </li>
            <li className="flex items-center gap-2 ">
              <Phone size={18} className="text-secondaryColor" />{" "}
              <a
                href="tel:+905551234567"
                className="hover:text-quaternaryColor transition"
              >
                +90 555 123 45 67
              </a>
            </li>
            <li className="flex items-center gap-2 ">
              <Mail size={18} className="text-secondaryColor" />{" "}
              <a
                href="mailto:babilyalitim@gmail.com"
                className="hover:text-quaternaryColor transition"
              >
                babilyalitim@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* Sosyal Medya */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-quaternaryColor">
            Bizi Takip Edin
          </h4>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/babilyalitim/"
              aria-label="Facebook"
              className="hover:text-quaternaryColor transition"
            >
              <Facebook size={28} />
            </a>
            <a
              href="https://www.instagram.com/babil_yalitim/"
              aria-label="Instagram"
              className="hover:text-quaternaryColor transition"
            >
              <Instagram size={28} />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-secondaryColor pt-6 text-center text-secondaryColor text-xs">
        © {new Date().getFullYear()} Babil Yalıtım. Tüm hakları saklıdır.
      </div>
    </footer>
  );
};

export default Footer;
