import { useRef } from "react";
import video1 from "../../assets/service1.mp4";
import video2 from "../../assets/service2.mp4";
import video3 from "../../assets/service3.mp4";
import video4 from "../../assets/service4.mp4";
import video5 from "../../assets/service5.mp4";
import video6 from "../../assets/service6.mp4";

const videoData = [
  { id: 1, src: video1 },
  { id: 2, src: video2 },
  { id: 3, src: video3 },
  { id: 4, src: video4 },
  { id: 5, src: video5 },
  { id: 6, src: video6 },
];

const ExploreGrid = () => {
  const videoRefs = useRef([]);

  const handleMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video) video.play();
  };

  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-16 place-items-center">
      {videoData.map((item, index) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] bg-black"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={item.src}
            muted
            loop
            playsInline
            className="w-[220px] h-[330px] md:w-[320px] md:h-[480px] object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-60 transition duration-300 flex items-end justify-center p-4">
            <p className="text-white text-lg font-semibold">
              Hizmet {item.id}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreGrid;