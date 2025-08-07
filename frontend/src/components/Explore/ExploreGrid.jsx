// src/components/Explore/ExploreGrid.jsx
import { useState, useEffect, useRef } from "react";
import api from "../../api";

const ExploreGrid = () => {
  const [services, setServices] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    api
      .get("/services")
      .then((res) => {
        setServices(res.data);
      })
      .catch((err) => {
        console.error("Hizmet verileri alınamadı:", err);
      });
  }, []);

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
      {services.map((item, index) => (
        <div
          key={item._id || index}
          className="relative group overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] bg-black"
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
        >
          <video
            ref={(el) => (videoRefs.current[index] = el)}
            src={item.videoUrl}
            muted
            loop
            playsInline
            className="w-[200px] h-[290px] md:w-[280px] md:h-[420px] object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-60 transition duration-300 flex items-end justify-center p-4">
            <p className="text-white text-lg font-semibold">{item.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreGrid;