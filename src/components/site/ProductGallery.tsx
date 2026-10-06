"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";
import { useState } from "react";

import { cn, imageSrc } from "@/lib/utils";

/**
 * Main product image with optional gallery thumbnails. Hovering zooms the image
 * the way a printed catalogue photo would be inspected under a loupe.
 */
export function ProductGallery({
  name,
  image,
  gallery = [],
  sku,
  featured,
}: {
  name: string;
  image: string;
  gallery?: string[];
  sku?: string;
  featured?: boolean;
}) {
  const images = [image, ...gallery].filter(
    (value, index, list) => value && list.indexOf(value) === index,
  );
  const shots = images.length > 0 ? images : [""];

  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-lg border border-steel-200 bg-steel-100 shadow-card"
      >
        <div className="relative aspect-[4/3]">
          <Image
            key={shots[active]}
            src={imageSrc(shots[active])}
            alt={name}
            fill
            sizes="(max-width: 1024px) 94vw, 46vw"
            priority
            className={cn(
              "object-cover transition-transform duration-[700ms] ease-out",
              zoomed ? "scale-[1.35]" : "scale-100",
            )}
          />
        </div>

        {featured && (
          <span className="absolute left-4 top-4 rounded bg-safety-500 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white shadow-sm">
            Featured product
          </span>
        )}

        {sku && (
          <span className="absolute right-4 top-4 rounded bg-white/92 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-navy-700 backdrop-blur-sm">
            Code: {sku}
          </span>
        )}

        <button
          type="button"
          onClick={() => setZoomed((value) => !value)}
          aria-pressed={zoomed}
          className="absolute bottom-4 right-4 inline-flex h-10 items-center gap-2 rounded-md border border-steel-200 bg-white/92 px-3.5 text-[12.5px] font-semibold text-navy-800 opacity-0 shadow-sm backdrop-blur-sm transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
        >
          <ZoomIn className="h-4 w-4" strokeWidth={2.2} />
          {zoomed ? "Reset zoom" : "Zoom image"}
        </button>

        {/* Engineering-sheet corner marks */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-3 h-5 w-5 border-l-2 border-t-2 border-navy-900/15"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 border-b-2 border-r-2 border-navy-900/15"
        />
      </motion.div>

      {shots.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {shots.map((shot, index) => (
            <button
              key={`${shot}-${index}`}
              type="button"
              onClick={() => {
                setActive(index);
                setZoomed(false);
              }}
              aria-label={`View image ${index + 1} of ${shots.length}`}
              aria-current={index === active}
              className={cn(
                "relative h-20 w-24 shrink-0 overflow-hidden rounded-md border-2 bg-steel-100 transition",
                index === active
                  ? "border-safety-500"
                  : "border-steel-200 hover:border-steel-400",
              )}
            >
              <Image
                src={imageSrc(shot)}
                alt=""
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
