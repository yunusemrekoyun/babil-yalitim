import img1 from '../../assets/1.jpg'
import { Users, CheckCircle } from 'lucide-react'

const About = () => {
  return (
    <section className="w-full  text-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Sol: Görsel */}
        <div className="rounded-xl overflow-hidden shadow-lg max-h-[450px]">
          <img
            src={img1} 
            alt="Yalıtım uygulaması"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Sağ: İçerik */}
        <div className="bg-secondaryColor p-8 rounded-xl shadow-md">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hakkımızda</h2>
          <div className="h-1 w-20 bg-quaternaryColor mb-6 rounded"></div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Firmamız 2013 yılından beri Kütahya’da su yalıtımı üzerine hizmet vermektedir. 
            Temel izolasyonu, perde beton izolasyonu, PVC geomembran uygulama, teras ve çatı izolasyonu, 
            havuz ve ıslak zemin izolasyonu, depo izolasyonu, poliüretan köpük uygulamaları, 
            polyurea kaplama ve enjeksiyon sistemleri alanlarında profesyonel çözümler sunmaktayız.
          </p>

          {/* Sayısal Bilgiler */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 bg-tertiaryColor p-4 rounded">
              <Users className="text-quaternaryColor w-6 h-6" />
              <div>
                <div className="text-xl font-bold text-quaternaryColor">1234</div>
                <div className="text-sm text-quaternaryColor">Mutlu Müşteri</div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-tertiaryColor p-4 rounded">
              <CheckCircle className="text-quaternaryColor w-6 h-6" />
              <div>
                <div className="text-xl font-bold text-quaternaryColor">1234</div>
                <div className="text-sm text-quaternaryColor">Tamamlanan Proje</div>
              </div>
            </div>
          </div>

          {/* Buton */}
          <button className="bg-quaternaryColor hover:bg-quaternaryColor text-white px-6 py-3 rounded font-medium transition transform hover:shadow-2xl hover:-translate-y-1">
            Daha Fazlasını Keşfedin
          </button>
        </div>
      </div>
    </section>
  )
}

export default About