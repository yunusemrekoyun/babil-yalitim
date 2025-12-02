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
    <div className="h-screen w-full bg-gradient-to-br from-[#f7fafc] via-white to-[#f1f5f9] text-slate-800 flex overflow-hidden relative">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.1),transparent_28%),radial-gradient(circle_at_55%_70%,rgba(99,102,241,0.08),transparent_25%)]" />

      {/* Sidebar (desktop: visible, mobile: slide-in) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sağ ana alan */}
      <div className="flex-1 relative flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* İçerik alanı */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-8"
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
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
