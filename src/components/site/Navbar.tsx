import { NavbarClient } from "@/components/site/NavbarClient";
import { listCategories } from "@/lib/queries";

/** Server wrapper so the category mega-menu always reflects the database. */
export function Navbar() {
  const categories = listCategories({ activeOnly: true }).map((category) => ({
    name: category.name,
    slug: category.slug,
    product_count: category.product_count,
  }));

  return <NavbarClient categories={categories} />;
}
