import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="container-site py-10">
      <Skeleton className="mb-6 h-3 w-48" />
      <div className="grid gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
        <div className="lg:py-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-10 w-3/4" />
          <Skeleton className="mt-6 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-8 h-12 w-full" />
          <Skeleton className="mt-3 h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
