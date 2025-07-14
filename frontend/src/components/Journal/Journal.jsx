import Img1 from "../../assets/5.jpg";
import Img2 from "../../assets/6.jpg";
import { motion } from "framer-motion";
import { SlideUp } from "../../utility/animation";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const JournalData = [
  {
    id: 1,
    title: "An Unforgettable",
    about:
      "If you only have one day to visit Yosemite National Park and you want to make the most out of it.",
    date: "May 30, 2022",
    url: "#",
    image: Img1,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Symphonies in Steel",
    about:
      "Crossing the Golden Gate Bridge from San Francisco, you arrive in March even before landing on solid ground.",
    date: "April 30, 2021",
    url: "#",
    image: Img2,
    delay: 0.4,
  },
];

const Journal = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 });
  const navigate = useNavigate();

  return (
    <section
      className="w-full text-white py-20 px-6 relative"
      id="journal"
      ref={ref}
    >
      {/* header */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          The Journal
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded mb-6"></div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We are all explorers, driven by curiosity and the desire to discover
          new horizons. Join us on a journey to uncover the wonders of our
          planet.
        </p>
      </div>

      {/* cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center mt-20">
        {JournalData.map((data) => (
          <motion.div
            variants={SlideUp(data.delay)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            key={data.id}
            className="bg-secondaryColor rounded-xl overflow-hidden shadow-md"
          >
            <img
              src={data.image}
              alt=""
              className="w-full h-[350px] object-cover"
            />
            <div className="space-y-2 py-6 px-6 text-center">
              <p className="uppercase text-sm text-green-300">{data.date}</p>
              <p className="text-xl font-semibold">{data.title}</p>
              <p className="text-gray-300 mt-4">{data.about}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sağ alt köşe linki */}
      <button
        onClick={() => navigate("/journal")}
        className="absolute bottom-6 right-6 flex items-center gap-2 text-sm text-white bg-quaternaryColor 
        px-4 py-2 rounded-full hover:bg-opacity-90  hover:shadow-lg hover:bg-white/20 transition-all duration-300"
      >
        Journal'ın devamı için...
        <FiArrowRight className="text-lg" />
      </button>
    </section>
  );
};

export default Journal;