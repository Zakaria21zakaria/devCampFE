import classes from "./Product.module.css";
import phoneImage from "../../assets/phone.jpg";
import { NavLink } from "react-router";
import type { Product as ProductType } from "../../types/product";

export type ProductCardProps = Pick<ProductType, "id" | "name" | "price"> &
	Partial<Pick<ProductType, "description" | "imageUrl">>;

export default function Product({ id, name, price }: ProductCardProps) {
  return (
    <div className={classes.card}>
      <NavLink to={`product/${id}`} className={classes.link}>
        <img src={phoneImage} alt="productimage" />
        <div className={classes.container}>
          <h4>
            <b>{name}</b>
          </h4>
          <p>{`from ${price} p/m`}</p>
        </div>
      </NavLink>
    </div>
  );
}
