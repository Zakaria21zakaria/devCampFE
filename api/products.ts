import type { Product } from "../src/types/product";

export async function getProduct(id : string) {
  const res = await fetch(`/client/v1/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
	return (await res.json()) as Product;
}

export async function getProducts() {
  const res = await fetch(`/client/v1/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
	return (await res.json()) as Product[];
}
