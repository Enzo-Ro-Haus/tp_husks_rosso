import { NewProductButton } from "../Buttons/NewProductButton/NewProductButton";
import style from "./AdminSideBar.module.css";

export const AdminSideBar = () => {
  return (
    <div className={style.containerSideBar}>
        <h2 className={style.containerSideBarTitle}>Admin</h2>
        <h3 className={style.containerSideBarSubTitle}>Products/TSHIRT</h3>
      <div>
        <button>T-SHIRT</button>
      </div>
      <div>
        <button>SWEATSHIRT</button>
      </div>
      <div>
        <button>SHOES</button>
      </div>
      <NewProductButton/>
    </div>
  );
};
