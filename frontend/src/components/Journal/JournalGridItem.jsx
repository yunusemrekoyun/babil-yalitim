import PropTypes from "prop-types";
import { motion } from "framer-motion";

const twoLineClamp = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const JournalGridItem = ({ item, index, inView }) => {
  const prettyDate = item?.date
    ? new Date(item.date).toLocaleDateString("tr-TR")
    : "";

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-secondaryColor rounded-xl overflow-hidden shadow-md w-full"
    >
      {item?.coverUrl ? (
        <img
          src={item.coverUrl}
          alt={item?.title || "Haber"}
          className="w-full h-[350px] object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-[350px] bg-gray-300" />
      )}

      <div className="space-y-2 py-6 px-6 text-center">
        {prettyDate && (
          <p className="uppercase text-sm text-green-300">{prettyDate}</p>
        )}
        <p className="text-xl font-semibold">{item?.title}</p>

        {/* içerikten kısa özet; eski tasarımda about kullanılıyordu */}
        {item?.content && (
          <p
            className="text-gray-200 mt-4"
            style={twoLineClamp}
            title={item.content}
          >
            {item.content}
          </p>
        )}
      </div>
    </motion.div>
  );
};

JournalGridItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    coverUrl: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  index: PropTypes.number.isRequired,
  inView: PropTypes.bool,
};

export default JournalGridItem;
