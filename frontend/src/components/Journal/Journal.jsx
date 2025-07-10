import Img1 from "../../assets/5.jpg";
import Img2 from "../../assets/6.jpg";
import { motion } from "framer-motion";
import { SlideUp } from "../../utility/animation";
import { useInView } from "react-intersection-observer";

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

  return (
    <section
      className="w-full bg-[#0f172a] text-white py-20 px-6"
      id="journal"
      ref={ref}
    >
      {/* header section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="text-center md:max-w-[650px] mx-auto space-y-4"
      >
        <p className="text-3xl font-semibold">The Journal</p>
        <p className="text-gray-300">
          We are all explorers, driven by curiosity and the desire to discover
          new horizons. Join us on a journey to uncover the wonders of our
          planet.
        </p>
      </motion.div>

      {/* cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center mt-20">
        {JournalData.map((data) => (
          <motion.div
            variants={SlideUp(data.delay)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            key={data.id}
            className="bg-[#152337] rounded-xl overflow-hidden shadow-md"
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
    </section>
  );
};

export default Journal;