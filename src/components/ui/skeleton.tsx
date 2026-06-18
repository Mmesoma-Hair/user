export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-ink/10 ${className}`} />;
}

/** Placeholder matching a product card's footprint (image + title + price). */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col border border-ink/10 bg-white shadow-card">
      <Skeleton className="aspect-square w-full" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-5 w-1/3" />
      </div>
    </div>
  );
}
