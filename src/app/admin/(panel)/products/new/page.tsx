import { AdminPage } from "@/components/admin/AdminPage";
import { ProductForm } from "@/components/admin/ProductForm";
import { listBrands, listCategories } from "@/lib/queries";

export const metadata = { title: "Add product" };

export default function NewProductPage() {
  return (
    <AdminPage
      title="Add a product"
      description="Fill in the details, upload an image, add specifications and publish. Nothing here requires editing code."
      crumbs={[{ label: "Products", href: "/admin/products" }, { label: "Add" }]}
    >
      <ProductForm categories={listCategories()} brands={listBrands()} />
    </AdminPage>
  );
}
