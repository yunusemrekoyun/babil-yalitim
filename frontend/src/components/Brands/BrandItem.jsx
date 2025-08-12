import PropTypes from "prop-types";

const BrandItem = ({ brand }) => {
  return (
    <a
      href={brand.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <div className="w-32 h-20 flex items-center justify-center bg-white/70 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
        <img src={brand.img} alt={brand.name} className="h-12 object-contain" />
      </div>
    </a>
  );
};

BrandItem.propTypes = {
  brand: PropTypes.shape({
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    link: PropTypes.string,
  }).isRequired,
};

export default BrandItem;
