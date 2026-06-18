import Link from "next/link";

import { getCategories, getProducts } from "@/lib/catalog";
import { getStoreConfig } from "@/lib/config";
import { selectedCurrency } from "@/lib/currency";
import { ProductCard } from "@/features/catalog/product-card";
import { Hero } from "@/features/home/hero";

export default async function Home() {
  const currency = selectedCurrency();
  const [products, categories, { name: storeName }] = await Promise.all([
    getProducts({ currency }).catch(() => ({ results: [] })),
    getCategories().catch(() => []),
    getStoreConfig(),
  ]);
  const featured = products.results.slice(0, 8);

  return (
    <div>
      <Hero />

      {/* Value props */}
      <section className="border-y border-ink/10 bg-white">
        <div className="container-site grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { title: "Shop any currency", desc: "Live FX at checkout" },
            { title: "Fast fulfillment", desc: "Owned + dropship" },
            { title: "Pay for a friend", desc: "Share your cart" },
            { title: "Secure checkout", desc: "Your data, protected" },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <div className="text-sm font-semibold text-ink">{v.title}</div>
              <div className="mt-1 text-xs text-ink/55">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Category strip */}
      {categories.length > 0 && (
        <section className="container-site pt-14">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-ink/60">Browse:</span>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalog?category=${c.slug}`}
                className="rounded-full border border-ink/15 bg-white px-4 py-1.5 text-sm text-ink transition hover:border-primary hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container-site py-12">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink">
              Featured
            </h2>
            <p className="mt-1 text-sm text-ink/55">
              Hand-picked for you this week.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-sm font-medium text-primary hover:text-accent"
          >
            View all →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink/15 bg-white p-10 text-center text-ink/50">
            No products yet. Seed the catalog to see products here.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* CTA band */}
      <section className="container-site pb-4">
        <div className="overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-blush">
          <h2 className="font-display text-3xl font-bold">Join {storeName}</h2>
          <p className="mx-auto mt-2 max-w-md text-blush/80">
            Create an account for faster checkout, order tracking, and
            notifications your way.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-sm font-medium text-white transition hover:bg-accent-hover"
            >
              Create account
            </Link>
            <Link
              href="/catalog"
              className="inline-flex h-11 items-center rounded-full bg-blush/10 px-6 text-sm font-medium text-blush ring-1 ring-blush/30 transition hover:bg-blush/20"
            >
              Keep shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
