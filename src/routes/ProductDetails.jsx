import ProductHero from "../components/Product/ProductHero.jsx";
import ProductOverview from "../components/Product/ProductOverview.jsx";
import RelatedProducts from "../components/Product/RelatedProducts.jsx";
import AddToCart from "../components/Product/AddToCart.jsx";
import { useEffect, useState } from "react";
import { getProduct } from "../../api/products.js";
import classes from "./ProductDetails.module.css";
import { useLoaderData } from "react-router";
export default function ProductDetails({ id }) {
  const product = useLoaderData();

  // const [product, setProduct] = useState();
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   useEffect(() => {
  //     console.log('data');
  //     async function fetchProduct() {
  //       try {
                    

  //         setLoading(true);
  //         const data = await getProduct(id);
  //         console.log('data', data);
  //         setProduct(data);
  //       } catch (err) {
  //         setError(err.Message);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }

  //     fetchProduct();
  //   }, []);

  //TODO: Style these
  //   if (loading) return <p>Loading product...</p>;
  //   if (error) return <p>{error}</p>;
  //   if (!product) return <p>Product not found</p>;

  return (
    <>
      <main className={classes.productDetails}>
        <ProductHero product={product} />
        <ProductOverview description={product.description} />
        <RelatedProducts />
      </main>

      <AddToCart product={product} />
    </>
  );
}

export async function loader({ params }) {
  var id = params.id;
  const data = await getProduct(id);  //TODO GetDataFromAPI
  console.log(data);
  return data;
}
