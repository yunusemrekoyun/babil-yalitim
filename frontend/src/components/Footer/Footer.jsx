import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_LINK,
} from "../../config/site";

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
              <Link
                to="/about"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Projeler
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/iletisim"
                className="text-secondaryColor hover:text-quaternaryColor transition"
              >
                İletişim
              </Link>
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
              <MapPin size={18} className="text-secondaryColor" /> {CONTACT_ADDRESS}
            </li>
            <li className="flex items-center gap-2 ">
              <Phone size={18} className="text-secondaryColor" />{" "}
              <a
                href={`tel:${CONTACT_PHONE_LINK}`}
                className="hover:text-quaternaryColor transition"
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li className="flex items-center gap-2 ">
              <Mail size={18} className="text-secondaryColor" />{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="hover:text-quaternaryColor transition"
              >
                {CONTACT_EMAIL}
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
