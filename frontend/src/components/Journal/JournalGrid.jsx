import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import api from "../../api";
import JournalGridItem from "./JournalGridItem";

const JournalGrid = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 });
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    api
      .get("/journals")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : [];
        // sadece ilk 2 kart
        setJournals(
          list.slice(0, 2).map((j) => ({
            _id: j._id,
            title: j.title,
            // backend: cover.url
            coverUrl: j?.cover?.url || "",
            // içerik (kısa gösterim için)
            content: j?.content || "",
            // tarih (createdAt öncelikli)
            date: j?.createdAt || j?.updatedAt || null,
          }))
        );
      })
      .catch(console.error);
  }, []);

  return (
    <section
      className="w-full text-white py-20 px-6 relative"
      id="journal"
      ref={ref}
    >
      {/* header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Haberler
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded mb-6"></div>
      </div>

      {/* cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center mt-20">
        {journals.map((item, index) => (
          <JournalGridItem
            key={item._id}
            item={item}
            index={index}
            inView={inView}
          />
        ))}
      </div>

      {/* sağ alt köşe buton */}
      <motion.div
        key={inView ? "visible" : "hidden"}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute bottom-6 right-6 z-20"
      >
        <button
          onClick={() => navigate("/journal")}
          className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
            px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 transition-all duration-300"
        >
          Journal&apos;ın devamı için...
          <FiArrowRight className="text-lg" />
        </button>
      </motion.div>
    </section>
  );
};

export default JournalGrid;
