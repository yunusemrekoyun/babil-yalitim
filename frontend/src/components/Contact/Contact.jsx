const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 md:px-8">
      <h2 className="text-3xl md:text-5xl font-bold text-secondaryColor text-center">
        İletişim
      </h2>
      <div className="h-1 w-24 bg-secondaryColor mx-auto my-6 rounded-full" />

      <div className="grid md:grid-cols-2 gap-10 bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl mt-10">
        {/* Firma Bilgileri */}
        <div className="space-y-6 text-black">
          <h3 className="text-2xl font-semibold text-quaternaryColor">
            Bize Ulaşın
          </h3>
          <p>Adres: Atatürk Mah. İnşaat Cad. No:1, Çanakkale</p>
          <p>
            Telefon:{" "}
            <a href="tel:+905551112233" className="text-blue-700 hover:underline">
              +90 555 111 22 33
            </a>
          </p>
          <p>
            E-posta:{" "}
            <a href="mailto:info@babilyalitim.com" className="text-blue-700 hover:underline">
              info@babilyalitim.com
            </a>
          </p>
        </div>

        {/* Form */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Adınız Soyadınız"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-quaternaryColor transition"
          />
          <input
            type="email"
            placeholder="E-posta Adresiniz"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-quaternaryColor transition"
          />
          <textarea
            placeholder="Mesajınız"
            rows="5"
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-quaternaryColor transition resize-none"
          ></textarea>
          <button
            type="submit"
            className="bg-quaternaryColor text-white font-semibold py-3 rounded-lg hover:bg-secondaryColor transition-all"
          >
            Gönder
          </button>
        </form>
      </div>

      {/* Harita Bölümü */}
      <div className="mt-12 rounded-xl overflow-hidden shadow-xl">
        <iframe
          title="Babil Yalıtım Konumu"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3048.339230087954!2d26.404188!3d40.155187!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b06f7784efdbf3%3A0x3b3de47d5d77e56e!2sAtatürk%20Mah.%20İn%C5%9Faat%20Cad.%20No%3A1%2C%20%C3%87anakkale!5e0!3m2!1str!2str!4v1690300123456"
          width="100%"
          height="400"
          allowFullScreen=""
          loading="lazy"
          className="w-full"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;