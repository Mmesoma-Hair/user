import { FavouritesList } from "@/features/account/favourites-list";

export const metadata = { title: "Favourites" };

export default function FavouritesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-3xl font-bold text-ink">Favourites</h1>
      <FavouritesList />
    </div>
  );
}
