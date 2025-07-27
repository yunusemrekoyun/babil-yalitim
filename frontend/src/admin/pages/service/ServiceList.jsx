// src/admin/pages/service/ServiceList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import api from "../../../api.js";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/services");
        setServices(data);
      } catch (err) {
        console.error("Servisler alınamadı:", err);
        const msg = err.response?.data?.message || "Servisler getirilemedi.";
        setError(msg);
        message.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bu servisi silmek istediğinize emin misiniz?")) return;
    try {
      const { data } = await api.delete(`/services/${id}`);
      message.success(data.message || "Servis silindi");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Servis silinemedi:", err);
      const msg = err.response?.data?.message || "Servis silinemedi.";
      message.error(msg);
    }
  };

  if (loading) return <p className="p-4">Yükleniyor...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Tüm Servisler</h2>
        <Link
          to="/admin/services/add"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Yeni Servis Ekle
        </Link>
      </div>
      <ul className="space-y-2">
        {services.map((service) => (
          <li
            key={service._id}
            className="border p-4 rounded shadow hover:bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">{service.title}</h3>
              <div className="space-x-2">
                <Link
                  to={`/admin/services/edit/${service._id}`}
                  className="text-blue-600 hover:underline"
                >
                  Düzenle
                </Link>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="text-red-600 hover:underline"
                >
                  Sil
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
