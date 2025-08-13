import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useMemo } from "react";

/** slug -> Başlık */
const pretty = (s = "") =>
  decodeURIComponent(s)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

/** JSON-LD üret */
const toJsonLd = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.label,
    item: it.href || undefined,
  })),
});

const Breadcrumb = ({
  items, // [{label, href}] - verilmezse URL'den oluşturulur
  titleMap, // { "blog": "Blog", "services": "Hizmetler" } gibi
  homeLabel, // varsayılan "Anasayfa"
  className,
  showHomeIcon, // true: Home ikonu göster
  separator, // varsayılan: <ChevronRight .../>
  nonLinkLabels = [], // 👈 Bu listedeki etiketler link OLMAYACAK
}) => {
  const location = useLocation();

  // items verilmişse onu, verilmemişse URL segmentlerinden hesapla
  const computed = useMemo(() => {
    if (Array.isArray(items) && items.length) {
      // normalize: {label, href} bekleniyor
      return items.map((it) => ({ label: it.label, href: it.href }));
    }

    const segs = location.pathname.replace(/^\/+|\/+$/g, "").split("/");
    if (segs.length === 1 && segs[0] === "") return [];

    let acc = "";
    const arr = segs.map((seg, i) => {
      acc += "/" + seg;
      const isLast = i === segs.length - 1;
      const raw =
        (titleMap && titleMap[seg]) ||
        (isLast && seg.length > 24
          ? pretty(seg).slice(0, 24) + "…"
          : pretty(seg));
      return { label: raw, href: isLast ? undefined : acc };
    });
    return arr;
  }, [items, location.pathname, titleMap]);

  // Başta home varsa tekrar ekleme; yoksa ekle
  const withHome = useMemo(() => {
    const home = { label: homeLabel || "Anasayfa", href: "/" };
    if (
      computed.length > 0 &&
      (computed[0].href === "/" ||
        computed[0].label.toLowerCase() ===
          (homeLabel || "Anasayfa").toLowerCase())
    ) {
      return computed;
    }
    return [home, ...computed];
  }, [computed, homeLabel]);

  const Sep = separator || (
    <ChevronRight className="mx-2 h-4 w-4 text-gray-400 shrink-0" />
  );

  return (
    <nav aria-label="breadcrumbs" className={className || "w-full"}>
      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(toJsonLd(withHome))}
      </script>

      <ol className="flex items-center gap-0 text-sm text-gray-600 overflow-x-auto no-scrollbar">
        {withHome.map((it, i) => {
          const isLast = i === withHome.length - 1;
          const disableThis = isLast || nonLinkLabels.includes(it.label);
          const Cmp = it.href && !disableThis ? Link : "span";

          return (
            <li key={`${it.label}-${i}`} className="flex items-center shrink-0">
              <Cmp
                {...(Cmp === Link ? { to: it.href } : {})}
                className={
                  "inline-flex items-center gap-1 max-w-[44vw] sm:max-w-none " +
                  (disableThis
                    ? "text-secondaryColor font-semibold aria-[current]:text-secondaryColor"
                    : "hover:text-secondaryColor transition")
                }
                {...(disableThis ? { "aria-current": "page" } : {})}
                title={it.label}
              >
                {i === 0 && showHomeIcon !== false ? (
                  <Home className="h-4 w-4 mr-1" />
                ) : null}
                <span className="truncate">{it.label}</span>
              </Cmp>
              {!isLast && Sep}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  titleMap: PropTypes.object,
  homeLabel: PropTypes.string,
  className: PropTypes.string,
  showHomeIcon: PropTypes.bool,
  separator: PropTypes.element,
  nonLinkLabels: PropTypes.arrayOf(PropTypes.string),
};

export default Breadcrumb;
