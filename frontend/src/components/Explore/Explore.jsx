import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../../api"; // axios instance

const Explore = () => {
  const [videoData, setVideoData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasMounted(true);
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        setVideoData(res.data);
      })
      .catch((err) => {
        console.error("Hizmet verileri alınamadı:", err);
      });
  }, []);

  const getIndex = (offset) =>
    (currentIndex + offset + videoData.length) % videoData.length;

  const visibleSlots = [
    { slot: "prev2", index: getIndex(-2) },
    { slot: "prev1", index: getIndex(-1) },
    { slot: "center", index: getIndex(0) },
    { slot: "next1", index: getIndex(1) },
    { slot: "next2", index: getIndex(2) },
  ];

  const slotClassMap = {
    prev2: "hidden md:block scale-75 blur-sm -translate-x-56 z-0 opacity-40",
    prev1: "scale-90 blur-sm -translate-x-28 z-10 opacity-70",
    center: "scale-100 blur-0 translate-x-0 z-20 opacity-100",
    next1: "scale-90 blur-sm translate-x-28 z-10 opacity-70",
    next2: "hidden md:block scale-75 blur-sm translate-x-56 z-0 opacity-40",
  };

  const getSlotClass = (slot) =>
    hasMounted ? slotClassMap[slot] : "opacity-0 scale-95";

  const stopAllVideosExcept = (indexToPlay) => {
    videoRefs.current.forEach((video, idx) => {
      if (video) {
        if (idx === indexToPlay) {
          video.play();
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  };

  useEffect(() => {
    stopAllVideosExcept(getIndex(0));
  }, [currentIndex, videoData]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % videoData.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoData.length) % videoData.length);
  };

  if (videoData.length === 0) return null; // yüklenene kadar render etme

  return (
    <section className="relative text-white py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-secondaryColor mb-2">
          Hizmetlerimiz
        </h2>
        <div className="h-1 w-20 bg-quaternaryColor mx-auto rounded"></div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-white/20 z-30"
        >
          <ChevronLeft size={28} />
        </button>

        <div className="relative flex items-center justify-center w-full max-w-full md:max-w-7xl h-[500px]">
          {visibleSlots.map(({ slot, index }) => (
            <motion.div
              key={`${slot}-${index}`}
              className={`absolute transition-all duration-500 ease-in-out rounded-xl overflow-hidden ${getSlotClass(
                slot
              )}`}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={videoData[index].videoUrl}
                muted
                loop
                playsInline
                className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
              />

              {slot === "center" && (
                <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-4">
                  <p className="text-white text-lg font-semibold">
                    {videoData[index].title}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <button
          onClick={next}
          className="text-white bg-black/40 p-2 rounded-full hover:bg-white/20 z-30"
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        className="absolute bottom-6 right-6 z-40"
      >
        <a
          href="/explore"
          className="flex items-center gap-2 text-sm text-white bg-quaternaryColor 
      px-4 py-2 rounded-full hover:bg-opacity-90 hover:shadow-lg hover:bg-white/20 
      transition-all duration-300"
        >
          Hizmetlerin detayları için...
          <ChevronRight size={16} />
        </a>
      </motion.div>
    </section>
  );
};

export default Explore;