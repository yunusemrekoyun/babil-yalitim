// src/admin/pages/service/ServiceList.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
import ToastAlert from "../../components/ToastAlert";
import ConfirmDialog from "../../components/ConfirmDialog";
import OrderSelect from "../../components/OrderSelect";

const toArray = (data) => (Array.isArray(data) ? data : []);

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderingId, setOrderingId] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [err, setErr] = useState("");
  const inputCls =
    "w-full sm:w-64 rounded-xl border border-slate-200/70 bg-white/70 px-3 py-2.5 text-sm shadow-sm outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100 dark:focus:border-indigo-500/50 dark:focus:ring-indigo-500/30";

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "info", duration = 4000) =>
    setToast({ msg, type, duration });

  const [confirm, setConfirm] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    loading: false,
  });

  const fetchServices = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
      loading: false,
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, loading: true }));
        try {
          await api.delete(`/services/${id}`);
          await fetchServices();
          showToast("Hizmet silindi.", "success");
        } catch (e) {
          console.error("DELETE /services/:id error:", e?.response?.data || e);
          showToast(
            e?.response?.data?.message || "Hizmet silinemedi.",
            "error"
          );
        } finally {
          setConfirm((c) => ({ ...c, open: false, loading: false }));
        }
      },
    });
  };

  const handleOrderChange = async (id, nextOrder) => {
    try {
      setOrderingId(id);
      await api.patch(`/services/${id}/order`, { displayOrder: nextOrder });
      await fetchServices();
      showToast("Hizmet sırası güncellendi.", "success", 2500);
    } catch (e) {
      console.error("PATCH /services/:id/order error:", e?.response?.data || e);
      showToast(
        e?.response?.data?.message || "Hizmet sırası güncellenemedi.",
        "error"
      );
    } finally {
      setOrderingId("");
    }
  };

  if (loading) return <p className="p-4 text-slate-500">Yükleniyor…</p>;
  if (err) return <p className="p-4 text-red-500">{err}</p>;

  return (
    <div className="p-4 md:p-6 overflow-x-hidden space-y-5">
      <div className="admin-section p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-500/12 via-transparent to-slate-400/10 dark:from-[#2c2f36]/60 dark:via-transparent dark:to-[#1f2227]/50" />
        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="badge-soft">Hizmetler</span>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              Hizmetler
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Liste ve butonlar koyu/açık temayla uyumlu hale getirildi.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara (başlık/tür/açıklama)"
              className={inputCls}
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className={`${inputCls} sm:w-40`}
            >
              {cats.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "Tüm Kategoriler" : c}
                </option>
              ))}
            </select>
            <Link to="/admin/services/add" className="btn-admin-primary shrink-0">
              + Yeni Hizmet
            </Link>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card p-6 text-center text-slate-500 dark:text-slate-300">
          Kayıt bulunamadı.
        </div>
      ) : (
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
          <div className="admin-card p-0 overflow-hidden">
            <table className="min-w-[860px] w-full border-collapse text-sm">
              <thead className="bg-slate-50/70 text-left text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                <tr>
                  <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                    Kapak
                  </th>
                  <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                    Başlık
                  </th>
                  <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                    Sıra
                  </th>
                  <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                    Tür
                  </th>
                  <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                    Kategori
                  </th>
                  <th className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                    Alt Hizmetler
                  </th>
                  <th className="border border-slate-200/70 p-3 w-40 dark:border-slate-800/70">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="align-top transition hover:bg-indigo-50/60 dark:hover:bg-slate-800/40"
                  >
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
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
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {s.title}
                      </div>
                      {Array.isArray(s.usageAreas) && s.usageAreas.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {s.usageAreas.slice(0, 3).map((u) => (
                            <span
                              key={u}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                            >
                              {u}
                            </span>
                          ))}
                          {s.usageAreas.length > 3 && (
                            <span className="text-[11px] text-slate-400">
                              +{s.usageAreas.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      <OrderSelect
                        value={s.displayOrder || 1}
                        max={services.length || 1}
                        onChange={(value) => handleOrderChange(s._id, value)}
                        disabled={orderingId === s._id}
                      />
                    </td>
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      {s.type || "-"}
                    </td>
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      {s.category || "-"}
                    </td>
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      {Array.isArray(s.subServices) && s.subServices.length > 0 ? (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                            {s.subServices.length} alt hizmet
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {s.subServices.slice(0, 3).map((sub) => (
                              <span
                                key={sub._id || sub.title}
                                className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100"
                              >
                                #{sub.displayOrder || 1} {sub.title}
                              </span>
                            ))}
                            {s.subServices.length > 3 && (
                              <span className="text-[11px] text-slate-400">
                                +{s.subServices.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">Yok</span>
                      )}
                    </td>
                    <td className="border border-slate-200/70 p-3 dark:border-slate-800/70">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/services/edit/${s._id}`}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-700 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800"
                        >
                          Düzenle
                        </Link>
                        <button
                          onClick={() => askDelete(s._id, s.title)}
                          className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {toast && (
        <ToastAlert
          msg={toast.msg}
          type={toast.type}
          duration={toast.duration}
          onClose={() => setToast(null)}
        />
      )}

      {confirm.open && (
        <ConfirmDialog
          open={confirm.open}
          title={confirm.title}
          message={confirm.message}
          type="danger"
          onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
          onConfirm={confirm.onConfirm}
          loading={confirm.loading}
        />
      )}
    </div>
  );
};

export default ServiceList;
