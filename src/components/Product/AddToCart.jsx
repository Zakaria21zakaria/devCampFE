import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import classes from "./AddToCart.module.css";

export default function AddToCart({ product }) {
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
