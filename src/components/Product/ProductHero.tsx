import classes from './ProductHero.module.css'
import phoneImage from "../../assets/phone.jpg"
import type { Product as ProductType } from "../../types/product";

export default function ProductHero({ product }: { product: ProductType }) {
  return (
    <section className={classes.hero}>
      <img src={phoneImage} alt={product.name} />
      <h1>{product.name}</h1>
    </section>
  );
}
