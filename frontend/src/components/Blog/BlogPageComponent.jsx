import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const BlogPageComponent = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="grid sm:grid-cols-2 gap-8 w-full px-4 md:px-12 mb-10">
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          onClick={() => navigate(`/blog/${item.id}`)}
          className="bg-white/10 backdrop-blur-md rounded-xl shadow-md overflow-hidden 
          hover:shadow-xl transition-all cursor-pointer flex flex-col duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Görsel */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-56 object-cover"
          />

          {/* İçerik */}
          <div className="p-4 flex flex-col justify-between h-full">
            <h3 className="text-base font-semibold text-secondaryColor line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-black line-clamp-3 mt-1">
              {item.about}
            </p>
            <p className="text-[11px] text-right text-gray-300 mt-auto">
              {item.date}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

BlogPageComponent.propTypes = {
  data: PropTypes.array.isRequired,
};

export default BlogPageComponent;