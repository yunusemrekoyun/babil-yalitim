import { useLocation, useParams } from "react-router-dom";
import NavbarPage from "../components/Navbar/NavbarPage";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/ui/Breadcrumb";
import SubServiceDetails from "../components/Service/SubServiceDetails";

const SubServiceDetailsPage = () => {
  const location = useLocation();
  const { serviceId } = useParams();
  const parentTitle = location.state?.parentTitle || "Hizmet";
  const subServiceTitle = location.state?.subServiceTitle || "Alt Hizmet";

  return (
    <>
      <NavbarPage />
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Hizmetler", href: "/services" },
            { label: parentTitle, href: `/services/${serviceId}` },
            { label: subServiceTitle },
          ]}
        />
      </div>
      <SubServiceDetails />
      <Footer />
    </>
  );
};

export default SubServiceDetailsPage;
