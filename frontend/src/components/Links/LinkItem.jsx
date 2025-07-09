const LinkItem = ({ label, href, icon }) => {
  return (
    <a
      href={href}
      className="group flex flex-col items-center justify-center w-32 h-28 rounded-xl bg-brandDark/80 border border-brandDark/40 shadow-lg hover:bg-brandDark/60 hover:shadow-xl transition-all duration-200 cursor-pointer select-none text-white"
      style={{ textDecoration: 'none' }}
    >
      <span className="text-3xl mb-2 transition-transform group-hover:scale-110">{icon}</span>
      <span className="font-semibold text-lg tracking-wide group-hover:text-brandPrimary transition-colors">
        {label}
      </span>
    </a>
  );
};

export default LinkItem; 