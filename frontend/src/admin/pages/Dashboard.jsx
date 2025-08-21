import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../api";
import PropTypes from "prop-types";

// Recharts
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/** ---------- Basit yardımcılar ---------- */
const fmtDate = (d) => {
  if (!d) return "";
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return "";
  return x.toLocaleDateString("tr-TR");
};
// Detay rotaları önce, liste rotaları sonra (sıra ÖNEMLİ)
const TR_PATH_MAP = [
  { test: /^\/$/, label: "Ana Sayfa" },
  { test: /^\/home(?:\/|$)/i, label: "Ana Sayfa" },

  // --- Detay sayfaları ---
  { test: /^\/project[-/]detail(?:\/|$)/i, label: "Proje Detayı" },
  { test: /^\/projects?\/[^/]+(?:\/|$)/i, label: "Proje Detayı" },

  { test: /^\/blog[-/]detail(?:\/|$)/i, label: "Blog Detayı" },
  { test: /^\/blog\/[^/]+(?:\/|$)/i, label: "Blog Detayı" },

  { test: /^\/journal[-/]detail(?:\/|$)/i, label: "Haber Detayı" },
  { test: /^\/journals?\/[^/]+(?:\/|$)/i, label: "Haber Detayı" },

  // (İstersen)
  { test: /^\/service[-/]detail(?:\/|$)/i, label: "Hizmet Detayı" },
  { test: /^\/services?\/[^/]+(?:\/|$)/i, label: "Hizmet Detayı" },

  // --- Liste/ana rotalar ---
  { test: /^\/projects?(?:\/|$)/i, label: "Projeler" },
  { test: /^\/blog(?:\/|$)/i, label: "Blog" },
  { test: /^\/journals?(?:\/|$)/i, label: "Haberler" },
  { test: /^\/services?(?:\/|$)/i, label: "Hizmetler" },
  { test: /^\/contact(?:\/|$)/i, label: "İletişim" },
  { test: /^\/about(?:\/|$)/i, label: "Hakkımızda" },
];

const trPathLabel = (path = "") => {
  for (const { test, label } of TR_PATH_MAP) {
    if (test.test(path)) return label;
  }
  return path || "-";
};
const toQuery = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => {
    if (v) params.append(k, v);
  });
  return params.toString();
};

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

