import { useEffect, useState } from "react";
import Product from "./Product";
import classes from "./RelatedProducts.module.css";
import { getProducts } from "../../../api/products";
import type { Product as ProductType } from "../../types/product";

export default function RelatedProducts({
	product,
}: {
	product: ProductType;
}) {
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchproducts = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setRelatedProducts(data.filter((item) => item.id !== product.id));
        setError(null);
      } catch (err: unknown) {
		setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    fetchproducts();
  }, [product.id]);

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className={classes.related}>
      <h3>Related products</h3>
      <div className={classes.relatedGrid}>
        {relatedProducts.map((p) => (
          <Product key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
