import ProductHero from "./ProductHero";
import ProductOverview from "./ProductOverview";
import RelatedProducts from "./RelatedProducts";
import AddToCart from "./AddToCart";
import { getProduct } from "../../../api/products";
import classes from "./ProductDetails.module.css";
import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import type { Product as ProductType } from "../../types/product";
export default function ProductDetails() {
  const product = useLoaderData() as ProductType;
  return (
    <>
      <main className={classes.productDetails}>
        <ProductHero product={product} />
        <ProductOverview description={product.description} />
        <RelatedProducts product={product} />
      </main>

      <AddToCart product={product} />
    </>
  );
}

export async function loader({ params }: LoaderFunctionArgs) {
  const id = params.id;
  if (!id) {
    throw new Error("Missing product id");
  }
  return getProduct(id);
}
