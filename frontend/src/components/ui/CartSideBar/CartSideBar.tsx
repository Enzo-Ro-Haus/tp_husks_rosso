import { CartButton } from "../Buttons/CartButton/CartButton";
import { MercadoLibreButton } from "../Buttons/MercadoLibreButton/MercadoLibreButton";
import style from "./CartSideBar.module.css";

type CartSideBarProps = {
  total: number;
  onBuy: () => void;
  buyDisabled: boolean;
};

export const CartSideBar: React.FC<CartSideBarProps> = ({ total, onBuy, buyDisabled }) => {
  return (
    <div className={style.containerSideBarCart}>
      <h2 className={style.containerSideBarTitle}>CART</h2>
      <p className={style.price}><b>Total: </b>${total}</p>
      <CartButton onClick={onBuy} disabled={buyDisabled} />
      <MercadoLibreButton />
    </div>
  );
};
