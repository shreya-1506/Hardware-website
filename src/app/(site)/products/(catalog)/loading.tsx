import { ProductCardSkeleton } from "@/components/site/ProductCard";

export default function LoadingProducts() {
  return (
    <>
      <div className="bg-steel-sheen">
        <div className="container-x py-10 lg:py-14">
          <div className="h-3 w-40 rounded bg-white/10" />
          <div className="mt-6 h-3 w-28 rounded bg-white/10" />
          <div className="mt-4 h-10 w-2/3 max-w-xl rounded bg-white/10" />
          <div className="mt-4 h-3 w-full max-w-2xl rounded bg-white/10" />
        </div>
      </div>

      <section className="bg-white pb-16 pt-8 lg:pb-24">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
