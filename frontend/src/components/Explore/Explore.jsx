import Img1 from "../../assets/1.jpg";
import Img2 from "../../assets/2.jpg";
import Img3 from "../../assets/3.jpg";
import { motion } from "framer-motion";
import { SlideUp } from "../../utility/animation";
import { useInView } from "react-intersection-observer";

const ExploreData = [
  {
    id: 1,
    title: "Nearoyfjordan",
    place: "Norway",
    url: "#",
    image: Img1,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Antelop Canyon",
    place: "United States",
    url: "#",
    image: Img2,
    delay: 0.4,
  },
  {
    id: 3,
    title: "Lakes",
    place: "Austria",
    url: "#",
    image: Img3,
    delay: 0.6,
  },
];
const Explore = () => {
  // threshold'u artırdım, kaybolma animasyonunu yavaşlattım
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.35 });

  return (
    <>
      <section className="container" id="explore" ref={ref}>
        {/* header section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-center md:max-w-[650px] mx-auto space-y-4 "
        >
          <p className="text-3xl"> Explore the world</p>
          <p>
            we are all explorers, driven by curiosity and the desire to discover
            new horizons. Join us on a journey to uncover the wonders of our
            planet.
          </p>
        </motion.div>

        {/* cards section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center ">
          {ExploreData.map((data) => (
            <motion.div
              variants={SlideUp(data.delay)}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              key={data.id}
              className="relative"
            >
              <img
                src={data.image}
                alt=""
                className="w-[380px] h-[559px] object-cover "
              />
              <div
                className="absolute w-full bottom-0 inset-0 bg-brandDark/15"
              >
                <div className="h-full space-y-1 py-6 flex flex-col jıstify-end items-center">
                  <h3 className="text-2xl font-semibold"> {data.title}</h3>
                  <p className="uppercase">{data.place} </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Button Section */}
        <motion.button
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, delay: 1.1, ease: [0.4, 0, 0.2, 1] }}
          className="block mx-auto mt-6 text-brandBlue uppercase font-bold"
        >
          See More
        </motion.button>
      </section>
    </>
  );
};

export default Explore;
