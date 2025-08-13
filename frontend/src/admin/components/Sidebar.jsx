// src/admin/components/Sidebar.jsx
import PropTypes from "prop-types";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  FolderKanban,
  Wrench,
  LogOut,
  X,
  Home,
} from "lucide-react";

const links = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/blogs", label: "Bloglar", icon: FileText },
  { path: "/admin/journals", label: "Haberler", icon: Newspaper },
  { path: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { path: "/admin/services", label: "Hizmetler", icon: Wrench },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const linkClass = ({ isActive }) =>
    [
      "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition",
      isActive
        ? "bg-slate-800 text-white shadow-sm"
        : "text-slate-200 hover:bg-white/10 hover:text-white",
    ].join(" ");

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-slate-900 text-white border-r border-white/10">
        {/* Logo / Başlık */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/10 grid place-items-center">
              <span className="text-sm font-bold">BY</span>
            </div>
            <span className="font-semibold tracking-wide">Admin Panel</span>
          </div>
        </div>

        {/* Anasayfa butonu */}
        <div className="p-4 border-b border-white/10">
          <NavLink
            to="/"
            className="w-full inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 text-sm transition"
          >
            <Home size={18} />
            Anasayfa
          </NavLink>
        </div>

        {/* Linkler */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={linkClass}
              onClick={onClose}
              aria-current={location.pathname === path ? "page" : undefined}
            >
              <Icon size={18} className="opacity-90" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 text-sm transition"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 text-white border-r border-white/10 transform transition-transform duration-300 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/10 grid place-items-center">
              <span className="text-sm font-bold">BY</span>
            </div>
            <span className="font-semibold tracking-wide">Admin Panel</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Anasayfa butonu */}
        <div className="p-4 border-b border-white/10">
          <NavLink
            to="/"
            className="w-full inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 text-sm transition"
            onClick={onClose}
          >
            <Home size={18} />
            Anasayfa
          </NavLink>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={linkClass}
              onClick={onClose}
              aria-current={location.pathname === path ? "page" : undefined}
            >
              <Icon size={18} className="opacity-90" />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              onClose?.();
              logout();
            }}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-3 py-2.5 text-sm transition"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Sidebar;
