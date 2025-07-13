import React from 'react'
import { CheckCircle, Users, Search, Headphones } from 'lucide-react'

const features = [
  {
    icon: <CheckCircle className="w-6 h-6 text-white" />,
    title: 'Kaliteli Hizmet',
    desc: 'Uzun ömürlü ve etkili yalıtım çözümleri sunar.',
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    title: 'Uzman Kadro',
    desc: 'Alanında deneyimli profesyonel ekip ile çalışır.',
  },
  {
    icon: <Search className="w-6 h-6 text-white" />,
    title: 'Ücretsiz Keşif',
    desc: 'Yerinde inceleme ile doğru çözüm planı oluşturur.',
  },
  {
    icon: <Headphones className="w-6 h-6 text-white" />,
    title: '7/24 Destek',
    desc: 'Her zaman ulaşabileceğiniz güçlü bir iletişim hattı.',
  },
]

const WhyUs = () => {
  return (
    <section className="w-full text-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Başlık */}
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Neden Babil Yalıtım?
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto mb-6 rounded"></div>

        {/* Açıklama */}
        <p className="text-gray-300 max-w-3xl mx-auto mb-12">
          Su yalıtımı sektöründe edindiğimiz 10 yılı aşkın deneyim ile, 
          projelerinize özel kalıcı çözümler geliştiriyoruz. Kalite, uzmanlık ve 
          müşteri memnuniyetini temel alan yaklaşımımızla her zaman yanınızdayız.
        </p>

        {/* Özellik Kutuları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-secondaryColor rounded-xl p-6 flex items-start gap-4 transition transform hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="bg-quaternaryColor p-3 rounded-full">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold text-lg">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyUs