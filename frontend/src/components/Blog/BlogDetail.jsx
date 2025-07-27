import { useState } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

// Sahte yorum verisi
const dummyComments = [
  { id: 1, name: "Ahmet", text: "Çok bilgilendirici bir yazı olmuş!" },
  {
    id: 2,
    name: "Zeynep",
    text: "Malzeme seçimi konusunda çok yardımcı oldu.",
  },
  {
    id: 3,
    name: "Mert",
    text: "Bu konuyu daha önce hiç bu kadar net okumamıştım.",
  },
  { id: 4, name: "Elif", text: "Yazılarınızın devamını bekliyorum!" },
  { id: 5, name: "Kerem", text: "Harika anlatım, teşekkürler." },
];

const BlogDetail = ({ blog }) => {
  const [visibleComments, setVisibleComments] = useState(3);

  return (
    <motion.div
      className="w-full max-w-6xl bg-white/20 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden text-black"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Üst Görsel + Başlıklar */}
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Sol: Görsel */}
        <div className="w-full md:w-1/2">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[450px] object-cover rounded-xl"
          />
        </div>

        {/* Sağ: Başlık + Özet */}
        <div className="w-full md:w-1/2 flex flex-col justify-center mt-6 md:mt-0 px-4 md:px-0">
          <p className="text-xs text-gray-600 uppercase mb-3">{blog.date}</p>
          <h2 className="text-3xl font-bold text-secondaryColor mb-5">
            {blog.title}
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed">
            {blog.summary}
          </p>
        </div>
      </div>
      {/* About - Ana İçerik */}
      <div className="px-10 pt-6 text-gray-800 leading-relaxed text-lg">
        <h4 className="text-xl font-semibold text-secondaryColor mb-2">
          Detaylar
        </h4>
        <p>{blog.about}</p>
      </div>

      {/* Yorumlar */}
      <div className="px-10 pb-12 pt-10">
        <h3 className="text-xl font-semibold text-secondaryColor mb-4">
          Yorumlar
        </h3>
        <div className="space-y-4">
          {dummyComments.slice(0, visibleComments).map((comment) => (
            <div
              key={comment.id}
              className="bg-white/40 backdrop-blur-md rounded-lg px-4 py-3 shadow"
            >
              <p className="text-sm font-semibold">{comment.name}</p>
              <p className="text-sm text-gray-700">{comment.text}</p>
            </div>
          ))}
        </div>

        {/* Daha fazla yorum göster */}
        {visibleComments < dummyComments.length && (
          <button
            onClick={() => setVisibleComments((prev) => prev + 2)}
            className="mt-4 text-sm text-secondaryColor underline hover:text-secondaryColor/80 transition"
          >
            Daha fazla yorum yükle
          </button>
        )}
      </div>
    </motion.div>
  );
};
BlogDetail.propTypes = {
  blog: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogDetail;
