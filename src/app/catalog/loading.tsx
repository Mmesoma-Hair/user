import { ProductCardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function CatalogLoading() {
  return (
    <div className="container-site py-10">
      <header className="mb-8">
        <Skeleton className="mb-3 h-3 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-3 h-3 w-28" />
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
