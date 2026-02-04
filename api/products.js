export async function getProduct(id) {
  const res = await fetch(`/client/v1/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}
