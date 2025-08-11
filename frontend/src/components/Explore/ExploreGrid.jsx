import PropTypes from "prop-types";
import ServiceCard from "./ServiceCard";

const ExploreGrid = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-8 text-center text-gray-600">
        Henüz hizmet eklenmemiş.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s, i) => (
        <ServiceCard key={s._id || i} service={s} index={i} />
      ))}
    </div>
  );
};

ExploreGrid.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      // medya:
      imageDataUrl: PropTypes.string,
      galleryDataUrls: PropTypes.array,
      imageUrl: PropTypes.string,
      videoUrl: PropTypes.string,
      // opsiyonel kategoriler
      category: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default ExploreGrid;
