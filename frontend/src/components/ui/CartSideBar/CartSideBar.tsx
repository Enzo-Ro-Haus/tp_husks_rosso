import { CartButton } from "../Buttons/CartButton/CartButton";
import style from "./CartSideBar.module.css";

export const CartSideBar = () => {
  return (
    <div className={style.containerSideBarCart}>
      <h2 className={style.containerSideBarTitle}>CART</h2>
      <p className={style.price}>Total: $12</p>
      <CartButton />
    </div>
  );
};
