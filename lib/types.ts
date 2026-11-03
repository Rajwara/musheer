export type ProductOption = { label: string; values: string[] };

export type Product = {
  slug: string;
  name: string;
  colour: string;
  category: string;
  categorySlug: string;
  price: number;
  options: ProductOption[];
  sizeGuide: boolean;
  description: string;
  metaDescription: string;
  related: string[];
};

export type Category = {
  slug: string;
  title: string;
  group: string;
  siblings: string[];
  products: string[];
};

/** The slice of a product that cards, the cart and the wishlist need on the client. */
export type CardProduct = {
  slug: string;
  name: string;
  colour: string;
  category: string;
  price: number;
  image: string;
};

export type CartLine = { slug: string; options: string; qty: number };
