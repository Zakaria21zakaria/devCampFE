import classes from './ProductOverview.module.css'


export default function ProductOverview({ description }) {
  return (
    <section className={classes.overview}>
      <h3>About this product</h3>
      <p>{description}</p>
    </section>
  );
}