// src/components/Consent/CookieConsent.jsx
import PropTypes from "prop-types";

const CookieConsent = ({ visible, onAccept, onDecline }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[9999] mx-auto max-w-3xl px-4">
      <div className="rounded-2xl border border-white/50 bg-white/80 backdrop-blur p-4 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
        <p className="text-sm text-gray-700">
          Deneyiminizi iyileştirmek ve anonim kullanım verilerini toplamak için
          çerezleri kullanıyoruz. KVKK kapsamında onay vererek bu verilerin
          işlenmesini kabul edersiniz. Ayrıntılar için{" "}
          <a href="/kvkk" className="text-quaternaryColor underline">
            KVKK Aydınlatma Metni
          </a>
          .
        </p>
        <div className="mt-3 flex items-center gap-2 justify-end">
          <button
            onClick={onDecline}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 bg-white hover:bg-gray-50"
          >
            Reddet
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-sm rounded-full bg-quaternaryColor text-white hover:opacity-90"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
};

CookieConsent.propTypes = {
  visible: PropTypes.bool.isRequired,
  onAccept: PropTypes.func.isRequired,
  onDecline: PropTypes.func.isRequired,
};

export default CookieConsent;
