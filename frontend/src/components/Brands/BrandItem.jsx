import PropTypes from "prop-types";

const BrandItem = ({ brand }) => {
  return (
    <div className="w-32 h-20 flex items-center justify-center bg-white/60 rounded-xl shadow-sm hover:scale-105 transition-transform duration-300">
      <img src={brand.img} alt={brand.name} className="h-12 object-contain" />
    </div>
  );
};

BrandItem.propTypes = {
  brand: PropTypes.shape({
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default BrandItem;
