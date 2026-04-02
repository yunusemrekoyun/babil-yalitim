// ServiceDetailsPage.jsx
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/ui/Breadcrumb";
import ServiceDetails from "../components/Service/ServiceDetails";
import { useLocation } from "react-router-dom";

const ServiceDetailsPage = () => {
  const location = useLocation();
  const title = location.state?.title || "";

  return (
    <>
      <NavbarPage />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", path: "/" },
            { label: "Hizmetler", path: "/services" },
            { label: title || "Hizmet Detayı" },
          ]}
        />
      </div>
      <ServiceDetails />
      <Footer />
    </>
  );
};

export default ServiceDetailsPage;
