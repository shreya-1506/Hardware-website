export type Spec = { name: string; value: string };
export type Variant = { name: string; detail: string };

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category_id: number | null;
  brand_id: number | null;
  short_description: string;
  description: string;
  image: string;
  gallery: string[];
  specifications: Spec[];
  applications: string[];
  variants: Variant[];
  featured: boolean;
  published: boolean;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  /** Joined display values. */
  category_name: string | null;
  category_slug: string | null;
  brand_name: string | null;
  brand_slug: string | null;
};

export type Enquiry = {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  product: string;
  quantity: string;
  message: string;
  source: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type AdminUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};
