const bgVariants = {
  Hizmetler: "bg-secondaryColor/10 hover:bg-secondaryColor/20",
  Projeler: "bg-quaternaryColor/10 hover:bg-quaternaryColor/20",
  Markalar: "bg-brandBlue/10 hover:bg-brandBlue/20",
};

const LinkItem = ({ label, href, icon }) => {
  return (
    <a
      href={href}
      className={`group flex flex-row items-center justify-center flex-1 min-w-0 h-16 rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer select-none text-brandDark gap-3 px-6 font-medium text-lg ${bgVariants[label] || "bg-white/80 hover:bg-white"} transform hover:-translate-y-1`}
      style={{ textDecoration: 'none' }}
    >
      <span className="text-2xl transition-transform group-hover:scale-110 flex-shrink-0">{icon}</span>
      <span className="truncate group-hover:text-quaternaryColor transition-colors">
        {label}
      </span>
    </a>
  );
};

export default LinkItem; 