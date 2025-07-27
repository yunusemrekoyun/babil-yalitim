// admin/components/AdminLayout.jsx
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* İçerik */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <Topbar />

        {/* Sayfa içeriği */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
