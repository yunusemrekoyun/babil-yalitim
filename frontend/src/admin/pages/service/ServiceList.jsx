import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";

const ServiceList = () => {
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/services`);
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Servisler alınamadı", err);
      message.error("Servisler alınamadı");
    }
  };

  const deleteService = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/services/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      message.success(data.message);
      fetchServices();
    } catch (err) {
      console.error("Servis silinemedi", err);
      message.error("Servis silinemedi");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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
          <li key={service._id} className="border p-4 rounded shadow">
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
                  onClick={() => deleteService(service._id)}
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