import PropTypes from "prop-types";
import JournalCard from "./JournalCard";

const Skeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-white/40 bg-white/30 backdrop-blur-md shadow-md">
    <div className="w-full h-56 bg-gray-200/60 animate-pulse" />
    <div className="p-5">
      <div className="h-4 w-32 bg-gray-200/70 rounded mb-3 animate-pulse" />
      <div className="h-5 w-3/4 bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-gray-200/70 rounded mb-2 animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200/70 rounded animate-pulse" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30">
    <p className="text-secondaryColor font-semibold text-lg">
      Henüz haber eklenmemiş.
    </p>
    <p className="text-gray-600 mt-1">Yakında yeni içeriklerle buradayız.</p>
  </div>
);

const JournalPreview = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!data.length) return <EmptyState />;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item, index) => (
        <JournalCard key={item._id || index} item={item} index={index} />
      ))}
    </div>
  );
};

JournalPreview.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      about: PropTypes.string,
      image: PropTypes.string, // URL ya da dataURL
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
      ]),
    })
  ),
  loading: PropTypes.bool,
};

export default JournalPreview;
