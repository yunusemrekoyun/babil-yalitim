import { useEffect, useMemo, useState } from "react";
import ProjectItem from "./ProjectItem";
import api from "../../api";

const ProjectsPageComponent = () => {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tümü");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/projects");
        const list = Array.isArray(res.data) ? res.data : [];
        if (!cancelled) setProjects(list);
      } catch (e) {
        console.error(
          "[ProjectsPage] GET /projects failed:",
          e?.response?.data || e
        );
        if (!cancelled) setErr("Projeler getirilemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const uniq = new Set(
      projects.map((p) => (p.category || "").trim()).filter(Boolean)
    );
    return ["Tümü", ...Array.from(uniq)];
  }, [projects]);

  const filtered = useMemo(() => {
    const txt = q.trim().toLowerCase();
    return projects.filter((p) => {
      const okCat = cat === "Tümü" || (p.category || "").trim() === cat;
      if (!txt) return okCat;
      const haystack = `${p.title || ""} ${p.description || ""} ${
        p.category || ""
      }`.toLowerCase();
      return okCat && haystack.includes(txt);
    });
  }, [projects, q, cat]);

  if (loading)
    return (
      <section className="w-full py-16 text-center text-gray-500">
        Yükleniyor…
      </section>
    );

  if (err)
    return (
      <section className="w-full py-16 text-center text-red-600">{err}</section>
    );

  return (
    <section className="w-full">
      {/* BlogPage ile aynı toolbar hissiyatı */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex-1">
          <label className="sr-only" htmlFor="project-search">
            Projelerde ara
          </label>
          <input
            id="project-search"
            type="text"
            placeholder="Projelerde ara…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-xl border border-white/40 bg-white/60 backdrop-blur px-4 py-3 outline-none focus:ring-2 focus:ring-quaternaryColor transition shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                cat === c
                  ? "bg-quaternaryColor text-white border-quaternaryColor"
                  : "bg-white/60 text-gray-700 border-white/40 hover:bg-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        Toplam: {projects.length} • Filtrelenmiş: {filtered.length}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center text-gray-600 bg-white/50 backdrop-blur-xl border border-white/30 rounded-2xl py-16">
          Aramanızla eşleşen proje bulunamadı.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, index) => (
            <ProjectItem
              key={project._id || index}
              project={project}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProjectsPageComponent;
