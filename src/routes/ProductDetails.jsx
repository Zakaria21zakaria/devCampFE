import ProductHero from "../components/Product/ProductHero.jsx";
import ProductOverview from "../components/Product/ProductOverview.jsx";
import RelatedProducts from "../components/Product/RelatedProducts.jsx";
import AddToCart from "../components/Product/AddToCart.jsx";
import { useEffect, useState } from "react";
import { getProduct } from "../../api/products.js";
import classes from "./ProductDetails.module.css";
import { useLoaderData } from "react-router";
export default function ProductDetails() {
  const product = useLoaderData();
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

export async function loader({ params }) {
  var id = params.id;
  const data = await getProduct(id);
  return data;
}
