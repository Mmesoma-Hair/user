import "server-only";

import { cache } from "react";

import { backendFetch } from "./api";

export type HeroConfig = {
  badge: string;
  headline: string;
  subtext: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  backgroundUrl: string;
  /** Brand overlay opacity over the background, 0–1. */
  overlayOpacity: number;
  sideImages: string[];
};

/** A footer social link: display name, destination URL, and an icon key
 * (see components/store/social-icons). Fully admin-managed. */
export type SocialLink = { name: string; url: string; icon: string };

/** A home-page SEO content block. `{store}` in either field is replaced with
 * the store name; blank lines in `body` separate paragraphs. Admin-managed. */
export type SeoSection = { heading: string; body: string };

export type StoreConfig = {
  name: string;
  tagline: string;
  supportEmail: string;
  announcement: string;
  /** Delivery URL of the admin-uploaded store logo, or "" to use the wordmark. */
  logoUrl: string;
  /** Public contact phone (order_chat.phone_number), used for SEO/schema. */
  phone: string;
  /** Admin-set brand colours (hex). */
  brand: { primary: string; accent: string };
  /** Hide out-of-stock products from the storefront. */
  hideOutOfStock: boolean;
  hero: HeroConfig;
  /** Admin-managed footer social links. */
  social: SocialLink[];
  /** Admin-managed home-page SEO content blocks. */
  seo: SeoSection[];
};

const FALLBACK: StoreConfig = {
  name: "Eandewigs",
  tagline: "Shop the world.",
  supportEmail: "support@eandewigs.test",
  announcement: "",
  logoUrl: "",
  phone: "",
  brand: { primary: "#6E0D25", accent: "#C9184A" },
  hideOutOfStock: false,
  hero: {
    badge: "New season · 2026 collection",
    headline: "Shop the world, pay your way.",
    subtext:
      "Curated products, live multi-currency pricing, and a checkout you can even share with a friend.",
    ctaPrimaryLabel: "Shop now",
    ctaPrimaryHref: "/catalog",
    ctaSecondaryLabel: "Explore apparel",
    ctaSecondaryHref: "/catalog?category=apparel",
    backgroundUrl: "",
    overlayOpacity: 0.6,
    sideImages: [],
  },
  social: [
    { name: "Instagram", url: "https://instagram.com", icon: "instagram" },
    { name: "TikTok", url: "https://tiktok.com", icon: "tiktok" },
    { name: "YouTube", url: "https://youtube.com", icon: "youtube" },
    { name: "Facebook", url: "https://facebook.com", icon: "facebook" },
    { name: "Pinterest", url: "https://pinterest.com", icon: "pinterest" },
  ],
  // Empty fallback: the SEO block degrades gracefully if the API is unreachable
  // (the backend always supplies the rich default otherwise).
  seo: [],
};

/**
 * The admin-managed store identity (storeconfig public settings).
 * `cache()` dedupes the fetch to one call per server request, no matter how many
 * components read it. Falls back to sensible defaults if the API is unreachable.
 */
export const getStoreConfig = cache(async (): Promise<StoreConfig> => {
  try {
    const data = await backendFetch<{ settings: Record<string, unknown> }>(
      "/config/",
    );
    const s = data.settings ?? {};
    const str = (key: string, fallback: string) =>
      typeof s[key] === "string" && s[key] ? (s[key] as string) : fallback;
    // Like `str` but preserves an explicitly-cleared (empty) admin value — so
    // emptying a hero text in the admin actually hides it (no fallback).
    const raw = (key: string, fallback: string) =>
      typeof s[key] === "string" ? (s[key] as string) : fallback;
    const h = FALLBACK.hero;
    const logoId = str("store.logo_public_id", "");
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
    const logoUrl =
      logoId && cloud
        ? `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,h_80/${logoId}`
        : "";
    const sideImages = Array.isArray(s["hero.side_images"])
      ? (s["hero.side_images"] as unknown[]).filter(
          (u): u is string => typeof u === "string" && u.length > 0,
        )
      : [];
    // Present-but-empty means the admin removed all links, so only fall back
    // when the key is absent/not a list.
    const social: SocialLink[] = Array.isArray(s["footer.social_links"])
      ? (s["footer.social_links"] as unknown[]).flatMap((it) => {
          if (it && typeof it === "object") {
            const o = it as Record<string, unknown>;
            if (typeof o.name === "string" && typeof o.url === "string") {
              return [
                {
                  name: o.name,
                  url: o.url,
                  icon: typeof o.icon === "string" ? o.icon : "website",
                },
              ];
            }
          }
          return [];
        })
      : FALLBACK.social;
    const seo: SeoSection[] = Array.isArray(s["content.seo_sections"])
      ? (s["content.seo_sections"] as unknown[]).flatMap((it) => {
          if (it && typeof it === "object") {
            const o = it as Record<string, unknown>;
            if (typeof o.heading === "string" && typeof o.body === "string") {
              return [{ heading: o.heading, body: o.body }];
            }
          }
          return [];
        })
      : FALLBACK.seo;
    return {
      name: str("store.name", FALLBACK.name),
      tagline: str("store.tagline", FALLBACK.tagline),
      supportEmail: str("store.support_email", FALLBACK.supportEmail),
      announcement:
        typeof s["content.announcement"] === "string"
          ? (s["content.announcement"] as string)
          : "",
      logoUrl,
      phone: str("order_chat.phone_number", ""),
      brand: {
        primary: str("branding.primary_color", FALLBACK.brand.primary),
        accent: str("branding.accent_color", FALLBACK.brand.accent),
      },
      hideOutOfStock: s["catalog.hide_out_of_stock"] === true,
      hero: {
        // Text fields use `raw` so an admin can clear them to hide them.
        badge: raw("hero.badge", h.badge),
        headline: raw("hero.headline", h.headline),
        subtext: raw("hero.subtext", h.subtext),
        ctaPrimaryLabel: raw("hero.cta_primary_label", h.ctaPrimaryLabel),
        ctaPrimaryHref: str("hero.cta_primary_href", h.ctaPrimaryHref),
        ctaSecondaryLabel: raw("hero.cta_secondary_label", h.ctaSecondaryLabel),
        ctaSecondaryHref: str("hero.cta_secondary_href", h.ctaSecondaryHref),
        backgroundUrl: str("hero.background_url", ""),
        overlayOpacity:
          typeof s["hero.overlay_opacity"] === "number"
            ? Math.min(1, Math.max(0, Number(s["hero.overlay_opacity"]) / 100))
            : h.overlayOpacity,
        sideImages,
      },
      social,
      seo,
    };
  } catch {
    return FALLBACK;
  }
});
