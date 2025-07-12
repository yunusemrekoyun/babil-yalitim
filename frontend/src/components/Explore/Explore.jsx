import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img4 from "../../assets/4.jpg";
import img5 from "../../assets/5.jpg";
import img6 from "../../assets/6.jpg";

import video1 from "../../assets/video1.mp4";
import video2 from "../../assets/video2.mp4";
import video3 from "../../assets/video3.mp4";

const videoData = [
  { id: 1, src: video1, type: "video" },
  { id: 2, src: video2, type: "video" },
  { id: 3, src: video3, type: "video" },
  { id: 4, src: img4, type: "image" },
  { id: 5, src: img5, type: "image" },
  { id: 6, src: img6, type: "image" },
];

const Explore = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHasMounted(true);
    }, 50);
    return () => clearTimeout(timeout);
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

  const getSlotClass = (slot) => {
    return hasMounted ? slotClassMap[slot] : "opacity-0 scale-95";
  };

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
  }, [currentIndex]);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % videoData.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + videoData.length) % videoData.length);
  };

  return (
    <section className="bg-tertiaryColor text-white py-20 px-6 overflow-hidden relative">
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
              key={videoData[index].id}
              className={`absolute transition-all duration-500 ease-in-out rounded-xl overflow-hidden ${getSlotClass(
                slot
              )}`}
            >
              {videoData[index].type === "video" ? (
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={videoData[index].src}
                  muted
                  loop
                  playsInline
                  className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
                />
              ) : (
                <img
                  src={videoData[index].src}
                  alt={`Media ${videoData[index].id}`}
                  className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
                />
              )}

              {slot === "center" && (
                <div className="absolute inset-0 bg-black/40 flex items-end justify-center p-4">
                  <p className="text-white text-lg font-semibold">
                    {videoData[index].type === "video"
                      ? `Video ${videoData[index].id} Oynatılıyor`
                      : `Proje ${videoData[index].id}`}
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
    </section>
  );
};

export default Explore;
