// ServiceDetailsPage.jsx
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/ui/Breadcrumb";
import ServiceDetails from "../components/Service/ServiceDetails";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const { data } = await api.get(`/services/${id}`);
        setTitle(data?.title || "");
      } catch (err) {
        console.error("Breadcrumb title fetch error:", err);
      }
    })();
  }, [id]);

  return (
    <>
      <NavbarPage />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", path: "/" },
            { label: "Hizmetler", path: "/services" },
            { label: title || "Yükleniyor..." },
          ]}
        />
      </div>
      <ServiceDetails />
      <Footer />
    </>
  );
};

export default ServiceDetailsPage;
