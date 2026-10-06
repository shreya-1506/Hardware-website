import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/lib/types";
import { cn, imageSrc } from "@/lib/utils";

export function CategoryCard({
  category,
  className,
  priority = false,
}: {
  category: Category;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-lg border border-steel-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-steel-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-safety-500 focus-visible:ring-offset-2",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-steel-100">
        <Image
          src={imageSrc(category.image)}
          alt={`${category.name} products`}
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
          priority={priority}
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-navy-900/45 via-transparent to-transparent"
        />
        <span className="absolute bottom-3 left-4 rounded bg-white/92 px-2 py-1 text-[10.5px] font-bold uppercase tracking-[0.1em] text-navy-800 backdrop-blur-sm">
          {category.product_count ?? 0}{" "}
          {(category.product_count ?? 0) === 1 ? "product" : "products"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[17px] font-bold leading-snug text-navy-900 transition-colors group-hover:text-safety-600">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-2 line-clamp-3 text-[13.5px] leading-relaxed text-steel-600">
            {category.description}
          </p>
        )}
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[13px] font-semibold text-safety-600">
          View products
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            strokeWidth={2.4}
          />
        </span>
      </div>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-safety-500 transition-transform duration-300 group-hover:scale-x-100"
      />
    </Link>
  );
}
