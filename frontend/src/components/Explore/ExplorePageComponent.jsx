import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import ExploreGrid from "./ExploreGrid";

const ExplorePageComponent = () => {
  const [services, setServices] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Hizmet verileri alınamadı:", err));
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return services;
    return services.filter(
      (s) =>
        s.title?.toLowerCase().includes(t) ||
        s.description?.toLowerCase().includes(t)
    );
  }, [services, q]);

  return (
    <section className="w-full">
      {/* top bar */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="grow">
          <h2 className="text-2xl md:text-3xl font-bold text-secondaryColor">
            Tüm Hizmetler
          </h2>
          <p className="text-gray-600">
            Filtreleyin, göz atın ve detay sayfasından daha fazla bilgi alın.
          </p>
        </div>
        <div className="w-full md:w-80">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hizmet ara…"
            className="w-full px-4 py-2.5 rounded-xl bg-white/70 border border-white/70
                       outline-none focus:ring-2 focus:ring-quaternaryColor/40
                       placeholder:text-gray-400 text-gray-800 backdrop-blur"
          />
        </div>
      </div>

      <ExploreGrid services={filtered} />
    </section>
  );
};

export default ExplorePageComponent;
