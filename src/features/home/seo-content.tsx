import type { SeoSection } from "@/lib/config";

/**
 * Long-form, admin-managed SEO content for the storefront home page (targets
 * queries like "best clothing supplier in Lagos Nigeria"). Each section's
 * `{store}` token is replaced with the store name, and blank lines in the body
 * split it into paragraphs. Renders nothing when there are no sections.
 */
export function SeoContent({
  storeName,
  sections,
}: {
  storeName: string;
  sections: SeoSection[];
}) {
  if (sections.length === 0) return null;
  const fill = (text: string) => text.split("{store}").join(storeName);

  return (
    <section className="border-t border-ink/10 bg-canvas">
      <div className="container-site py-16 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed text-ink/65">
          {sections.map((section, i) => {
            const paragraphs = fill(section.body)
              .split(/\n{2,}/)
              .map((p) => p.trim())
              .filter(Boolean);
            const heading = fill(section.heading).trim();
            return (
              <div key={i}>
                {heading && (
                  <h2
                    className={
                      i === 0
                        ? "font-display text-2xl font-bold text-ink sm:text-3xl"
                        : "font-display text-xl font-bold text-ink sm:text-2xl"
                    }
                  >
                    {heading}
                  </h2>
                )}
                {paragraphs.map((para, j) => (
                  <p key={j} className="mt-4">
                    {para}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
