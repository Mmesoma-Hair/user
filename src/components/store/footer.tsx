import Link from "next/link";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/catalog", label: "All products" },
      { href: "/catalog?category=apparel", label: "Apparel" },
      { href: "/cart", label: "Your cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/account", label: "Your account" },
      { href: "/account/orders", label: "Orders" },
      { href: "/account/settings", label: "Notifications" },
    ],
  },
];

export function Footer({
  storeName,
  tagline,
  supportEmail,
}: {
  storeName: string;
  tagline: string;
  supportEmail: string;
}) {
  return (
    <footer className="mt-20 border-t border-ink/10 bg-white">
      <div className="container-site grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-lg font-bold text-ink">
            {storeName}
          </div>
          <p className="mt-3 max-w-xs text-sm text-ink/60">{tagline}</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink/60 transition hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-sm font-semibold text-ink">Help</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={`mailto:${supportEmail}`}
                className="text-sm text-ink/60 transition hover:text-primary"
              >
                Contact support
              </a>
            </li>
            <li className="text-sm text-ink/45">{supportEmail}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-6 text-xs text-ink/50 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {storeName}. All rights reserved.
          </span>
          <span>Secured checkout · Powered by {storeName}</span>
        </div>
      </div>
    </footer>
  );
}
