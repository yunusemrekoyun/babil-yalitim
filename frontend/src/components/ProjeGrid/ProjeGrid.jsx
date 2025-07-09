import React from 'react'
import { motion } from 'framer-motion'

import img1 from '../../assets/1.jpg'
import img2 from '../../assets/2.jpg'
import img3 from '../../assets/3.jpg'
import img4 from '../../assets/4.jpg'
import img5 from '../../assets/5.jpg'
import img6 from '../../assets/6.jpg'

const projectData = [
  {
    title: 'Çatı Yalıtımı',
    image: img1,
    description: 'Yüksek dayanımlı çatı yalıtım malzemeleri ile uygulandı.',
    size: 'large',
  },
  {
    title: 'Zemin Kaplama',
    image: img2,
    description: 'Kaymaz ve hijyenik epoksi kaplama sistemi kullanıldı.',
    size: 'small',
  },
  {
    title: 'Temel İzolasyon',
    image: img3,
    description: 'Yeraltı su sızıntısına karşı yüksek izolasyon sağlandı.',
    size: 'small',
  },
  {
    title: 'Cephe Kaplama',
    image: img4,
    description: 'Modern cephe panelleriyle dış görünüm yenilendi.',
    size: 'small',
  },
  {
    title: 'Endüstriyel Alan',
    image: img5,
    description: 'Fabrika çatısı komple yalıtım altına alındı.',
    size: 'small',
  },
  {
    title: 'Saha Yalıtımı',
    image: img6,
    description: 'Açık saha zemini sıvı geçirimsiz malzeme ile kaplandı.',
    size: 'small',
  },
]

const ProjeGrid = () => {
  return (
    <section className="w-full px-4 py-16 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
        {projectData.map((project, index) => (
     <motion.div
  key={index}
  className={`
    group relative overflow-hidden rounded-xl bg-cover bg-center text-white 
    ${project.size === 'large' ? 'col-span-2 row-span-2 md:row-span-2 md:col-span-2' : ''}
  `}
  style={{ backgroundImage: `url(${project.image})` }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.3 }}
  variants={{
    hidden: { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6, delay: index * 0.1 } }
  }}
>
            {/* Arka plan karartması */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>

            {/* Title */}
            <div
              className="absolute bottom-4 left-4 z-20 text-xl font-semibold 
              transition-transform duration-300 group-hover:-translate-y-12"
            >
              {project.title}
            </div>

            {/* Hover Açıklama */}
            <div
              className="absolute bottom-0 left-0 w-full bg-black/70 text-sm p-4 z-30
              opacity-0 translate-y-full pointer-events-none 
              group-hover:opacity-100 group-hover:translate-y-0 
              transition-all duration-300 ease-in-out"
            >
              {project.description}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default ProjeGrid