import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const JournalPreview = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 px-2 md:px-6 pb-6">
      {" "}
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          className="relative flex flex-col md:flex-row bg-white/10 backdrop-blur-md rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/journal/${item.id}`)}
        >
          {/* Görsel */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full md:w-60 h-60 object-cover"
          />

          {/* İçerik */}
          <div className="flex flex-col p-6 text-black relative w-full">
            {/* Tarih */}
            <p className="absolute top-4 right-6 text-xs text-gray-600 uppercase">
              {item.date}
            </p>

            {/* Başlık */}
            <h3 className="text-xl font-semibold text-secondaryColor mb-2">
              {item.title}
            </h3>

            {/* Açıklama */}
            <p className="text-gray-700 line-clamp-3">{item.about}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

JournalPreview.propTypes = {
  data: PropTypes.array.isRequired,
};

export default JournalPreview;
