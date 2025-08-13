// src/pages/KVKKPage.jsx
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";

/** ---------- Reusable Section ---------- */
const Section = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-28">
    <h2 className="text-xl md:text-2xl font-bold text-secondaryColor">
      {title}
    </h2>
    <div className="h-[3px] w-14 bg-quaternaryColor/90 rounded-full mt-2 mb-4" />
    <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-li:text-gray-700">
      {children}
    </div>
  </section>
);

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

/**
 * Babil Yalıtım – KVKK Aydınlatma Metni
 * Site: babilyalitim.com
 * Bu metin örnek/temel hukuki içerik sağlar; işletmenize özel değişkenleri (ticari unvan, adres, yetkili kişi vb.)
 * lütfen güncelleyin.
 */
const KvkkPage = () => {
  const updatedAt = "01.09.2025"; // son güncelleme tarihini burada güncelle

  return (
    <>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-orange-50"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <NavbarPage />

        {/* Hero */}
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-16 w-[420px] h-[420px] rounded-full bg-quaternaryColor/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-[320px] h-[320px] rounded-full bg-secondaryColor/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 md:pt-18">
            <h1 className="text-3xl md:text-5xl font-extrabold text-secondaryColor tracking-tight">
              Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni (KVKK)
            </h1>
            <p className="mt-4 text-gray-600 max-w-3xl">
              6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında
              kişisel verilerinizin işlenmesine ilişkin olarak veri sorumlusu{" "}
              <strong>Babil Yalıtım</strong> tarafından işbu aydınlatma metni
              ile bilgilendiriliyorsunuz.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Son güncelleme tarihi: <strong>{updatedAt}</strong>
            </p>
            <div className="h-1 w-24 bg-quaternaryColor/90 rounded-full mt-6" />
          </div>
        </header>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-6 md:px-10 pb-20 pt-10">
          {/* TOC */}
          <nav className="mb-10 rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-6">
            <h2 className="text-lg font-semibold text-brandBlue mb-3">
              İçindekiler
            </h2>
            <ul className="grid md:grid-cols-2 gap-y-2 text-sm">
              {[
                ["veri-sorumlusu", "1. Veri Sorumlusu ve İletişim"],
                ["isleme-amac", "2. Kişisel Verilerin İşlenme Amaçları"],
                ["kategori-hukuki", "3. Veri Kategorileri ve Hukuki Sebepler"],
                ["toplama-yontem", "4. Toplama Yöntemleri"],
                ["aktarma", "5. Aktarım Yapılan Taraflar ve Amaçlar"],
                ["haklar", "6. KVKK m.11 Kapsamındaki Haklarınız"],
                ["basvuru", "7. Başvuru Yöntemi"],
                ["saklama-guvenlik", "8. Saklama Süreleri ve Güvenlik"],
                ["cerez", "9. Çerezler ve Benzeri Teknolojiler"],
                ["taminek", "10. Aydınlatma Metni’ndeki Değişiklikler"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="text-gray-700 hover:text-quaternaryColor underline-offset-2 hover:underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main text */}
            <div className="lg:col-span-2 space-y-10">
              <Section
                id="veri-sorumlusu"
                title="1. Veri Sorumlusu ve İletişim"
              >
                <p>
                  Veri sorumlusu: <strong>Babil Yalıtım</strong> (
                  <em>babilyalitim.com</em>)
                </p>
                <ul className="list-disc pl-5 mt-3">
                  <li>Adres: [adresinizi ekleyin]</li>
                  <li>Telefon: [telefon]</li>
                  <li>
                    E-posta:{" "}
                    <a
                      className="underline"
                      href="mailto:babilyalitim@gmail.com"
                    >
                      babilyalitim@gmail.com
                    </a>
                  </li>
                </ul>
              </Section>

              <Section
                id="isleme-amac"
                title="2. Kişisel Verilerin İşlenme Amaçları"
              >
                <p>
                  Aşağıdaki amaçlarla sınırlı ve ölçülü olarak verileriniz
                  işlenmektedir:
                </p>
                <ul className="list-disc pl-5 mt-3">
                  <li>
                    Hizmetlerin sunulması, tekliflendirme, sözleşme ve proje
                    süreçlerinin yürütülmesi
                  </li>
                  <li>Müşteri ilişkileri ve talep/şikâyet yönetimi</li>
                  <li>Bakım, destek ve kalite geliştirme aktiviteleri</li>
                  <li>
                    Meşru menfaatler kapsamında site analitiği, performans
                    ölçümü ve güvenlik
                  </li>
                  <li>
                    Açık rızanız varsa pazarlama/iletişim faaliyetleri (bülten,
                    kampanya vb.)
                  </li>
                  <li>
                    Yasal yükümlülüklerin yerine getirilmesi ve yetkili
                    kurumlara bilgi verilmesi
                  </li>
                </ul>
              </Section>

              <Section
                id="kategori-hukuki"
                title="3. Veri Kategorileri ve Hukuki Sebepler"
              >
                <p>İşlenen veri kategorileri örnek olarak şunlardır:</p>
                <ul className="list-disc pl-5 mt-3">
                  <li>
                    Kimlik ve iletişim bilgileri (ad, soyad, e‑posta, telefon
                    vb.)
                  </li>
                  <li>
                    İşlem ve işlem güvenliği verileri (IP, oturum, log
                    kayıtları)
                  </li>
                  <li>Talep/şikâyet bilgileriniz, mesaj içerikleriniz</li>
                  <li>
                    Site kullanımına ilişkin veriler (ziyaret edilen sayfalar,
                    süre, cihaz/ tarayıcı bilgileri)
                  </li>
                </ul>
                <p className="mt-3">
                  Hukuki sebepler (KVKK m.5/2 ve m.6): kanunlarda açıkça
                  öngörülmesi, sözleşmenin kurulması/ifası, veri sorumlusunun
                  meşru menfaati, bir hakkın tesisi/kullanılması/korunması,
                  hukuki yükümlülüklerin yerine getirilmesi, açık rıza
                  (pazarlama çerezleri gibi durumlarda).
                </p>
              </Section>

              <Section id="toplama-yontem" title="4. Toplama Yöntemleri">
                <p>
                  Verileriniz; çevrimiçi formlar, e‑posta, telefon,
                  teklif/sözleşme süreçleri ve web sitemizde kullanılan
                  çerez/benzeri teknolojiler aracılığıyla otomatik veya kısmen
                  otomatik yollarla toplanır.
                </p>
              </Section>

              <Section
                id="aktarma"
                title="5. Aktarım Yapılan Taraflar ve Amaçlar"
              >
                <p>
                  Sözleşmesel ve yasal gereklilikler çerçevesinde verileriniz;
                  tedarikçilerimize, barındırma/altyapı hizmeti sunan firmalara,
                  iş ortaklarımıza, muhasebe/finans danışmanlarımıza, hukuki
                  danışmanlara ve yetkili kamu kurumlarına aktarılabilir. Yurt
                  dışına aktarım söz konusu olursa, KVKK’ya uygun hukuki
                  mekanizmalar sağlanarak gerçekleştirilir.
                </p>
              </Section>

              <Section id="haklar" title="6. KVKK m.11 Kapsamındaki Haklarınız">
                <p>KVKK m.11 uyarınca;</p>
                <ul className="list-disc pl-5 mt-3">
                  <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
                  <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                  <li>
                    İşleme amacını ve amaca uygun kullanılıp kullanılmadığını
                    öğrenme,
                  </li>
                  <li>
                    Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri
                    bilme,
                  </li>
                  <li>Eksik/yanlış işlenmişse düzeltilmesini isteme,</li>
                  <li>
                    KVKK ve ilgili mevzuata uygun olarak silinmesini/yok
                    edilmesini isteme,
                  </li>
                  <li>Aktarılan üçüncü kişilere bildirilmesini isteme,</li>
                  <li>
                    Otomatik sistemlerce analiz edilmesi suretiyle aleyhinize
                    bir sonucun ortaya çıkmasına itiraz etme,
                  </li>
                  <li>
                    Kanuna aykırı işlenme sebebiyle zarara uğramanız hâlinde
                    zararın giderilmesini talep etme
                  </li>
                </ul>
              </Section>

              <Section id="basvuru" title="7. Başvuru Yöntemi">
                <p>
                  Haklarınıza ilişkin taleplerinizi{" "}
                  <a className="underline" href="mailto:info@babilyalitim.com">
                    babilyalitim@gmail.com
                  </a>{" "}
                  adresine iletebilir veya posta yoluyla veri sorumlusu adresine
                  gönderebilirsiniz. Başvurular en geç 30 gün içinde
                  sonuçlandırılır; ek bilgiye ihtiyaç duyulması hâlinde
                  tarafınıza dönüş yapılır.
                </p>
              </Section>

              <Section
                id="saklama-guvenlik"
                title="8. Saklama Süreleri ve Güvenlik"
              >
                <p>
                  Verileriniz; ilgili mevzuatta öngörülen süreler ve meşru
                  amaçlar için gerektiği kadar saklanır, sürenin sonunda
                  silinir, yok edilir veya anonim hale getirilir. Uygun teknik
                  ve idari tedbirler (erişim kontrolü, şifreleme, loglama, yetki
                  matrisi vb.) ile verilerinizin güvenliği için azami özen
                  gösterilir.
                </p>
              </Section>

              <Section id="cerez" title="9. Çerezler ve Benzeri Teknolojiler">
                <p>
                  <strong>babilyalitim.com</strong>’da zorunlu,
                  performans/analitik ve tercihe bağlı pazarlama çerezleri
                  kullanılabilir. Zorunlu çerezler sitenin çalışması için
                  gereklidir. Analitik/pazarlama çerezleri için açık rızanız
                  alınır; dilediğiniz zaman çerez tercihlerinizi
                  değiştirebilirsiniz. Çerez yönetimi için tarayıcı ayarlarını
                  veya sitemizdeki çerez tercih panelini kullanabilirsiniz.
                </p>
                <ul className="list-disc pl-5 mt-3">
                  <li>
                    Zorunlu çerezler: oturum, güvenlik, dolandırıcılık önleme
                  </li>
                  <li>
                    Performans/analitik: ziyaret sayıları, gezinme akışları
                    (anonimleştirilmiş)
                  </li>
                  <li>
                    Pazarlama (varsa): kampanya ve kişiselleştirme —{" "}
                    <em>açık rıza gerektirir</em>
                  </li>
                </ul>
              </Section>

              <Section
                id="taminek"
                title="10. Aydınlatma Metni’ndeki Değişiklikler"
              >
                <p>
                  Bu metin ihtiyaç halinde güncellenebilir. Güncel sürüm her
                  zaman <strong>babilyalitim.com</strong> üzerinde yayımlanır.
                </p>
              </Section>
            </div>

            {/* Side panel */}
            <aside className="space-y-6">
              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-6">
                <h3 className="text-base font-semibold text-brandBlue">
                  Hızlı Bağlantılar
                </h3>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <a
                      href="#haklar"
                      className="text-gray-700 hover:text-quaternaryColor underline"
                    >
                      KVKK m.11 Haklarınız
                    </a>
                  </li>
                  <li>
                    <a
                      href="#basvuru"
                      className="text-gray-700 hover:text-quaternaryColor underline"
                    >
                      Başvuru Yöntemi
                    </a>
                  </li>
                  <li>
                    <a
                      href="#cerez"
                      className="text-gray-700 hover:text-quaternaryColor underline"
                    >
                      Çerez Politikası Özeti
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-6">
                <h3 className="text-base font-semibold text-brandBlue">
                  İletişim
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  E‑posta:{" "}
                  <a className="underline" href="mailto:info@babilyalitim.com">
                    babilyalitim@gmail.com
                  </a>
                  <br />
                  Adres: [adresinizi ekleyin]
                </p>
              </div>

              <div className="rounded-2xl bg-white/70 backdrop-blur border border-white/50 p-6">
                <h3 className="text-base font-semibold text-brandBlue">
                  Analitik Tercihleriniz
                </h3>
                <p className="text-sm text-gray-700">
                  Analitik ve pazarlama çerezleri için tercihinizi site
                  altbilgisindeki “Çerez Tercihleri” bağlantısından
                  güncelleyebilirsiniz.
                </p>
              </div>
            </aside>
          </div>
        </main>
      </motion.div>

      <Footer />
    </>
  );
};

export default KvkkPage;
