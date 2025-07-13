import PropTypes from "prop-types";

const GlassSection = ({ children }) => (
  <div
    className="relative z-10 w-full max-w-6xl rounded-3xl backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl overflow-hidden
    transition-all duration-300 "
    style={{
      willChange: "transform, box-shadow, backdrop-filter",
    }}
  >
    {children}
  </div>
);
GlassSection.propTypes = {
  children: PropTypes.node,
};

export default GlassSection;
