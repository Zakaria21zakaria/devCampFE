export type ProductId = string;

export type Product = {
  id: ProductId;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
};
