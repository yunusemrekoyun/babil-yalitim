import PropTypes from "prop-types";

const BrandItem = ({ brand }) => {
  return (
    <div className="bg-white/10 rounded-xl p-4 flex justify-center items-center shadow hover:scale-105 transition duration-300 backdrop-blur-md aspect-square">
      <img
        src={brand.image}
        alt={brand.name}
        className="h-[70%] w-[70%] object-contain"
      />
    </div>
  );
};

BrandItem.propTypes = {
  brand: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default BrandItem;
