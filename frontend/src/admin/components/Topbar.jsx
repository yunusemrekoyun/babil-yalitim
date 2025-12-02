import PropTypes from "prop-types";
import { Menu, Shield, CircleUserRound, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";

/**
 * Basit route → başlık eşleme
 */
const TITLES = [
  { path: "/admin/dashboard", title: "Dashboard" },
  { path: "/admin/blogs", title: "Bloglar" },
  { path: "/admin/journals", title: "Haberler" },
  { path: "/admin/projects", title: "Projeler" },
  { path: "/admin/services", title: "Hizmetler" },
];

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const current =
    TITLES.find((t) => location.pathname.startsWith(t.path))?.title ||
    "Admin Panel";

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/70 backdrop-blur-2xl shadow-sm">
      <div className="h-16 flex items-center gap-4 px-4 sm:px-6 lg:px-10">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="inline-flex lg:hidden h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow hover:shadow-md"
          aria-label="Menüyü aç"
        >
          <Menu size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-400 to-blue-500 grid place-items-center text-white shadow-lg shadow-sky-200/70 border border-white/60">
            <Shield size={18} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Yönetim
            </p>
            <h1 className="text-base sm:text-lg font-semibold text-slate-900">
              {current}
            </h1>
          </div>
        </div>

        {/* right slot */}
        <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-slate-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-slate-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Çevrimiçi
          </span>
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 border border-slate-200 text-slate-700 shadow-sm">
            <Sparkles size={14} />
            Oturum açık
          </span>
        </div>

        <div className="ml-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white grid place-items-center text-slate-700 shadow-sm border border-slate-100">
            <CircleUserRound size={18} />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs text-slate-500">Admin</span>
            <span className="text-sm font-medium text-slate-900">Babil</span>
          </div>
          <button className="hidden lg:inline-flex h-10 items-center gap-2 rounded-xl bg-white px-3 text-xs text-slate-800 hover:shadow border border-slate-100">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Aktif
          </button>
        </div>
      </div>
    </header>
  );
};

Topbar.propTypes = {
  onMenuClick: PropTypes.func,
};

export default Topbar;
