import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import api from "../../api";
import OtherServiceItem from "./OtherServiceItem";
import { motion } from "framer-motion";

const OtherServices = ({ currentId }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/services");
        const list = Array.isArray(data) ? data : [];
        setServices(list.filter((s) => s._id !== currentId));
      } catch (e) {
        // boş catch yerine defansif log
        console.error("GET /services (other) error:", e?.response?.data || e);
        setServices([]);
      }
    })();
  }, [currentId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-3xl bg-white/80 backdrop-blur border shadow-sm p-5 sticky top-6"
    >
      <h3 className="text-lg font-bold text-brandBlue mb-4">Diğer Hizmetler</h3>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {services.length > 0 ? (
          services.map((s) => <OtherServiceItem key={s._id} service={s} />)
        ) : (
          <p className="text-sm text-gray-500">Henüz başka hizmet yok.</p>
        )}
      </div>
    </motion.div>
  );
};

OtherServices.propTypes = {
  currentId: PropTypes.string.isRequired,
};

export default OtherServices;
