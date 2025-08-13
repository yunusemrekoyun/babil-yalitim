import { useState } from "react";
import PropTypes from "prop-types";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * AdminLayout
 * - Mobilde aç/kapa yapılabilen bir sidebar
 * - Sticky topbar
 * - İçerik için kaydırılabilir alan
 */
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-800 flex overflow-hidden">
      {/* Sidebar (desktop: visible, mobile: slide-in) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sağ ana alan */}
      <div className="flex-1 relative flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* İçerik alanı */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6"
          role="main"
        >
          {children}
        </main>
      </div>

      {/* Mobil sidebar açıldığında arka plan overlay */}
      {sidebarOpen && (
        <button
          aria-label="Menüyü kapat"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
