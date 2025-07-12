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
      className="w-full bg-tertiaryColor text-white py-20 px-6"
      id="journal"
      ref={ref}
    >
      {/* header section */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">The Journal</h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded mb-6"></div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          We are all explorers, driven by curiosity and the desire to discover new horizons. Join us on a journey to uncover the wonders of our planet.
        </p>
      </div>

      {/* cards section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center mt-20">
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
    </section>
  );
};

export default Journal;