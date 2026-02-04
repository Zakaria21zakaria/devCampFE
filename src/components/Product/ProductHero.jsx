import classes from './ProductHero.module.css'
import phoneImage from "../../assets/phone.jpg"

export default function ProductHero({ product }) {
  return (
    <section className={classes.hero}>
      <img src={phoneImage} alt={product.name} />
      <h1>{product.name}</h1>
    </section>
  );
}
