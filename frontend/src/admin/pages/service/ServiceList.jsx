// src/admin/pages/service/ServiceList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";

// geleni güvenli diziye çevir
const toArray = (data) => (Array.isArray(data) ? data : []);

const ServiceList = () => {
  const [services, setServices] = useState([]); // her zaman dizi
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [err, setErr] = useState("");

  // toast
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  // confirm
  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/services");
        setServices(toArray(data));
      } catch (e) {
        console.error("GET /services error:", e?.response?.data || e);
        const msg = e?.response?.data?.message || "Servisler getirilemedi.";
        setErr(msg);
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const cats = useMemo(() => {
    const s = new Set();
    services.forEach((x) => x.category && s.add(x.category));
    return ["all", ...Array.from(s)];
  }, [services]);

  const filtered = useMemo(() => {
    let arr = [...services];
    const s = q.trim().toLowerCase();
    if (s) {
      arr = arr.filter(
        (x) =>
          x.title?.toLowerCase().includes(s) ||
          x.description?.toLowerCase().includes(s) ||
          x.type?.toLowerCase().includes(s)
      );
    }
    if (cat !== "all") arr = arr.filter((x) => x.category === cat);
    return arr;
  }, [services, q, cat]);

  const askDelete = (id, title) => {
    setConfirm({
      open: true,
      title: "Hizmeti Sil",
      message: `"${title || "Bu hizmet"}" silinsin mi? Bu işlem geri alınamaz.`,
      onConfirm: async () => {
        try {
          await api.delete(`/services/${id}`);
          setServices((prev) => prev.filter((s) => s._id !== id));
          showToast("Hizmet silindi.", "success");
        } catch (e) {
          console.error("DELETE /services/:id error:", e?.response?.data || e);
          showToast(
            e?.response?.data?.message || "Hizmet silinemedi.",
            "error"
          );
        } finally {
          setConfirm((c) => ({ ...c, open: false }));
        }
      },
    });
  };

  if (loading) return <p className="p-4">Yükleniyor…</p>;
  if (err) return <p className="p-4 text-red-600">{err}</p>;

  return (
    <div className="p-4 md:p-6">
      {/* üst bar */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Hizmetler</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara (başlık/tür/açıklama)"
            className="w-full sm:w-64 rounded-md border px-3 py-2 text-sm"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {cats.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "Tüm Kategoriler" : c}
              </option>
            ))}
          </select>
          <Link
            to="/admin/services/add"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm hover:bg-indigo-700"
          >
            + Yeni Hizmet
          </Link>
        </div>
      </div>

      {/* liste */}
      {filtered.length === 0 ? (
        <div className="rounded-md border p-6 text-center text-gray-500">
          Kayıt bulunamadı.
        </div>
      ) : (
        <table className="w-full border-collapse overflow-hidden rounded-lg border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="border p-2">Kapak</th>
              <th className="border p-2">Başlık</th>
              <th className="border p-2">Tür</th>
              <th className="border p-2">Kategori</th>
              <th className="border p-2 w-40">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="align-top">
                <td className="border p-2">
                  {s.cover?.url ? (
                    <div className="relative">
                      {s.cover.resourceType === "video" ? (
                        <>
                          <video
                            src={s.cover.url}
                            className="h-16 w-24 object-cover rounded-md"
                            muted
                            playsInline
                          />
                          <span className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-black/70 text-white">
                            video
                          </span>
                        </>
                      ) : (
                        <img
                          src={s.cover.url}
                          alt={s.title}
                          className="h-16 w-24 object-cover rounded-md"
                        />
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2">
                  <div className="font-medium">{s.title}</div>
                  {Array.isArray(s.usageAreas) && s.usageAreas.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {s.usageAreas.slice(0, 3).map((u) => (
                        <span
                          key={u}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
                        >
                          {u}
                        </span>
                      ))}
                      {s.usageAreas.length > 3 && (
                        <span className="text-[11px] text-gray-400">
                          +{s.usageAreas.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="border p-2">{s.type || "-"}</td>
                <td className="border p-2">{s.category || "-"}</td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/services/edit/${s._id}`}
                      className="inline-flex items-center rounded-md bg-yellow-500 px-3 py-1.5 text-white hover:bg-yellow-600"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => askDelete(s._id, s.title)}
                      className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Toast */}
      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm */}
      {confirm.open && (
        <ConfirmDialog
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
          onConfirm={confirm.onConfirm}
        />
      )}
    </div>
  );
};

export default ServiceList;
