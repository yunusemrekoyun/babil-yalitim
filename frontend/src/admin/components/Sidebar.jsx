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
  Sparkles,
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
      "group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition border border-transparent",
      isActive
        ? "bg-white text-slate-900 shadow-lg shadow-sky-200/60 border-slate-100"
        : "text-slate-700 hover:bg-white hover:text-slate-900 hover:border-slate-100",
    ].join(" ");

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-white/80 text-slate-800 border-r border-white/60 backdrop-blur-2xl shadow-xl shadow-slate-200/50 rounded-r-3xl">
        {/* Logo / Başlık */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-400 to-blue-500 grid place-items-center text-white shadow-lg shadow-sky-200/70 border border-white/60">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Babil
              </p>
              <span className="font-semibold tracking-wide text-slate-900">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Anasayfa butonu */}
        <div className="p-4 border-b border-white/10">
          <NavLink
            to="/"
            className="w-full inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-400/90 hover:to-emerald-500/90 text-white px-3 py-2.5 text-sm transition shadow-lg shadow-emerald-200/50"
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 to-orange-400 hover:from-rose-400/90 hover:to-orange-400/90 text-white px-3 py-2.5 text-sm transition shadow-lg shadow-rose-200/60"
          >
            <LogOut size={18} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/90 text-slate-900 border-r border-white/60 transform transition-transform duration-300 ease-out lg:hidden backdrop-blur-2xl shadow-2xl shadow-slate-200/70 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 grid place-items-center text-white shadow-lg shadow-indigo-500/40">
              <Sparkles size={16} />
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
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-500/90 hover:to-orange-500/90 text-white px-3 py-2.5 text-sm transition shadow-lg shadow-rose-500/20"
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
