// src/components/Blog/OtherBlogItem.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const looksVideo = (u) =>
  /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i.test(String(u || ""));
const thumbFrom = (blog) => {
  const cover = blog?.cover?.url || "";
  if (cover) return { url: cover, isVideo: looksVideo(cover) };

  const first = (Array.isArray(blog?.assets) ? blog.assets : [])
    .concat(Array.isArray(blog?.images) ? blog.images : [])
    .concat(Array.isArray(blog?.media) ? blog.media : [])
    .find((m) => m?.url);

  const url = first?.url || "";
  return { url, isVideo: looksVideo(url) };
};

const OtherBlogItem = ({ blog }) => {
  const { url, isVideo } = thumbFrom(blog);
  const date = blog?.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("tr-TR")
    : "";

  return (
    <Link
      to={`/blog/${blog._id}`}
      className="group flex gap-3 rounded-xl overflow-hidden border bg-white hover:shadow-md transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-quaternaryColor/60"
      aria-label={`${blog?.title || "Blog"} detayına git`}
    >
      <div className="w-20 h-16 overflow-hidden shrink-0 bg-gray-100">
        {url ? (
          isVideo ? (
            <video
              src={url}
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <img
              src={url}
              alt={blog?.title || "kapak"}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
      </div>

      <div className="flex-1 py-1.5 pr-2">
        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
          {blog?.title || "Başlık"}
        </h4>
        <p className="text-[11px] text-gray-500 mt-0.5">{date}</p>
      </div>
    </Link>
  );
};

OtherBlogItem.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    createdAt: PropTypes.string,
    cover: PropTypes.shape({ url: PropTypes.string }),
    assets: PropTypes.array,
    images: PropTypes.array,
    media: PropTypes.array,
  }).isRequired,
};

export default OtherBlogItem;
