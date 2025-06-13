import { CartButton } from "../Buttons/CartButton/CartButton";
import { MercadoLibreButton } from "../Buttons/MercadoLibreButton/MercadoLibreButton";
import style from "./CartSideBar.module.css";

type CartSideBarProps = {
  total: number;
};

export const CartSideBar: React.FC<CartSideBarProps> = ({ total }) => {
  return (
    <div className={style.containerSideBarCart}>
      <h2 className={style.containerSideBarTitle}>CART</h2>
      <p className={style.price}><b>Total: </b>${total}</p>
      <CartButton />
      <MercadoLibreButton />
    </div>
  );
};