/** ---------- Dashboard ---------- */
const Dashboard = () => {
  // Filtreler
  const [from, setFrom] = useState(""); // YYYY-MM-DD
  const [to, setTo] = useState("");
  const [section, setSection] = useState(""); // blog|journal|projects|services|home|other
  const [device, setDevice] = useState(""); // desktop|mobile|tablet
  const [country, setCountry] = useState("");
  const [path, setPath] = useState("");

  // Data states
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [summary, setSummary] = useState({
    total: 0,
    avgDuration: 0,
    avgScroll: 0,
    bySection: [],
    byDevice: [],
  });
  const [topPages, setTopPages] = useState([]);
  const [series, setSeries] = useState([]); // {date, count}
  const [recent, setRecent] = useState([]); // son kayıtlar liste
  const [recentLoading, setRecentLoading] = useState(false);

  const filters = useMemo(
    () => ({ from, to, section, device, country, path }),
    [from, to, section, device, country, path]
  );

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setErr("");

      const qs = toQuery(filters);
      const [summaryRes, topRes, tsRes] = await Promise.all([
        api.get(`/visits/summary${qs ? `?${qs}` : ""}`),
        api.get(`/visits/top-pages${qs ? `?${qs}` : ""}`),
        api.get(`/visits/timeseries${qs ? `?${qs}` : ""}`),
      ]);

      setSummary({
        total: summaryRes.data?.total || 0,
        avgDuration: summaryRes.data?.avgDuration || 0,
        avgScroll: summaryRes.data?.avgScroll || 0,
        bySection: Array.isArray(summaryRes.data?.bySection)
          ? summaryRes.data.bySection
          : [],
        byDevice: Array.isArray(summaryRes.data?.byDevice)
          ? summaryRes.data.byDevice
          : [],
      });

      setTopPages(Array.isArray(topRes.data) ? topRes.data : []);
      setSeries(Array.isArray(tsRes.data) ? tsRes.data : []);
    } catch (e) {
      console.error("Analytics fetch error:", e?.response?.data || e);
      setErr("Veriler alınamadı. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchRecent = useCallback(async () => {
    try {
      setRecentLoading(true);
      const qs = toQuery({ ...filters, limit: 30 });
      const { data } = await api.get(`/visits${qs ? `?${qs}` : ""}`);
      setRecent(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Recent fetch error:", e?.response?.data || e);
    } finally {
      setRecentLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAll();
    fetchRecent();
  }, [fetchAll, fetchRecent]);

  // Pie chart dataları normalize
  const pieSectionData = useMemo(
    () =>
      summary.bySection.map((x) => ({
        name: x._id || "Diğer",
        value: x.count,
      })),
    [summary.bySection]
  );
  const pieDeviceData = useMemo(
    () =>
      summary.byDevice.map((x) => ({ name: x._id || "Diğer", value: x.count })),
    [summary.byDevice]
  );

  return (
    <div className="p-6">
      <Header />

      {/* Filters */}
      <FilterBar
        from={from}
        to={to}
        section={section}
        device={device}
        country={country}
        path={path}
        onChange={{
          setFrom,
          setTo,
          setSection,
          setDevice,
          setCountry,
          setPath,
        }}
        onClear={() => {
          setFrom("");
          setTo("");
          setSection("");
          setDevice("");
          setCountry("");
          setPath("");
        }}
      />

      {/* Top stats */}
      {err ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {err}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Toplam Ziyaret" value={summary.total} />
            <StatCard title="Ortalama Süre (sn)" value={summary.avgDuration} />
            <StatCard title="Ortalama Scroll (%)" value={summary.avgScroll} />
            <StatCard
              title="Aktif Filtre"
              value={
                Object.values(filters).some(Boolean) ? "Filtrelenmiş" : "Yok"
              }
              subtle
            />
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Zaman Serisi */}
            <Card title="Ziyaret Zaman Serisi" loading={loading}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Ziyaret"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Section Pie */}
            <Card title="Bölüme Göre Dağılım" loading={loading}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieSectionData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                    >
                      {pieSectionData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Device Pie */}
            <Card title="Cihaza Göre Dağılım" loading={loading}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieDeviceData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      label
                    >
                      {pieDeviceData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Top pages + recent */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card title="En Popüler Sayfalar" loading={loading}>
              <TopPagesTable rows={topPages} />
            </Card>

            <Card title="Son Ziyaretler" loading={recentLoading}>
              <RecentTable rows={recent} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

/** ---------- Header ---------- */
const Header = () => (
  <div className="mb-4">
    <h1 className="text-2xl md:text-3xl font-bold">Analytics Dashboard</h1>
    <p className="text-gray-600">
      Ziyaret verilerini filtreleyin, trendleri ve en popüler sayfaları
      inceleyin.
    </p>
  </div>
);

/** ---------- FilterBar ---------- */
const FilterBar = ({
  from,
  to,
  section,
  device,
  country,
  path,
  onChange,
  onClear,
}) => {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-6">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Başlangıç</label>
          <input
            type="date"
            value={from}
            onChange={(e) => onChange.setFrom(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Bitiş</label>
          <input
            type="date"
            value={to}
            onChange={(e) => onChange.setTo(e.target.value)}
            className="rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Bölüm</label>
          <select
            value={section}
            onChange={(e) => onChange.setSection(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="">Tümü</option>
            <option value="home">Ana Sayfa</option>
            <option value="blog">Blog</option>
            <option value="journal">Journal</option>
            <option value="projects">Projeler</option>
            <option value="services">Hizmetler</option>
            <option value="other">Diğer</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Cihaz</label>
          <select
            value={device}
            onChange={(e) => onChange.setDevice(e.target.value)}
            className="rounded-md border px-3 py-2"
          >
            <option value="">Tümü</option>
            <option value="desktop">Masaüstü</option>
            <option value="mobile">Mobil</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Ülke (ISO)</label>
          <input
            value={country}
            onChange={(e) => onChange.setCountry(e.target.value.toUpperCase())}
            placeholder="Örn: TR"
            className="rounded-md border px-3 py-2"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Path</label>
          <input
            value={path}
            onChange={(e) => onChange.setPath(e.target.value)}
            placeholder="/blog veya /services"
            className="rounded-md border px-3 py-2"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onClear}
          className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
        >
          Filtreleri Temizle
        </button>
      </div>
    </div>
  );
};

/** ---------- StatCard ---------- */
const StatCard = ({ title, value, subtle = false }) => (
  <div className="rounded-xl border bg-white p-4">
    <div className="text-xs text-gray-500">{title}</div>
    <div
      className={`mt-1 text-2xl font-bold ${
        subtle ? "text-gray-700" : "text-blue-700"
      }`}
    >
      {value}
    </div>
  </div>
);

/** ---------- Card ---------- */
const Card = ({ title, loading, children }) => (
  <div className="rounded-xl border bg-white p-4">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {loading ? (
        <span className="text-xs text-gray-400">Yükleniyor…</span>
      ) : null}
    </div>
    {children}
  </div>
);

/** ---------- TopPagesTable ---------- */
const TopPagesTable = ({ rows }) => {
  if (!rows?.length) {
    return <div className="text-sm text-gray-500">Kayıt yok.</div>;
  }
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Path</th>
            <th className="py-2 pr-3">Ziyaret</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 pr-3">
                <span title={r.path}>{trPathLabel(r.path)}</span>
              </td>
              <td className="py-2 pr-3">{r.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** ---------- RecentTable ---------- */
const RecentTable = ({ rows }) => {
  if (!rows?.length) {
    return <div className="text-sm text-gray-500">Kayıt yok.</div>;
  }
  return (
    <div className="overflow-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-3">Tarih</th>
            <th className="py-2 pr-3">Path</th>
            <th className="py-2 pr-3">Cihaz</th>
            <th className="py-2 pr-3">Ülke</th>
            <th className="py-2 pr-3">Süre (sn)</th>
            <th className="py-2 pr-3">Scroll (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id} className="border-t">
              <td className="py-2 pr-3 whitespace-nowrap">
                {fmtDate(r.createdAt)}
              </td>
              <td className="py-2 pr-3">
                <span title={r.path}>{trPathLabel(r.path)}</span>
              </td>
              <td className="py-2 pr-3">{r.device || "-"}</td>
              <td className="py-2 pr-3">{r.country || "-"}</td>
              <td className="py-2 pr-3">{Number(r.duration || 0)}</td>
              <td className="py-2 pr-3">{Number(r.scrollDepth || 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** ---------- PropTypes ---------- */
FilterBar.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  section: PropTypes.string,
  device: PropTypes.string,
  country: PropTypes.string,
  path: PropTypes.string,
  onChange: PropTypes.shape({
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
    setSection: PropTypes.func.isRequired,
    setDevice: PropTypes.func.isRequired,
    setCountry: PropTypes.func.isRequired,
    setPath: PropTypes.func.isRequired,
  }).isRequired,
  onClear: PropTypes.func.isRequired,
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtle: PropTypes.bool,
};

Card.propTypes = {
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node,
};

TopPagesTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
    })
  ),
};

RecentTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      path: PropTypes.string,
      device: PropTypes.string,
      country: PropTypes.string,
      duration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      scrollDepth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default Dashboard;
