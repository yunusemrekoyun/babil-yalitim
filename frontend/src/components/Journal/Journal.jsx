import Img1 from "../../assets/5.jpg";
import Img2 from "../../assets/6.jpg";
import { motion } from "framer-motion";
import { SlideUp } from "../../utility/animation";
import { useInView } from "react-intersection-observer";

const JournalData = [
  {
    id: 1,
    title: "An Unforgattable",
    about:
      "If you only have one day to visit yosemite National Park and you want to make the out of it.",
    date: "May 30, 2022",
    url: "#",
    image: Img1,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Symphonies in Steel",
    about:
      "Crossing the Golden Gate Bridge from San Francisco, you arrive in march even before landing on told ground.",
    date: "April 30, 2021",
    url: "#",
    image: Img2,
    delay: 0.4,
  },
];

const Journal = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 });

  return (
    <>
      <section className="container mt-40" id="journal" ref={ref}>
        {/* header section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-center md:max-w-[650px] mx-auto space-y-4 "
        >
          <p className="text-3xl"> The Journal</p>
          <p>
            we are all explorers, driven by curiosity and the desire to discover
            new horizons. Join us on a journey to uncover the wonders of our
            planet.
          </p>
        </motion.div>

        {/* cards section */}
        <div className="grid grid-cold-1 md:grid-cols-2 gap-14 place-items-center mt-20">
          {JournalData.map((data) => (
            <motion.div
              variants={SlideUp(data.delay)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              key={data.id}
            >
              <div className="overflow-hidden ">
                <img
                  src={data.image}
                  alt=""
                  className="w-full h-[350px] object-cover "
                />
              </div>
              {/* card text section */}
              <div className="space-y-1 py-6 text-center px-12">
                <p className="uppercase">{data.date}</p>
                <p className=" text-xl font-semibold font-merriweather">
                  {data.title}
                </p>
                <p className="!mt-8">{data.about}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Journal;
