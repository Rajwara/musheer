import "server-only";
import productsData from "./data/products.json";
import categoriesData from "./data/categories.json";
import homeData from "./data/home.json";
import { productImage } from "./images";
import type { CardProduct, Category, Product } from "./types";

export const products = productsData as Product[];
export const categories = categoriesData as Category[];
export const home = homeData as { bestSellers: string[]; featured: string[] };

const productMap = new Map(products.map((p) => [p.slug, p]));
const categoryMap = new Map(categories.map((c) => [c.slug, c]));

export const getProduct = (slug: string) => productMap.get(slug);
export const getCategory = (slug: string) => categoryMap.get(slug);

export function toCard(p: Product): CardProduct {
  return { slug: p.slug, name: p.name, colour: p.colour, category: p.category, price: p.price, image: productImage(p.slug) };
}

export function cards(slugs: string[]): CardProduct[] {
  return slugs.map(getProduct).filter((p): p is Product => Boolean(p)).map(toCard);
}

export const allCards = () => products.map(toCard);
