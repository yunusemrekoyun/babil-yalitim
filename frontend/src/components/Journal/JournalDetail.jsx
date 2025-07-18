// src/components/Journal/JournalDetail.jsx
import PropTypes from "prop-types";

const JournalDetail = ({ journal }) => {
  return (
    <div className="w-full px-4 md:px-10 py-6 space-y-10">
      {/* Üst kısım - görsel ve özet */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img
          src={journal.image}
          alt={journal.title}
          className="w-full md:w-1/2 h-72 object-cover rounded-lg"
        />
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor">
            {journal.title}
          </h2>
          <p className="text-sm text-gray-600 uppercase">{journal.date}</p>
        </div>
      </div>

      {/* Alt kısım - içerik */}
      <div className="text-gray-800 leading-relaxed">{journal.about}</div>
    </div>
  );
};

JournalDetail.propTypes = {
  journal: PropTypes.shape({
    title: PropTypes.string,
    date: PropTypes.string,
    about: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

export default JournalDetail;