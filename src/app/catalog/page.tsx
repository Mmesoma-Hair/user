import Link from "next/link";

import { SortSelect } from "@/features/catalog/sort-select";
import { ProductCard } from "@/features/catalog/product-card";
import { getCategories, getProducts } from "@/lib/catalog";
import { selectedCurrency } from "@/lib/currency";

export const metadata = { title: "Shop" };

const SORT_MAP: Record<string, string> = {
  newest: "-created_at",
  "price-asc": "price_from",
  "price-desc": "-price_from",
  name: "title",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; sort?: string };
}) {
  const currency = selectedCurrency();
  const ordering = SORT_MAP[searchParams.sort ?? "newest"] ?? "-created_at";
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category: searchParams.category,
      search: searchParams.search,
      ordering,
      currency,
    }),
  ]);
  const activeCategory = categories.find(
    (c) => c.slug === searchParams.category,
  );

  const catHref = (slug?: string) => {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (searchParams.search) p.set("search", searchParams.search);
    if (searchParams.sort) p.set("sort", searchParams.sort);
    const qs = p.toString();
    return qs ? `/catalog?${qs}` : "/catalog";
  };

  return (
    <div className="container-site py-10">
      <header className="mb-8">
        <nav className="mb-2 text-sm text-ink/50">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>{" "}
          /{" "}
          <span className="text-ink/70">{activeCategory?.name ?? "Shop"}</span>
        </nav>
        {(searchParams.search || activeCategory) && (
          <h1 className="font-display text-4xl font-bold text-ink">
            {searchParams.search
              ? `Results for “${searchParams.search}”`
              : activeCategory?.name}
          </h1>
        )}
        {searchParams.search && (
          <p className="mt-1 text-sm text-ink/55">
            <Link href="/catalog" className="text-primary hover:text-accent">
              clear search
            </Link>
          </p>
        )}
      </header>

      {/* Toolbar: categories + sort */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link
            href={catHref()}
            className={`border px-4 py-1.5 transition ${
              !searchParams.category
                ? "border-primary bg-primary text-blush"
                : "border-ink/15 bg-white text-ink hover:border-primary"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={catHref(c.slug)}
              className={`border px-4 py-1.5 transition ${
                searchParams.category === c.slug
                  ? "border-primary bg-primary text-blush"
                  : "border-ink/15 bg-white text-ink hover:border-primary"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </nav>
        {products.results.length > 0 && <SortSelect />}
      </div>

      {products.results.length === 0 ? (
        <div className="border border-dashed border-ink/15 bg-white p-16 text-center">
          <p className="text-ink/60">No products found.</p>
          <Link
            href="/catalog"
            className="mt-3 inline-block text-sm font-medium text-primary hover:text-accent"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
