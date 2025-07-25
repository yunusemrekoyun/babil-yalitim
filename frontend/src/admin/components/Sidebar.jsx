// admin/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/admin/dashboard", label: "Dashboard" },
  { path: "/admin/blogs", label: "Bloglar" },
  { path: "/admin/journals", label: "Haberler" },
  { path: "/admin/projects", label: "Projeler" },
  { path: "/admin/services", label: "Hizmetler" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-[#1E293B] text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`block px-3 py-2 rounded hover:bg-[#334155] ${
                location.pathname === link.path ? "bg-[#334155]" : ""
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        onClick={() => {
          localStorage.removeItem("isAdmin");
          window.location.href = "/admin";
        }}
        className="mt-10 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Çıkış Yap
      </button>
    </div>
  );
};

export default Sidebar;