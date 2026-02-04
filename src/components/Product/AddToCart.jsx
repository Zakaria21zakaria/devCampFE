import classes from './AddToCart.module.css'


export default function AddToCart({ product }) {
  return (
    <div className={classes.addToCart}>
      <div>
        {/* <strong>{product.name}</strong> */}
        <p>{`from ${product.price} p/m`}</p>
      </div>
      <button>Add to cart</button>
    </div>
  );
}