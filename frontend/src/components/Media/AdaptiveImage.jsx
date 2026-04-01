import PropTypes from "prop-types";
import { getResponsiveImageProps } from "../../utils/cloudinary";
import { usePerformanceProfile } from "../../performance/PerformanceProvider";

const AdaptiveImage = ({
  media,
  alt,
  className = "",
  fallbackSrc,
  loading = "lazy",
  decoding = "async",
  sizes,
  widths,
  width,
  height,
  crop,
  gravity,
  quality,
  fetchPriority,
  ...rest
}) => {
  const profile = usePerformanceProfile();
  const imageProps = getResponsiveImageProps(media, {
    width: width || profile.cardImageWidth,
    widths,
    height,
    sizes,
    crop,
    gravity,
    quality: quality || profile.imageQuality,
    fallbackSrc,
  });
  const priorityProps = fetchPriority ? { fetchpriority: fetchPriority } : {};

  return (
    <img
      {...rest}
      {...imageProps}
      {...priorityProps}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
    />
  );
};

AdaptiveImage.propTypes = {
  media: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string,
      publicId: PropTypes.string,
      resourceType: PropTypes.string,
    }),
  ]),
  alt: PropTypes.string,
  className: PropTypes.string,
  fallbackSrc: PropTypes.string,
  loading: PropTypes.oneOf(["lazy", "eager"]),
  decoding: PropTypes.oneOf(["sync", "async", "auto"]),
  sizes: PropTypes.string,
  widths: PropTypes.arrayOf(PropTypes.number),
  width: PropTypes.number,
  height: PropTypes.number,
  crop: PropTypes.string,
  gravity: PropTypes.string,
  quality: PropTypes.string,
  fetchPriority: PropTypes.oneOf(["high", "low", "auto"]),
};

export default AdaptiveImage;
