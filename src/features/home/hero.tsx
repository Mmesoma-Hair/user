import Link from "next/link";

import { getStoreConfig } from "@/lib/config";

/**
 * Homepage hero — fully admin-controlled (storeconfig `hero.*`): badge,
 * headline, subtext, both CTAs, the background image, and the side-stack images.
 */
export async function Hero() {
  const { hero } = await getStoreConfig();
  const bg = hero.backgroundUrl || "/hero.jpg";
  const bgIsVideo =
    /\.(mp4|webm|ogg|mov)(\?|$)/i.test(bg) || bg.includes("/video/upload/");
  const sides = hero.sideImages.slice(0, 3);
  const slots = [
    "right-0 top-2 rotate-3 z-10",
    "right-24 top-10 -rotate-6 z-0",
    "right-12 top-6 z-20",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-[#3F0715] text-blush">
      {/* Background (image or video) at full opacity… */}
      {bgIsVideo ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={bg}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bg})` }}
          aria-hidden
        />
      )}
      {/* …with an admin-controlled brand overlay on top (opacity slider). */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#3F0715]"
        style={{ opacity: hero.overlayOpacity }}
        aria-hidden
      />

      <div className="container-site relative grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          {hero.badge && (
            <span className="inline-flex items-center bg-blush/10 px-3 py-1 text-xs font-medium ring-1 ring-blush/25">
              {hero.badge}
            </span>
          )}
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
            {hero.headline}
          </h1>
          {hero.subtext && (
            <p className="mt-5 max-w-md text-lg text-blush/80">{hero.subtext}</p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.ctaPrimaryLabel && (
              <Link
                href={hero.ctaPrimaryHref || "/catalog"}
                className="inline-flex h-12 items-center bg-accent px-7 text-base font-medium text-white shadow-lg transition hover:bg-accent-hover"
              >
                {hero.ctaPrimaryLabel}
              </Link>
            )}
            {hero.ctaSecondaryLabel && (
              <Link
                href={hero.ctaSecondaryHref || "/catalog"}
                className="inline-flex h-12 items-center bg-blush/10 px-7 text-base font-medium text-blush ring-1 ring-blush/30 transition hover:bg-blush/20"
              >
                {hero.ctaSecondaryLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Side stack: admin images, or a decorative placeholder */}
        {sides.length > 0 ? (
          <div className="relative hidden h-80 lg:block">
            {sides.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt=""
                className={`absolute h-72 w-56 object-cover shadow-2xl ${slots[i]}`}
              />
            ))}
          </div>
        ) : (
          <div className="relative hidden h-80 lg:block">
            <div className="absolute right-6 top-2 h-72 w-56 rotate-3 bg-blush/95 shadow-2xl" />
            <div className="absolute right-28 top-10 h-72 w-56 -rotate-6 bg-[#E9B872]/90 shadow-2xl" />
            <div className="absolute right-16 top-6 flex h-72 w-56 flex-col justify-end bg-white p-5 shadow-2xl">
              <div className="h-32 bg-gradient-to-br from-primary-50 to-accent-50" />
              <div className="mt-4 h-3 w-2/3 bg-ink/10" />
              <div className="mt-2 h-3 w-1/3 bg-ink/10" />
              <div className="mt-4 h-9 bg-accent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
