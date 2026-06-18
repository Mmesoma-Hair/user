import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";
import { SiteChrome } from "@/components/store/site-chrome";
import { ToastProvider } from "@/components/ui/toast";
import { FavouritesProvider } from "@/features/favourites/favourites-context";
import { getStoreConfig } from "@/lib/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { name, tagline } = await getStoreConfig();
  return {
    title: { default: name, template: `%s · ${name}` },
    description: tagline,
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans">
        <ToastProvider>
          <FavouritesProvider>
            <SiteChrome>{children}</SiteChrome>
          </FavouritesProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
