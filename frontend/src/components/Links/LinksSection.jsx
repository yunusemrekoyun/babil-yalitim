import LinkItem from "./LinkItem";

const links = [
  { label: "Hizmetler", href: "#hizmetler", icon: "🛠️" },
  { label: "Projeler", href: "#projeler", icon: "📁" },
  { label: "Markalar", href: "#markalar", icon: "🏷️" },
];

const LinksSection = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-6">
        {links.map((link) => (
          <LinkItem key={link.label} label={link.label} href={link.href} icon={link.icon} />
        ))}
      </div>
    </div>
  );
};

export default LinksSection; 