import { getProducts } from "../../api/products";
import Product from "../components/Product/Product";
import classes from "./ProductCatalogue.module.css";
import { useLoaderData } from "react-router";
 
export default function ProductCatalogue() {
  const products = useLoaderData();

  return (
    <div className={classes.catalogue}>
      {products.map((product) => (
        <Product
          key={product.id}
          id ={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}

export async function loader() {
  const data = await getProducts();
  return data;
}
