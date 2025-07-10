import React from "react";
import FooterImg from "../../assets/footer.jpg";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const bgImg = {
  backgroundImage: `url(${FooterImg})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "cover",
};

const Footer = () => {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.18 });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1.2, delay: 0.2 }}
      style={bgImg}
      className="mt-0 pt-0 h-[500px] bg-brandDark relative flex justify-center items-end"
    >
      {/* Radial overlay */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 0, 0, 0.3) 50%, rgba(11, 11, 13, 0.5) 70%, rgba(11, 11, 13, 0.8) 90%)",
        }}
      ></div>

      {/* Footer text */}
      <p className="relative z-20 mb-6 text-white text-sm tracking-wide"></p>
    </motion.footer>
  );
};

export default Footer;
