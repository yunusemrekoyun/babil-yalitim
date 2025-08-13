import PropTypes from "prop-types";
import { Menu, Shield, CircleUserRound } from "lucide-react";
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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-200">
      <div className="h-16 flex items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100"
          aria-label="Menüyü aç"
        >
          <Menu size={20} />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-slate-700" />
          <h1 className="text-base sm:text-lg font-semibold text-slate-800">
            {current}
          </h1>
        </div>

        {/* right slot */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
              <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
              aktif
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-200 grid place-items-center text-slate-600">
            <CircleUserRound size={18} />
          </div>
        </div>
      </div>
    </header>
  );
};

Topbar.propTypes = {
  onMenuClick: PropTypes.func,
};

export default Topbar;
