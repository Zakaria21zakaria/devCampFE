import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import classes from "./AddToCart.module.css";
import type { Product as ProductType } from "../../types/product";

export default function AddToCart({ product }: { product: ProductType }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const addItemToCart = () => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      console.log("adding item to cart");
    }
  };

  return (
    <div className={classes.addToCart}>
      <div>
        {/* <strong>{product.name}</strong> */}
        <p>{`from ${product.price} p/m`}</p>
      </div>
      <button onClick={addItemToCart}>Add to cart</button>
    </div>
  );
}
