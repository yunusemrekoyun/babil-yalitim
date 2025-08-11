// src/components/Journal/Journal.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import api from "../../api";

const Journal = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 });
  const navigate = useNavigate();
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    api
      .get("/journal")
      .then(({ data }) => setJournals(data.slice(0, 2))) // sadece ilk 2 tanesi
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
        {journals.map((data, index) => (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            key={data._id}
            className="bg-secondaryColor rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-[350px] object-cover"
            />
            <div className="space-y-2 py-6 px-6 text-center">
              <p className="uppercase text-sm text-green-300">
                {new Date(data.date).toLocaleDateString("tr-TR")}
              </p>
              <p className="text-xl font-semibold">{data.title}</p>
              <p className="text-gray-300 mt-4">{data.about}</p>
            </div>
          </motion.div>
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

export default Journal;
