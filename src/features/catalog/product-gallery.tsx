"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImage } from "@/types/catalog";

export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center border border-ink/10 bg-white text-ink/30">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-square overflow-hidden border border-ink/10 bg-white">
        <Image
          src={current.urls.detail}
          alt={current.alt_text || title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-square overflow-hidden border bg-white transition ${
                i === active
                  ? "border-primary ring-1 ring-primary"
                  : "border-ink/10 hover:border-ink/30"
              }`}
            >
              <Image
                src={img.urls.thumb}
                alt={img.alt_text || `${title} thumbnail ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
